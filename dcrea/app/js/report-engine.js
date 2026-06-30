/**
 * D-CREA — Destrezas de Comprensión y Resolución
 * Grupo Mentora
 *
 * report-engine.js
 * Procesa un array de StudentRaw (salida de pdf-parser.js) y produce ReportData[]
 * que el renderizador y el exportador consumen.
 *
 * Dependencias (deben cargarse antes):
 *  - data/interpretations.js  → INTERPRETATIONS, DIMENSION_LABELS, COMPRENSION_DIMS,
 *                               RESOLUCION_DIMS, RESUMEN_TEMPLATES, PERFIL_COGNITIVO_TEMPLATES
 *  - data/strengths.js        → getStrengthsAndOpportunities
 *  - data/recommendations.js  → TEACHER_RECOMMENDATIONS, getHomeRecommendations
 *
 * Sin módulos ES: solo funciones globales para uso con <script>.
 */

(function () {
  /* ------------------------------------------------------------------ */
  /* Accesores defensivos a las constantes de los archivos de datos      */
  /* (Permiten cargar report-engine.js antes que los archivos de datos,  */
  /*  aunque en uso normal se cargan después del HTML.)                  */
  /* ------------------------------------------------------------------ */

  function getCDims() {
    return (typeof COMPRENSION_DIMS !== "undefined")
      ? COMPRENSION_DIMS
      : ["Literal", "Inferencial", "Critica"];
  }

  function getRDims() {
    return (typeof RESOLUCION_DIMS !== "undefined")
      ? RESOLUCION_DIMS
      : ["Comprender", "Pensar", "Ejecutar", "Responder"];
  }

  function getDimLabel(key) {
    try {
      if (typeof DIMENSION_LABELS !== "undefined" && DIMENSION_LABELS[key]) {
        return DIMENSION_LABELS[key];
      }
    } catch (e) { /* noop */ }
    // Etiquetas de respaldo
    var fallback = {
      Literal:      "Comprensión Literal",
      Inferencial:  "Comprensión Inferencial",
      Critica:      "Pensamiento Crítico",
      Comprender:   "Comprensión del Problema",
      Pensar:       "Planificación Estratégica",
      Ejecutar:     "Ejecución de Procedimientos",
      Responder:    "Verificación de Respuestas"
    };
    return fallback[key] || key;
  }

  function getInterpretation(key, nivel) {
    if (!nivel) return null;
    try {
      if (typeof INTERPRETATIONS !== "undefined" &&
          INTERPRETATIONS[key] && INTERPRETATIONS[key][nivel]) {
        return INTERPRETATIONS[key][nivel];
      }
    } catch (e) { /* noop */ }
    return null;
  }

  function getTeacherRec(key, nivel) {
    if (!nivel) return null;
    try {
      if (typeof TEACHER_RECOMMENDATIONS !== "undefined" &&
          TEACHER_RECOMMENDATIONS[key] && TEACHER_RECOMMENDATIONS[key][nivel] !== undefined) {
        return TEACHER_RECOMMENDATIONS[key][nivel]; // puede ser null (Excelente)
      }
    } catch (e) { /* noop */ }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Lógica de niveles y cálculos                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Convierte edad en grado escolar usando la escala latinoamericana estándar:
   * grado = edad − 5  (ej: edad 7 → 2° Grado, edad 12 → 7° Grado).
   * @param {number|null} edad
   * @returns {string}
   */
  function edadToGrado(edad) {
    if (edad === null || edad === undefined || isNaN(edad)) return "Grado no especificado";
    var grado = Math.round(edad) - 5;
    if (grado < 1) grado = 1;
    return grado + "° Grado"; // ° Grado
  }

  /**
   * Determina el nivel de desempeño a partir de un score (0–100).
   * Umbrales: < 40 → Inicial, < 70 → En desarrollo, < 85 → Avanzado, ≥ 85 → Excelente.
   * @param {number|null} score
   * @returns {string|null}
   */
  function getLevel(score) {
    if (score === null || score === undefined || isNaN(score)) return null;
    if (score < 40) return "Inicial";
    if (score < 70) return "En desarrollo";
    if (score < 85) return "Avanzado";
    return "Excelente";
  }

  /**
   * Promedio aritmético ignorando valores null/undefined/NaN.
   * @param {(number|null)[]} values
   * @returns {number|null}  null si no hay ningún valor válido.
   */
  function average(values) {
    var valid = values.filter(function (v) {
      return v !== null && v !== undefined && !isNaN(v);
    });
    if (valid.length === 0) return null;
    var sum = valid.reduce(function (acc, v) { return acc + v; }, 0);
    return Math.round(sum / valid.length);
  }

  /**
   * Interpolación de plantillas de texto.
   * Reemplaza {clave} con el valor correspondiente en el objeto data.
   * @param {string} template
   * @param {Object} data
   * @returns {string}
   */
  function interpolate(template, data) {
    if (!template) return "";
    return template.replace(/\{(\w+)\}/g, function (_, key) {
      var val = data[key];
      return (val !== undefined && val !== null) ? String(val) : "";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Lógica de perfilKey                                                 */
  /* ------------------------------------------------------------------ */

  /**
   * Determina el patrón cognitivo del estudiante para seleccionar la plantilla
   * de perfil cognitivo en PERFIL_COGNITIVO_TEMPLATES.
   *
   * @param {number|null} pC   Promedio de comprensión (null si todos son N/A).
   * @param {number|null} pR   Promedio de resolución (null si todos son N/A).
   * @param {Object}      scores  { Literal, Inferencial, Critica, Comprender, Pensar, Ejecutar, Responder }
   * @returns {string}
   */
  function determinePerfilKey(pC, pR, scores) {
    // Si no hay datos suficientes para clasificar
    if (pC === null && pR === null) return "default";

    var c = (pC !== null) ? pC : 0;
    var r = (pR !== null) ? pR : 0;

    // Reglas en orden de precedencia
    if (c >= 70 && r < 70)  return "alta_comprension_baja_resolucion";
    if (c < 70  && r >= 70) return "baja_comprension_alta_resolucion";

    var critica     = scores.Critica;
    var pensar      = scores.Pensar;
    var literal     = scores.Literal;
    var inferencial = scores.Inferencial;
    var ejecutar    = scores.Ejecutar;

    if (critica !== null && critica >= 70 && pensar !== null && pensar < 40) {
      return "alta_critica_baja_planificacion";
    }
    if (literal !== null && literal >= 70 && inferencial !== null && inferencial < 40) {
      return "alto_literal_bajo_inferencial";
    }
    if (ejecutar !== null && ejecutar >= 70 && pensar !== null && pensar < 40) {
      return "alto_ejecutar_bajo_pensar";
    }
    if (c >= 70 && r >= 70) return "equilibrado_alto";
    if (c < 40  && r < 40)  return "equilibrado_bajo";

    return "default";
  }

  /* ------------------------------------------------------------------ */
  /* Procesamiento de un estudiante                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Genera un ID de estudiante válido como selector CSS a partir del nombre.
   * @param {string} nombre
   * @returns {string}
   */
  function generateStudentId(nombre) {
    return "student-" +
      String(nombre)
        .toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "") // quitar tildes
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
  }

  /**
   * Procesa un StudentRaw y retorna un ReportData completo.
   *
   * @param {{nombre:string, edad:number|null, scores:Object}} raw
   * @param {string} institucion
   * @param {string} fecha
   * @returns {Object}  ReportData
   */
  function processStudent(raw, institucion, fecha) {
    var nombre = raw.nombre;
    var edad   = raw.edad;
    var scores = raw.scores;

    var grado = edadToGrado(edad);
    var id    = generateStudentId(nombre);

    var cDims  = getCDims();
    var rDims  = getRDims();
    var allDims = cDims.concat(rDims);

    /* ---- Niveles individuales ---- */
    var niveles = {};
    allDims.forEach(function (dim) {
      niveles[dim] = getLevel(scores[dim]);
    });

    /* ---- Promedios por grupo ---- */
    var promedioC = average(cDims.map(function (d) { return scores[d]; }));
    var promedioR = average(rDims.map(function (d) { return scores[d]; }));

    // Redondear a 1 decimal para presentación, pero mantener float para lógica
    var promedios = {
      comprension: promedioC !== null ? Math.round(promedioC * 10) / 10 : null,
      resolucion:  promedioR !== null ? Math.round(promedioR * 10) / 10 : null
    };

    niveles.comprension = getLevel(promedioC);
    niveles.resolucion  = getLevel(promedioR);

    var globalScore = null;
    if (promedioC !== null && promedioR !== null) {
      globalScore = Math.round((promedioC + promedioR) / 2);
    } else if (promedioC !== null) {
      globalScore = promedioC;
    } else if (promedioR !== null) {
      globalScore = promedioR;
    }
    var globalNivel = getLevel(globalScore);

    /* ---- Perfil cognitivo ---- */
    var perfilKey = determinePerfilKey(promedioC, promedioR, scores);

    /* ---- Principal fortaleza (score más alto con valor no nulo) ---- */
    var fortalezaDim   = null;
    var fortalezaScore = -Infinity;
    allDims.forEach(function (dim) {
      var s = scores[dim];
      if (s !== null && s !== undefined && !isNaN(s) && s > fortalezaScore) {
        fortalezaScore = s;
        fortalezaDim   = dim;
      }
    });

    var principalFortaleza = fortalezaDim ? {
      key:   fortalezaDim,
      label: getDimLabel(fortalezaDim),
      score: fortalezaScore,
      nivel: niveles[fortalezaDim]
    } : null;

    /* ---- Área de oportunidad (score más bajo con valor no nulo) ---- */
    var oportunidadDim   = null;
    var oportunidadScore = Infinity;
    allDims.forEach(function (dim) {
      var s = scores[dim];
      if (s !== null && s !== undefined && !isNaN(s) && s < oportunidadScore) {
        oportunidadScore = s;
        oportunidadDim   = dim;
      }
    });

    var areaOportunidad = oportunidadDim ? {
      key:   oportunidadDim,
      label: getDimLabel(oportunidadDim),
      score: oportunidadScore,
      nivel: niveles[oportunidadDim]
    } : null;

    /* ---- Array de dimensiones (para tablas y gráficas) ---- */
    var dimensiones = allDims.map(function (dim) {
      var isNA = scores[dim] === null || scores[dim] === undefined;
      return {
        key:            dim,
        label:          getDimLabel(dim),
        tipo:           cDims.indexOf(dim) !== -1 ? "comprension" : "resolucion",
        score:          isNA ? null : scores[dim],
        nivel:          niveles[dim],
        interpretacion: getInterpretation(dim, niveles[dim]),
        isNA:           isNA
      };
    });

    /* ---- Fortalezas y oportunidades (textos del banco) ---- */
    var fortalezas    = [];
    var oportunidades = [];
    try {
      if (typeof getStrengthsAndOpportunities === "function") {
        var so = getStrengthsAndOpportunities(nombre, scores, niveles);
        fortalezas    = so.fortalezas    || [];
        oportunidades = so.oportunidades || [];
      }
    } catch (e) {
      console.warn("[report-engine] getStrengthsAndOpportunities no disponible:", e);
    }

    /* ---- Recomendaciones para docentes ---- */
    // Todas las dimensiones evaluadas (nivel ≠ null), ordenadas por score ASC, máximo 6.
    // Para nivel Excelente, si la recomendación es null, se omite.
    var recomendacionesDocentes = allDims
      .filter(function (dim) { return niveles[dim] !== null; })
      .sort(function (a, b) {
        var sa = (scores[a] !== null && scores[a] !== undefined) ? scores[a] : 0;
        var sb = (scores[b] !== null && scores[b] !== undefined) ? scores[b] : 0;
        return sa - sb; // ascendente: las más bajas primero
      })
      .slice(0, 6)
      .reduce(function (acc, dim) {
        var rec = getTeacherRec(dim, niveles[dim]);
        // Omitir si Excelente y rec es explícitamente null
        if (niveles[dim] === "Excelente" && rec === null) return acc;
        acc.push({ area: getDimLabel(dim), texto: rec || "" });
        return acc;
      }, []);

    /* ---- Recomendaciones para el hogar ---- */
    // Usa el nuevo banco personalizado si está disponible;
    // de lo contrario mantiene compatibilidad con el sistema anterior.
    var recomendacionesHogar = null;
    try {
      if (typeof getRecomendacionesHogar === "function") {
        recomendacionesHogar = getRecomendacionesHogar(scores, niveles);
      } else if (typeof getHomeRecommendations === "function") {
        var _legacyRecs = getHomeRecommendations(scores, niveles) || [];
        recomendacionesHogar = { tipo: "legado", textos: _legacyRecs };
      }
    } catch (e) {
      console.warn("[report-engine] getRecomendacionesHogar no disponible:", e);
    }

    /* ---- Texto resumen ejecutivo ---- */
    // Clave: "NivelComprension__NivelResolucion" — exactamente como RESUMEN_TEMPLATES
    var resumenTexto = "";
    try {
      if (typeof RESUMEN_TEMPLATES !== "undefined" &&
          niveles.comprension && niveles.resolucion) {
        var templateKey = niveles.comprension + "__" + niveles.resolucion;
        var tmpl        = RESUMEN_TEMPLATES[templateKey];
        if (tmpl) {
          resumenTexto = interpolate(tmpl, {
            nombre:          nombre,
            areaFortaleza:   principalFortaleza ? principalFortaleza.label : "",
            scoreFortaleza:  principalFortaleza ? Math.round(principalFortaleza.score) : "",
            areaOportunidad: areaOportunidad    ? areaOportunidad.label    : ""
          });
        }
      }
    } catch (e) {
      console.warn("[report-engine] RESUMEN_TEMPLATES no disponible:", e);
    }

    /* ---- Texto de perfil cognitivo ---- */
    var perfilCognitivo = "";
    try {
      if (typeof PERFIL_COGNITIVO_TEMPLATES !== "undefined" &&
          PERFIL_COGNITIVO_TEMPLATES[perfilKey]) {
        perfilCognitivo = interpolate(PERFIL_COGNITIVO_TEMPLATES[perfilKey], {
          nombre: nombre
        });
      }
    } catch (e) {
      console.warn("[report-engine] PERFIL_COGNITIVO_TEMPLATES no disponible:", e);
    }

    /* ---- ReportData final ---- */
    return {
      id:                      id,
      nombre:                  nombre,
      edad:                    edad,
      grado:                   grado,
      institucion:             institucion,
      fecha:                   fecha,
      scores:                  scores,
      niveles:                 niveles,
      promedios:               promedios,
      principalFortaleza:      principalFortaleza,
      areaOportunidad:         areaOportunidad,
      perfilKey:               perfilKey,
      dimensiones:             dimensiones,
      fortalezas:              fortalezas,
      oportunidades:           oportunidades,
      recomendacionesDocentes: recomendacionesDocentes,
      recomendacionesHogar:    recomendacionesHogar,
      resumenTexto:            resumenTexto,
      perfilCognitivo:         perfilCognitivo,
      globalScore:             globalScore,
      globalNivel:             globalNivel
    };
  }

  /**
   * Procesa todos los estudiantes del array.
   * @param {{nombre:string, edad:number|null, scores:Object}[]} rawStudents
   * @param {string} institucion
   * @param {string} fecha
   * @returns {Object[]}  Array de ReportData
   */
  function processAllStudents(rawStudents, institucion, fecha) {
    return rawStudents.map(function (r) {
      return processStudent(r, institucion, fecha);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Exportar al ámbito global                                           */
  /* ------------------------------------------------------------------ */
  window.edadToGrado           = edadToGrado;
  window.getLevel              = getLevel;
  window.average               = average;
  window.generateStudentId     = generateStudentId;
  window.processStudent        = processStudent;
  window.processAllStudents    = processAllStudents;

})();
