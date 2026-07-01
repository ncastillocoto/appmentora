/**
 * D-CREA — Destrezas de Comprensión y Resolución
 * Grupo Mentora
 *
 * report-renderer.js
 * Genera el HTML completo de un reporte individual de 5 páginas.
 * Diseño fiel al "resultado final.pdf".
 */

(function () {

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */

  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&#039;");
  }

  function nivelSlug(nivel) {
    if (!nivel) return "na";
    return nivel.toLowerCase().replace(/\s+/g, "-");
  }

  function nivelColor(nivel) {
    var map = {
      "Inicial":       "#B84041",
      "En desarrollo": "#E88439",
      "Avanzado":      "#FBB634",
      "Excelente":     "#97C94C"
    };
    return map[nivel] || "#6B7280";
  }

  function scoreDisplay(score) {
    if (score === null || score === undefined) return "N/A";
    return Math.round(score) + "%";
  }

  /* ------------------------------------------------------------------ */
  /* Componentes compartidos                                             */
  /* ------------------------------------------------------------------ */

  function pageHeader(d, pageNum) {
    return (
      '<div class="rpt-header">' +
        '<div class="rpt-hdr-left">' +
          '<span class="rpt-hdr-name">' + esc(d.nombre) + '</span>' +
          '<span class="rpt-hdr-grade">' + esc(d.grado) + '</span>' +
        '</div>' +
        '<span class="rpt-hdr-meta">D·CREA · ' + esc(d.fecha) + ' · Página ' + pageNum + '</span>' +
      '</div>'
    );
  }

  function sectionHead(icon, title) {
    return (
      '<div class="rpt-section-head">' +
        '<span class="rpt-section-title">' + title + '</span>' +
      '</div>' +
      '<div class="rpt-section-line"></div>'
    );
  }

  function renderRadarCharts(dimensiones) {
    var cDims = dimensiones.filter(function (d) { return d.tipo === "comprension"; });
    var rDims = dimensiones.filter(function (d) { return d.tipo === "resolucion"; });

    var cLabels = JSON.stringify(cDims.map(function (d) {
      return d.key === "Critica" ? "Crítica" : d.key;
    }));
    var cValues = JSON.stringify(cDims.map(function (d) {
      return d.score !== null ? d.score : 0;
    }));

    var rLabels = JSON.stringify(rDims.map(function (d) { return d.key; }));
    var rValues = JSON.stringify(rDims.map(function (d) {
      return d.score !== null ? d.score : 0;
    }));

    return (
      '<div class="radars-row">' +
        '<div class="radar-wrap">' +
          '<div class="radar-lbl">RUTINAS DE COMPRENSIÓN</div>' +
          '<canvas class="radar-chart"' +
            ' data-labels=\'' + cLabels + '\'' +
            ' data-values=\'' + cValues + '\'' +
            ' data-color="#289889"' +
            ' width="280" height="280"></canvas>' +
        '</div>' +
        '<div class="radar-wrap">' +
          '<div class="radar-lbl">RUTINAS DE RESOLUCIÓN</div>' +
          '<canvas class="radar-chart"' +
            ' data-labels=\'' + rLabels + '\'' +
            ' data-values=\'' + rValues + '\'' +
            ' data-color="#E88439"' +
            ' width="280" height="280"></canvas>' +
        '</div>' +
      '</div>'
    );
  }

  /* Dimensiones con score < 70 → categorías Progrentis a reforzar (sin desglosar destrezas individuales) */
  function getProgrentisCategoryMap(d) {
    var skillsData = window.PROGRENTIS_SKILLS;
    if (!skillsData) return {};
    var debiles = d.dimensiones.filter(function (dim) {
      return dim.score !== null && dim.score !== undefined && dim.score < 70;
    });
    var catMap = {};
    debiles.forEach(function (dim) {
      var dimMapeo = skillsData.mapeo[dim.label];
      if (!dimMapeo) return;
      Object.keys(dimMapeo).forEach(function (cat) {
        if (!catMap[cat]) catMap[cat] = [];
        dimMapeo[cat].forEach(function (destreza) {
          if (catMap[cat].indexOf(destreza) === -1) catMap[cat].push(destreza);
        });
      });
    });
    return catMap;
  }

  /* Bandas del gauge: rango real de score → nivel D-CREA */
  var GAUGE_BANDS = [
    { nivel: "Inicial",       lo: 0,  hi: 40,  color: "#B84041" },
    { nivel: "En desarrollo", lo: 40, hi: 70,  color: "#E88439" },
    { nivel: "Avanzado",      lo: 70, hi: 85,  color: "#FBB634" },
    { nivel: "Excelente",     lo: 85, hi: 100, color: "#97C94C" }
  ];

  function gaugePolar(cx, cy, r, angleDeg) {
    var rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }
  function gaugeScoreToAngle(score) { return 180 * (1 - score / 100); }
  function gaugeArcPath(cx, cy, r, aStart, aEnd) {
    var p1 = gaugePolar(cx, cy, r, aStart);
    var p2 = gaugePolar(cx, cy, r, aEnd);
    return 'M ' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2) +
      ' A ' + r + ' ' + r + ' 0 0 1 ' + p2.x.toFixed(2) + ' ' + p2.y.toFixed(2);
  }

  /* Gauge semicircular: score/nivel global real del estudiante + banda del siguiente nivel resaltada */
  function renderCognitiveGauge(d) {
    var NIVELES_ORDER = ["Inicial", "En desarrollo", "Avanzado", "Excelente"];
    var idx = NIVELES_ORDER.indexOf(d.globalNivel);
    if (idx === -1 || d.globalScore === null || d.globalScore === undefined) return null;

    var highlightIdx = (idx < 3) ? idx + 1 : 3;
    var nextLabel = (idx < 3) ? NIVELES_ORDER[idx + 1] : "Consolidación y enriquecimiento";
    var highlightColor = GAUGE_BANDS[highlightIdx].color;

    var cx = 75, cy = 85, r = 60;
    var arcsHTML = GAUGE_BANDS.map(function (band, i) {
      var d0 = gaugeArcPath(cx, cy, r, gaugeScoreToAngle(band.lo), gaugeScoreToAngle(band.hi));
      var sw = (i === highlightIdx) ? 17 : 12;
      return '<path d="' + d0 + '" stroke="' + band.color + '" stroke-width="' + sw + '" fill="none" stroke-linecap="butt"/>';
    }).join('');

    var scoreClamped = Math.max(0, Math.min(100, d.globalScore));
    var needleTip = gaugePolar(cx, cy, r - 14, gaugeScoreToAngle(scoreClamped));
    var needleHTML =
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + needleTip.x.toFixed(2) + '" y2="' + needleTip.y.toFixed(2) +
        '" stroke="#1F2A44" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#1F2A44"/>';

    return {
      svg: '<svg class="cog-gauge-svg" viewBox="0 0 150 100" width="150" height="100">' + arcsHTML + needleHTML + '</svg>',
      readoutPct: Math.round(scoreClamped) + '%',
      readoutNivel: d.globalNivel,
      readoutColor: nivelColor(d.globalNivel),
      highlightColor: highlightColor,
      nextLabel: nextLabel
    };
  }

  /* Selecciona hasta `max` destrezas de una dimensión, repartiendo entre sus categorías
     (prioriza "Funciones ejecutivas" por su rol transversal) en vez de agotar una sola categoría */
  function pickRutaDestrezas(dimLabel, max) {
    var skillsData = window.PROGRENTIS_SKILLS;
    if (!skillsData || !dimLabel) return [];
    var dimMapeo = skillsData.mapeo[dimLabel];
    if (!dimMapeo) return [];
    var catKeys = Object.keys(dimMapeo).sort(function (a, b) {
      if (a === "Funciones ejecutivas") return -1;
      if (b === "Funciones ejecutivas") return 1;
      return 0;
    });
    var picked = [];
    var round = 0;
    while (picked.length < max) {
      var addedAny = false;
      for (var i = 0; i < catKeys.length; i++) {
        var list = dimMapeo[catKeys[i]];
        if (list && list[round] && picked.indexOf(list[round]) === -1) {
          picked.push(list[round]);
          addedAny = true;
          if (picked.length >= max) break;
        }
      }
      if (!addedAny) break;
      round++;
    }
    return picked;
  }

  /* Ruta hacia el siguiente nivel: remediación (score<70, dimensión prioritaria) o
     enriquecimiento (perfil ya fuerte → misma lógica sobre la principal fortaleza) */
  function renderRutaBlock(d, highlightColor, nextLabel) {
    var remedia    = d.areaOportunidad && d.areaOportunidad.score < 70;
    var sourceDim  = remedia ? d.areaOportunidad : d.principalFortaleza;
    if (!sourceDim) return "";

    var destrezas = pickRutaDestrezas(sourceDim.label, 3);
    if (destrezas.length === 0) return "";

    var itemsHTML = destrezas.map(function (s, i) {
      return (
        '<div class="cog-ruta-item">' +
          '<span class="cog-ruta-num" style="background:' + highlightColor + '">' + (i + 1) + '</span>' +
          '<span class="cog-ruta-txt">' + esc(s) + '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="cog-ruta">' +
        '<div class="cog-ruta-lbl" style="color:' + highlightColor + '">RUTA HACIA ' + esc(nextLabel.toUpperCase()) + '</div>' +
        itemsHTML +
      '</div>'
    );
  }

  function renderProgrentisImpactBox(d) {
    var gauge = renderCognitiveGauge(d);
    var panelHTML = gauge
      ? '<div class="cog-panel">' +
          '<div class="cog-gauge">' +
            gauge.svg +
            '<div class="cog-gauge-readout">' +
              '<span class="cog-gauge-pct">' + gauge.readoutPct + '</span>' +
              '<span class="cog-gauge-nivel" style="color:' + gauge.readoutColor + '">' + esc(gauge.readoutNivel) + '</span>' +
            '</div>' +
          '</div>' +
          renderRutaBlock(d, gauge.highlightColor, gauge.nextLabel) +
        '</div>'
      : '';

    return (
      '<div class="progrentis-impact-box">' +
        '<div class="progrentis-impact-eyebrow">METODOLOGÍA PROGRENTIS</div>' +
        '<p class="progrentis-impact-msg">Cada destreza señalada aquí es una conexión neuronal en formación: ' +
          'se fortalece con entrenamiento dirigido y sostenido, no con el simple paso del tiempo.</p>' +
        panelHTML +
      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* PÁGINA 1 — Portada                                                  */
  /* ------------------------------------------------------------------ */

  function renderPageCover(d) {
    return (
      '<div class="report-page page-cover">' +

        '<div class="cover-header">' +
          '<img src="assets/logo-mentora.svg" class="cover-logo" alt="Grupo Mentora">' +
          '<div class="cover-header-right">' +
            '<div class="cover-inst">' + esc(d.institucion) + '</div>' +
            '<div class="cover-diag">Diagnóstico D·CREA · ' + esc(d.fecha) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="cover-body">' +
          '<div class="cover-tag">GRUPO MENTORA · EVALUACIÓN EDUCATIVA</div>' +
          '<h1 class="cover-title">' +
            'Perfil de <span class="cover-accent">Destrezas</span><br>' +
            'de Comprensión<br>y Resolución' +
          '</h1>' +
          '<p class="cover-sub">Reporte Individual D·CREA</p>' +
          '<div class="cover-divider"></div>' +
          '<div class="cover-meta">' +
            '<div class="meta-item">' +
              '<span class="meta-lbl">ESTUDIANTE</span>' +
              '<span class="meta-val">' + esc(d.nombre) + '</span>' +
            '</div>' +
            '<div class="meta-item">' +
              '<span class="meta-lbl">GRADO</span>' +
              '<span class="meta-val">' + esc(d.grado) + '</span>' +
            '</div>' +
            '<div class="meta-item">' +
              '<span class="meta-lbl">EDAD</span>' +
              '<span class="meta-val">' + (d.edad !== null ? d.edad + ' años' : 'No especificada') + '</span>' +
            '</div>' +
            '<div class="meta-item">' +
              '<span class="meta-lbl">INSTITUCIÓN</span>' +
              '<span class="meta-val">' + esc(d.institucion) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="cover-footer">' +
          '<span>D·CREA · Destrezas de Comprensión y Resolución</span>' +
          '<span class="footer-badge">Reporte Individual · ' + esc(d.fecha) + '</span>' +
        '</div>' +

      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* PÁGINA 2 — Resumen Ejecutivo                                        */
  /* ------------------------------------------------------------------ */

  function renderPageExecutive(d) {
    var pctC   = d.promedios.comprension;
    var pctR   = d.promedios.resolucion;
    var nivelC = d.niveles.comprension || "";
    var nivelR = d.niveles.resolucion  || "";
    var slugC  = nivelSlug(nivelC);
    var slugR  = nivelSlug(nivelR);

    var fortaleza   = d.principalFortaleza;
    var oportunidad = d.areaOportunidad;

    var card3 = fortaleza
      ? '<div class="exec-card-dim-name">' + esc(fortaleza.label) + '</div>' +
        '<div class="exec-card-dim-score">' + scoreDisplay(fortaleza.score) + '</div>'
      : '<div class="exec-card-nivel">No disponible</div>';

    var card4 = oportunidad
      ? '<div class="exec-card-dim-name">' + esc(oportunidad.label) + '</div>' +
        '<div class="exec-card-dim-score">' + scoreDisplay(oportunidad.score) + '</div>'
      : '<div class="exec-card-nivel">No disponible</div>';

    return (
      '<div class="report-page page-executive">' +

        pageHeader(d, 2) +

        '<div class="rpt-body">' +

          '<div class="rpt-section">' +
            sectionHead('📋', 'RESUMEN EJECUTIVO') +
            '<div class="exec-cards">' +
              '<div class="exec-card nc-' + slugC + '">' +
                '<div class="exec-card-lbl">COMPRENSIÓN LECTORA</div>' +
                '<div class="exec-card-score">' + (pctC !== null ? pctC + '%' : 'N/A') + '</div>' +
                (nivelC ? '<div class="exec-card-nivel">' + esc(nivelC) + '</div>' : '') +
              '</div>' +
              '<div class="exec-card nc-' + slugR + '">' +
                '<div class="exec-card-lbl">RESOLUCIÓN DE PROBLEMAS</div>' +
                '<div class="exec-card-score">' + (pctR !== null ? pctR + '%' : 'N/A') + '</div>' +
                (nivelR ? '<div class="exec-card-nivel">' + esc(nivelR) + '</div>' : '') +
              '</div>' +
              '<div class="exec-card nc-fortaleza">' +
                '<div class="exec-card-lbl">PRINCIPAL FORTALEZA</div>' +
                card3 +
              '</div>' +
              '<div class="exec-card nc-oportunidad">' +
                '<div class="exec-card-lbl">ÁREA PRIORITARIA DE MEJORA</div>' +
                card4 +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="rpt-section">' +
            sectionHead('📊', 'PERFIL VISUAL DEL ESTUDIANTE') +
            renderRadarCharts(d.dimensiones) +
          '</div>' +

          (d.resumenTexto
            ? '<div class="exec-quote">' + esc(d.resumenTexto) + '</div>'
            : '') +

        '</div>' +

        '<div class="rpt-footer">' +
          '<span>Grupo Mentora · Reportes D-CREA</span>' +
          '<span>' + esc(d.institucion) + '</span>' +
        '</div>' +

      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* PÁGINA 3 — Interpretación Pedagógica                                */
  /* ------------------------------------------------------------------ */

  function renderPageInterpretation(d) {
    var rows = d.dimensiones.map(function (dim) {
      var tipoLabel = dim.tipo === "comprension" ? "Comprensión" : "Resolución";
      var slug      = nivelSlug(dim.nivel);

      var pillHtml, nivelHtml, interpHtml;

      if (dim.isNA) {
        pillHtml  = '<span class="res-pill pill-na">N/A</span>';
        nivelHtml = '<span class="res-nivel nivel-text-na">No evaluado</span>';
        interpHtml = '<em style="color:#6B7280;font-size:10.5px">No evaluado en esta aplicación.</em>';
      } else {
        pillHtml  = '<span class="res-pill pill-' + slug + '">' + scoreDisplay(dim.score) + '</span>';
        nivelHtml = '<span class="res-nivel nivel-text-' + slug + '">' + esc(dim.nivel) + '</span>';
        interpHtml = esc(dim.interpretacion || "Sin interpretación disponible.");
      }

      return (
        '<tr>' +
          '<td class="dim-col"><div class="tcell">' +
            '<span class="dim-name">' + esc(dim.label) + '</span>' +
            '<span class="dim-tipo">' + tipoLabel + '</span>' +
          '</div></td>' +
          '<td class="res-col"><div class="tcell tcell-center">' + pillHtml + nivelHtml + '</div></td>' +
          '<td class="interp-col"><div class="tcell">' + interpHtml + '</div></td>' +
        '</tr>'
      );
    }).join("");

    return (
      '<div class="report-page page-interpretation">' +

        pageHeader(d, 3) +

        '<div class="rpt-body">' +

          '<div class="rpt-section">' +
            sectionHead('🔍', 'INTERPRETACIÓN PEDAGÓGICA DETALLADA') +
            '<table class="interp-table">' +
              '<thead><tr>' +
                '<th>DIMENSIÓN</th>' +
                '<th style="text-align:center">RESULTADO</th>' +
                '<th>INTERPRETACIÓN</th>' +
              '</tr></thead>' +
              '<tbody>' + rows + '</tbody>' +
            '</table>' +
          '</div>' +

          (d.perfilCognitivo
            ? '<div class="rpt-section">' +
                sectionHead('🧠', 'PERFIL COGNITIVO DEL ESTUDIANTE') +
                '<div class="perfil-box">' + esc(d.perfilCognitivo) + '</div>' +
              '</div>'
            : '') +

          (function () {
            var NIVELES_ORDER = ["Inicial", "En desarrollo", "Avanzado", "Excelente"];
            var RANGES = { "Inicial": "0–39%", "En desarrollo": "40–69%", "Avanzado": "70–84%", "Excelente": "85–100%" };
            var globalNivel = d.globalNivel || "";
            var boxes = NIVELES_ORDER.map(function (nivel) {
              var slug   = nivelSlug(nivel);
              var range  = RANGES[nivel];
              var marker = (nivel === globalNivel) ? '✓' : '·';
              return (
                '<div class="nivel-box nb-' + slug + '">' +
                  '<div class="nb-name">' + esc(nivel) + '</div>' +
                  '<div class="nb-range">' + range + '</div>' +
                  '<div class="nb-marker">' + marker + '</div>' +
                '</div>'
              );
            }).join("");
            return (
              '<div class="rpt-section">' +
                sectionHead('🏆', 'CLASIFICACIÓN GLOBAL POR NIVELES') +
                '<div class="nivel-boxes">' + boxes + '</div>' +
              '</div>'
            );
          }()) +

        '</div>' +

        '<div class="rpt-footer">' +
          '<span>Grupo Mentora · Reportes D-CREA</span>' +
          '<span>' + esc(d.institucion) + '</span>' +
        '</div>' +

      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* PÁGINA 4 — Fortalezas y Recomendaciones para Docentes              */
  /* ------------------------------------------------------------------ */

  function renderPageStrengths(d) {
    var fortalezaItems = d.fortalezas.length > 0
      ? '<ul class="diamond-list list-teal">' +
          d.fortalezas.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") +
        '</ul>'
      : '<p style="font-size:11px;color:#6B7280;font-style:italic;margin:0">Sin dimensiones en nivel Avanzado o Excelente.</p>';

    var oportunidadItems = d.oportunidades.length > 0
      ? '<ul class="diamond-list list-orange">' +
          d.oportunidades.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join("") +
        '</ul>'
      : '<p style="font-size:11px;color:#6B7280;font-style:italic;margin:0">Todas las áreas en nivel óptimo.</p>';

    var docentesRows = d.recomendacionesDocentes.map(function (rec) {
      return (
        '<tr>' +
          '<td class="doc-area"><div class="tcell">' + esc(rec.area) + '</div></td>' +
          '<td class="doc-texto"><div class="tcell">' + esc(rec.texto) + '</div></td>' +
        '</tr>'
      );
    }).join("");

    return (
      '<div class="report-page page-strengths">' +

        pageHeader(d, 4) +

        '<div class="rpt-body">' +

          '<div class="rpt-section">' +
            sectionHead('⭐', 'FORTALEZAS OBSERVADAS Y ÁREAS DE OPORTUNIDAD') +
            '<div class="strengths-cols">' +
              '<div class="strength-col col-fortaleza">' +
                '<div class="col-header col-header-teal">♦ FORTALEZAS</div>' +
                fortalezaItems +
              '</div>' +
              '<div class="strength-col col-oportunidad">' +
                '<div class="col-header col-header-orange">♦ ÁREAS DE OPORTUNIDAD</div>' +
                oportunidadItems +
              '</div>' +
            '</div>' +
          '</div>' +

          renderProgrentisImpactBox(d) +

          (docentesRows
            ? '<div class="rpt-section">' +
                sectionHead('🎓', 'RECOMENDACIONES PARA DOCENTES') +
                '<table class="docentes-table">' +
                  '<thead><tr>' +
                    '<th>ÁREA</th>' +
                    '<th>RECOMENDACIÓN PEDAGÓGICA</th>' +
                  '</tr></thead>' +
                  '<tbody>' + docentesRows + '</tbody>' +
                '</table>' +
              '</div>'
            : '') +

        '</div>' +

        '<div class="rpt-footer">' +
          '<span>Grupo Mentora · Reportes D-CREA</span>' +
          '<span>' + esc(d.institucion) + '</span>' +
        '</div>' +

      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* PÁGINA 5 — Recomendaciones para el Hogar + Clasificación Global    */
  /* ------------------------------------------------------------------ */

  function renderPageHome(d) {
    /* ---- Bloque de recomendaciones para el hogar ---- */
    var hogarBlock = "";
    var rh = d.recomendacionesHogar;

    if (!rh) {
      hogarBlock = '<p class="hogar-empty">No hay recomendaciones disponibles.</p>';

    } else if (rh.tipo === "fortaleza") {
      /* Todas las dimensiones en Avanzado o Excelente */
      hogarBlock =
        '<div class="hogar-fortaleza-box">' +
          '<div class="hogar-fortaleza-titulo">Perfil de Fortaleza</div>' +
          '<p class="hogar-fortaleza-msg">' + esc(rh.mensaje) + '</p>' +
          '<div class="hogar-fortaleza-enrich-lbl">Actividad de enriquecimiento sugerida</div>' +
          '<p class="hogar-fortaleza-enrich">' + esc(rh.enriquecimiento) + '</p>' +
        '</div>';

    } else if (rh.tipo === "personalizado" && Array.isArray(rh.items)) {
      /* Tarjetas por dimensión */
      var cards = rh.items.map(function (item) {
        var slug  = nivelSlug(item.nivel);
        var color = nivelColor(item.nivel);

        var textosHTML = "";
        if (item.textos && item.textos.length > 0) {
          /* Primera recomendación: principal */
          textosHTML += '<p class="hogar-rec-principal">' + esc(item.textos[0]) + '</p>';
          /* Secundarias (si las hay) */
          if (item.textos.length > 1) {
            var secs = item.textos.slice(1).map(function (t) {
              return '<li class="hogar-rec-sec-item">' + esc(t) + '</li>';
            }).join("");
            textosHTML += '<ul class="hogar-rec-sec-list">' + secs + '</ul>';
          }
        }

        return (
          '<div class="hogar-dim-card">' +
            '<div class="hogar-dim-header" style="border-left-color:' + color + '">' +
              '<span class="hogar-dim-label">' + esc(item.dimLabel) + '</span>' +
              '<span class="nivel-badge nivel-' + slug + '">' + esc(item.nivel) + '</span>' +
            '</div>' +
            '<div class="hogar-dim-body">' + textosHTML + '</div>' +
          '</div>'
        );
      }).join("");

      hogarBlock = '<div class="hogar-recs-wrap">' + cards + '</div>';

    } else if (rh.tipo === "legado" && Array.isArray(rh.textos)) {
      /* Compatibilidad con sistema anterior */
      var legItems = rh.textos.map(function (r) {
        return '<li>' + esc(r) + '</li>';
      }).join("");
      hogarBlock = '<ul class="home-list">' + legItems + '</ul>';
    }

    // Destrezas Progrentis — dimensiones con score < 70
    var skillsData = window.PROGRENTIS_SKILLS;
    var progrentisHTML = '';
    if (skillsData) {
      var catMap = getProgrentisCategoryMap(d);
      var cats = Object.keys(catMap)
        .sort(function (a, b) { return catMap[b].length - catMap[a].length; });

      var catHTML = cats.map(function (cat) {
        var catInfo   = skillsData.categorias[cat] || {};
        var color     = catInfo.color || '#289889';
        var destrezas = catMap[cat].slice(0, 5);
        var pillsHTML = destrezas.map(function (s) {
          return '<span class="skill-pill" style="border-color:' + color + ';color:' + color + '">' + esc(s) + '</span>';
        }).join('');
        return (
          '<div class="progrentis-cat">' +
            '<div class="progrentis-cat-header" style="background:' + color + '">' +
              '<span class="progrentis-cat-name">' + esc(cat) + '</span>' +
            '</div>' +
            '<div class="progrentis-skills-list">' + pillsHTML + '</div>' +
          '</div>'
        );
      }).join('');

      var body = cats.length > 0
        ? '<div class="progrentis-cats">' + catHTML + '</div>'
        : '<p class="progrentis-note">El estudiante muestra un rendimiento sólido en todas las áreas evaluadas. ' +
          'Progrentis trabajará destrezas de enriquecimiento para potenciar sus fortalezas.</p>';

      var introBlock =
        '<div class="progrentis-intro-block">' +
          '<p class="progrentis-desc">Progrentis es la plataforma de entrenamiento cognitivo de Grupo Mentora. ' +
          'Trabajamos con su hijo/a <strong>dos veces por semana</strong> desarrollando las destrezas ' +
          'que necesita para aprender mejor.</p>' +
          '<div class="progrentis-stats">' +
            '<div class="progrentis-stat">' +
              '<div class="progrentis-stat-num">102</div>' +
              '<div class="progrentis-stat-lbl">Destrezas<br>cognitivas</div>' +
            '</div>' +
            '<div class="progrentis-stat">' +
              '<div class="progrentis-stat-num">7</div>' +
              '<div class="progrentis-stat-lbl">Funciones<br>ejecutivas</div>' +
            '</div>' +
            '<div class="progrentis-stat">' +
              '<div class="progrentis-stat-num">2×</div>' +
              '<div class="progrentis-stat-lbl">Sesiones<br>por semana</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      progrentisHTML =
        '<div class="rpt-section">' +
          sectionHead('', 'DESTREZAS QUE PROGRENTIS TRABAJARÁ CON EL ESTUDIANTE') +
          introBlock +
          body +
        '</div>';
    }

    return (
      '<div class="report-page page-home">' +

        pageHeader(d, 5) +

        '<div class="rpt-body">' +

          '<div class="rpt-section">' +
            sectionHead('', 'RECOMENDACIONES PARA EL HOGAR') +
            hogarBlock +
          '</div>' +

          progrentisHTML +

        '</div>' +

        '<div class="rpt-footer">' +
          '<span>Grupo Mentora · Reportes D-CREA · ' + esc(d.fecha) + '</span>' +
          '<span>' + esc(d.institucion) + ' · Documento confidencial</span>' +
        '</div>' +

      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Función principal                                                   */
  /* ------------------------------------------------------------------ */

  function renderReport(reportData) {
    var d = reportData;
    return (
      '<div class="student-report"' +
        ' data-student-id="'   + esc(d.id)     + '"' +
        ' data-student-name="' + esc(d.nombre) + '">' +
        renderPageCover(d) +
        renderPageExecutive(d) +
        renderPageInterpretation(d) +
        renderPageStrengths(d) +
        renderPageHome(d) +
      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Exportar al ámbito global                                           */
  /* ------------------------------------------------------------------ */
  window.renderReport              = renderReport;
  window.renderRadarCharts         = renderRadarCharts;
  window.renderInterpretationTable = function () {};
  window.renderLevelClassification = function () {};

})();
