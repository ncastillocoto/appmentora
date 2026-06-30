/**
 * D-CREA — Destrezas de Comprensión y Resolución
 * Grupo Mentora
 *
 * pdf-parser.js
 * Extrae la tabla "Resultados por participante" de un PDF de indicadores
 * y devuelve un array de StudentRaw listos para ser procesados por report-engine.js.
 *
 * Dependencia: pdfjsLib (PDF.js ≥ 3.x) cargado desde CDN antes de este script.
 * IMPORTANTE: configurar pdfjsLib.GlobalWorkerOptions.workerSrc en el HTML antes
 * de llamar a parsePDF().
 *
 * Sin módulos ES: solo funciones globales para uso con <script>.
 */

(function () {
  /* ------------------------------------------------------------------ */
  /* Constantes internas                                                 */
  /* ------------------------------------------------------------------ */

  // Tolerancia vertical (unidades PDF) para agrupar ítems en la misma fila.
  // 1 unidad PDF ≈ 1/72 pulgada. Líneas típicas difieren ≥ 10 unidades entre sí.
  var ROW_Y_TOLERANCE = 4;

  // Máximo de columnas esperadas a izquierda/derecha de la tabla.
  // Sirve para filtrar ruido fuera del área tabular.
  var TABLE_MARGIN = 30;

  // Mapa de cabeceras del PDF → claves normalizadas internas.
  var HEADER_KEY_MAP = {
    "No.":          "no",
    "No":           "no",
    "Nro.":         "no",
    "Edad":         "edad",
    "Participante": "nombre",
    "Literal":      "Literal",
    "Inferencial":  "Inferencial",
    // Con tilde (tal como aparece en el PDF) y sin tilde (por si acaso)
    "Crítica": "Critica",   // Crítica con tilde
    "Critica":      "Critica",
    "Comprender":   "Comprender",
    "Pensar":       "Pensar",
    "Ejecutar":     "Ejecutar",
    "Responder":    "Responder"
  };

  // Claves de score en orden canónico.
  var SCORE_KEYS = ["Literal", "Inferencial", "Critica", "Comprender", "Pensar", "Ejecutar", "Responder"];

  /* ------------------------------------------------------------------ */
  /* Utilidades de bajo nivel                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Lee un File como ArrayBuffer.
   * @param {File} file
   * @returns {Promise<ArrayBuffer>}
   */
  function readFileAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload  = function (e) { resolve(e.target.result); };
      reader.onerror = function (e) { reject(new Error("Error leyendo el archivo: " + e.target.error)); };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Agrupa ítems de texto por fila (coordenada Y similar dentro de la tolerancia).
   * Retorna las filas ordenadas de arriba a abajo (Y descendente en PDF coords).
   *
   * @param {{str:string, x:number, y:number, width:number}[]} items
   * @returns {{y:number, items:{str:string, x:number, width:number}[]}[]}
   */
  function groupIntoRows(items) {
    var rows = [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var placed = false;

      for (var r = 0; r < rows.length; r++) {
        if (Math.abs(rows[r].y - item.y) <= ROW_Y_TOLERANCE) {
          rows[r].items.push({ str: item.str, x: item.x, width: item.width });
          placed = true;
          break;
        }
      }

      if (!placed) {
        rows.push({ y: item.y, items: [{ str: item.str, x: item.x, width: item.width }] });
      }
    }

    // Ordenar filas de arriba (mayor Y en PDF) a abajo (menor Y).
    rows.sort(function (a, b) { return b.y - a.y; });

    // Ordenar ítems dentro de cada fila por X ascendente (izquierda a derecha).
    rows.forEach(function (row) {
      row.items.sort(function (a, b) { return a.x - b.x; });
    });

    return rows;
  }

  /**
   * Encuentra el índice de la fila que contiene la palabra "Participante".
   * @param {{y:number, items:{str:string}[]}[]} rows
   * @returns {number} -1 si no se encuentra
   */
  function findHeaderRowIndex(rows) {
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < rows[i].items.length; j++) {
        if (rows[i].items[j].str.trim() === "Participante") {
          return i;
        }
      }
    }
    // Segundo intento más permisivo
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < rows[i].items.length; j++) {
        if (rows[i].items[j].str.trim().indexOf("Participante") !== -1) {
          return i;
        }
      }
    }
    return -1;
  }

  /**
   * Parsea la fila de cabeceras y devuelve un array de columnas con su clave y posición X.
   *
   * @param {{items:{str:string, x:number}[]}} headerRow
   * @returns {{key:string, x:number}[]}
   */
  function parseHeaderColumns(headerRow) {
    var cols = [];
    headerRow.items.forEach(function (item) {
      var text = item.str.trim();
      var key  = HEADER_KEY_MAP[text];
      if (key) {
        cols.push({ key: key, x: item.x });
      }
    });
    return cols;
  }

  /**
   * Asigna cada ítem de una fila a la columna más cercana por posición X.
   * Cuando varios ítems caen en la misma columna se concatenan (con espacio si hay
   * hueco visual entre ellos, sin espacio si están contiguos).
   *
   * @param {{str:string, x:number, width:number}[]} rowItems  Ítems de la fila de datos.
   * @param {{key:string, x:number}[]}               columns   Columnas detectadas.
   * @returns {Object}  { key → string }
   */
  function assignItemsToColumns(rowItems, columns) {
    if (columns.length === 0) return {};

    // Límites de la tabla para filtrar ruido exterior.
    var minTableX = columns[0].x - TABLE_MARGIN;
    var maxTableX = columns[columns.length - 1].x + TABLE_MARGIN + 60;

    // Buckets por clave de columna: array de {str, x, width}
    var buckets = {};
    columns.forEach(function (c) { buckets[c.key] = []; });

    rowItems.forEach(function (item) {
      if (!item.str.trim()) return;
      if (item.x < minTableX || item.x > maxTableX) return; // fuera de tabla

      // Columna más cercana
      var bestKey  = null;
      var bestDist = Infinity;
      columns.forEach(function (c) {
        var dist = Math.abs(item.x - c.x);
        if (dist < bestDist) { bestDist = dist; bestKey = c.key; }
      });

      if (bestKey) {
        buckets[bestKey].push({ str: item.str, x: item.x, width: item.width || 0 });
      }
    });

    // Concatenar ítems dentro de cada columna respetando espacios visuales.
    var result = {};
    columns.forEach(function (c) {
      var parts = buckets[c.key];
      if (parts.length === 0) { result[c.key] = ""; return; }

      // Ordenar por X
      parts.sort(function (a, b) { return a.x - b.x; });

      var combined = parts[0].str;
      for (var i = 1; i < parts.length; i++) {
        var prevEnd = parts[i - 1].x + (parts[i - 1].width || 0);
        var gap     = parts[i].x - prevEnd;
        combined   += (gap > 2 ? " " : "") + parts[i].str;
      }
      result[c.key] = combined.trim();
    });

    return result;
  }

  /* ------------------------------------------------------------------ */
  /* Conversión de valores                                               */
  /* ------------------------------------------------------------------ */

  /**
   * Convierte la cadena de un score a número o null (N/A).
   * @param {string} str
   * @returns {number|null}
   */
  function parseScore(str) {
    if (!str) return null;
    var normalized = str.trim().toUpperCase().replace(/\s+/g, "");
    if (normalized === "" || normalized === "N/A" || normalized === "NA" || normalized === "-") {
      return null;
    }
    var num = parseFloat(normalized.replace(",", "."));
    return isNaN(num) ? null : num;
  }

  /**
   * Construye un StudentRaw a partir del mapa {columna → valor}.
   * Retorna null si el registro no es válido.
   *
   * @param {Object} rowData
   * @returns {{nombre:string, edad:number|null, scores:Object}|null}
   */
  function buildStudentRaw(rowData) {
    var nombre = (rowData["nombre"] || "").trim();
    if (!nombre) return null;

    // Descartar filas de totales o encabezados repetidos
    var lowerNombre = nombre.toLowerCase();
    if (lowerNombre === "participante" ||
        lowerNombre.indexOf("total") !== -1 ||
        lowerNombre.indexOf("promedio") !== -1 ||
        lowerNombre.indexOf("media") !== -1) {
      return null;
    }

    // Edad puede ser un número o vacía
    var edadStr = (rowData["edad"] || "").trim();
    var edad    = edadStr ? parseInt(edadStr, 10) : null;
    if (edad !== null && isNaN(edad)) edad = null;

    var scores = {};
    SCORE_KEYS.forEach(function (key) {
      scores[key] = parseScore(rowData[key]);
    });

    // Al menos un score debe ser válido para considerar la fila de datos.
    var hasAnyScore = SCORE_KEYS.some(function (k) { return scores[k] !== null; });
    if (!hasAnyScore) return null;

    return { nombre: nombre, edad: edad, scores: scores };
  }

  /**
   * Agrega sufijos " (1)", " (2)"... a nombres duplicados.
   * @param {{nombre:string}[]} students
   * @returns {{nombre:string}[]}
   */
  function deduplicateNames(students) {
    var seen   = {};
    var counts = {};

    // Contar ocurrencias
    students.forEach(function (s) {
      counts[s.nombre] = (counts[s.nombre] || 0) + 1;
    });

    return students.map(function (s) {
      if (counts[s.nombre] <= 1) return s;
      seen[s.nombre] = (seen[s.nombre] || 0) + 1;
      var copy = {};
      Object.keys(s).forEach(function (k) { copy[k] = s[k]; });
      copy.nombre = s.nombre + " (" + seen[s.nombre] + ")";
      return copy;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Función principal                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Parsea un PDF de indicadores D-CREA y extrae la tabla de estudiantes.
   *
   * @param {File} file  Objeto File proveniente de un <input type="file">.
   * @returns {Promise<Array>}  Promesa que resuelve con StudentRaw[]:
   *   [{ nombre: string, edad: number|null,
   *      scores: { Literal, Inferencial, Critica, Comprender, Pensar, Ejecutar, Responder } }]
   *   Los scores pueden ser null cuando la celda contiene N/A.
   */
  async function parsePDF(file) {
    // 1. Leer el archivo como ArrayBuffer
    var arrayBuffer;
    try {
      arrayBuffer = await readFileAsArrayBuffer(file);
    } catch (e) {
      throw new Error("No se pudo leer el archivo: " + e.message);
    }

    // 2. Cargar el PDF con PDF.js
    var pdf;
    try {
      var loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      pdf = await loadingTask.promise;
    } catch (e) {
      throw new Error(
        "No se pudo interpretar el PDF. Verifica que el archivo no esté dañado ni protegido con contraseña. " +
        "Detalle: " + e.message
      );
    }

    // 3. Buscar la página con la tabla — empezando desde la última.
    var targetTextContent = null;
    var found             = false;

    for (var pageNum = pdf.numPages; pageNum >= 1; pageNum--) {
      var page;
      try {
        page = await pdf.getPage(pageNum);
      } catch (e) {
        continue;
      }

      var tc;
      try {
        tc = await page.getTextContent();
      } catch (e) {
        continue;
      }

      var allText = tc.items.map(function (i) { return i.str; }).join(" ");

      if (allText.indexOf("Participante") !== -1) {
        targetTextContent = tc;
        found = true;
        break;
      }
    }

    if (!found || !targetTextContent) {
      throw new Error(
        "No se encontró la tabla \"Resultados por participante\" en el PDF. " +
        "Asegúrate de subir el archivo de indicadores D-CREA correcto."
      );
    }

    // 4. Extraer ítems con posiciones
    var rawItems = targetTextContent.items
      .filter(function (item) { return item.str && item.str.trim() !== ""; })
      .map(function (item) {
        return {
          str:   item.str,
          x:     item.transform[4],  // X en coordenadas PDF
          y:     item.transform[5],  // Y en coordenadas PDF (0 = base de página)
          width: item.width || 0
        };
      });

    if (rawItems.length === 0) {
      throw new Error("La página encontrada no contiene texto extraíble (el PDF puede ser imagen escaneada).");
    }

    // 5. Agrupar por filas
    var rows = groupIntoRows(rawItems);

    // 6. Localizar fila de cabecera
    var headerIdx = findHeaderRowIndex(rows);
    if (headerIdx === -1) {
      throw new Error(
        "Se encontró la página pero no la fila de cabeceras. " +
        "Verifica que la columna \"Participante\" sea visible en el PDF."
      );
    }

    // 7. Parsear columnas a partir de la cabecera
    var columns = parseHeaderColumns(rows[headerIdx]);
    if (columns.length < 3) {
      throw new Error(
        "No se pudieron identificar suficientes columnas en la tabla (se encontraron " +
        columns.length + "). Revisa que el PDF no esté recortado."
      );
    }

    // 8. Parsear filas de datos (las que siguen a la cabecera)
    var students = [];
    for (var i = headerIdx + 1; i < rows.length; i++) {
      var row = rows[i];

      // Ignorar filas con muy pocos ítems (separadores, totales en blanco, etc.)
      if (row.items.length < 2) continue;

      var rowData = assignItemsToColumns(row.items, columns);
      var student = buildStudentRaw(rowData);
      if (student) students.push(student);
    }

    if (students.length === 0) {
      throw new Error(
        "Se encontró la tabla pero no se pudieron extraer estudiantes. " +
        "El formato de la tabla puede haber cambiado."
      );
    }

    // 9. Resolver nombres duplicados
    return deduplicateNames(students);
  }

  /* ------------------------------------------------------------------ */
  /* Exportar al ámbito global                                           */
  /* ------------------------------------------------------------------ */
  window.parsePDF = parsePDF;

})();
