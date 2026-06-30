/**
 * D-CREA — Destrezas de Comprensión y Resolución
 * Grupo Mentora
 *
 * pdf-exporter.js
 * Exporta reportes a PDF usando html-to-image (SVGForeignObject → renderizado
 * CSS nativo del navegador) + jsPDF para descarga automática sin diálogo.
 *
 * Dependencias CDN cargadas antes de este script:
 *  - html-to-image  → window.htmlToImage
 *  - jsPDF          → window.jspdf.jsPDF
 *  - Chart.js       → window.Chart
 */

(function () {
  /* ------------------------------------------------------------------ */
  /* Rastreo de instancias Chart.js                                      */
  /* ------------------------------------------------------------------ */
  var initializedCanvases = new WeakMap();

  /* ------------------------------------------------------------------ */
  /* initRadarCharts                                                     */
  /* ------------------------------------------------------------------ */
  function initRadarCharts(containerEl) {
    if (!window.Chart) {
      console.warn("[pdf-exporter] Chart.js no está disponible.");
      return;
    }

    containerEl.querySelectorAll(".radar-chart").forEach(function (canvas) {
      if (initializedCanvases.has(canvas)) return;

      var labels, values, color;
      try {
        labels = JSON.parse(canvas.dataset.labels || "[]");
        values = JSON.parse(canvas.dataset.values || "[]").map(function (v) {
          return (v === null || v === undefined) ? 0 : v;
        });
        color = canvas.dataset.color || "#289889";
      } catch (e) {
        console.error("[pdf-exporter] Error leyendo data-attributes:", e);
        return;
      }

      try {
        var chart = new Chart(canvas, {
          type: "radar",
          data: {
            labels: labels,
            datasets: [{
              data:                 values,
              borderColor:          color,
              backgroundColor:      color + "33",
              borderWidth:          2,
              pointBackgroundColor: color,
              pointBorderColor:     "#fff",
              pointRadius:          4,
              pointHoverRadius:     6
            }]
          },
          options: {
            responsive:          false,
            maintainAspectRatio: false,
            animation:           false,
            scales: {
              r: {
                min: 0, max: 100,
                ticks: {
                  stepSize: 25,
                  font: { size: 9 },
                  color: "#9ca3af",
                  backdropColor: "transparent"
                },
                pointLabels: { font: { size: 9, weight: "bold" }, color: "#374151" },
                grid: { color: "#e5e7eb" },
                angleLines: { color: "#e5e7eb" }
              }
            },
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            layout: { padding: 18 }
          }
        });
        initializedCanvases.set(canvas, chart);
      } catch (e) {
        console.error("[pdf-exporter] Error creando gráfica:", e);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* _capturePageToCanvas                                                */
  /* Usa html-to-image (SVGForeignObject) → CSS nativo del navegador.   */
  /* ------------------------------------------------------------------ */
  async function _capturePageToCanvas(pageEl) {
    var origDisplay    = pageEl.style.display;
    var origVisibility = pageEl.style.visibility;
    if (pageEl.style.display === 'none') pageEl.style.display = '';
    pageEl.style.visibility = 'visible';

    // Convertir SVGs a PNG (html-to-image no puede cargar SVG externos vía fetch)
    // Si la carga falla (p.ej. file:// sin servidor), sustituir por placeholder
    // para que html-to-image no intente hacer fetch del URL roto.
    var TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    var svgImgs  = Array.from(pageEl.querySelectorAll('img[src$=".svg"]'));
    var origSrcs = [];
    await Promise.all(svgImgs.map(function (img, i) {
      origSrcs[i] = img.src;
      return new Promise(function (resolve) {
        var tmp = new Image();
        tmp.crossOrigin = 'anonymous';
        tmp.onload = function () {
          var scale = 3;
          var w = (img.offsetWidth  || 200) * scale;
          var h = (img.offsetHeight || 60)  * scale;
          var cv = document.createElement('canvas');
          cv.width  = w;
          cv.height = h;
          var ctx = cv.getContext('2d');
          ctx.drawImage(tmp, 0, 0, w, h);
          img.src = cv.toDataURL('image/png');
          resolve();
        };
        tmp.onerror = function () {
          // Falló la carga (file:// bloqueado): poner placeholder transparente
          // para evitar que html-to-image haga fetch del URL roto y falle.
          img.src = TRANSPARENT_GIF;
          resolve();
        };
        tmp.src = origSrcs[i];
      });
    }));

    // Paso 1: capturar la página ignorando los <canvas> (SVGForeignObject no los pinta)
    var pageRect = pageEl.getBoundingClientRect();
    var captured;
    try {
      captured = await htmlToImage.toCanvas(pageEl, {
        backgroundColor:     '#ffffff',
        pixelRatio:          2,
        skipFonts:           true,
        width:  pageEl.offsetWidth  || 816,
        height: pageEl.offsetHeight || 1056,
        style:  { margin: '0', padding: '0' },
        filter: function (node) { return node.tagName !== 'CANVAS'; }
      });
    } finally {
      // Restaurar SVGs originales
      svgImgs.forEach(function (img, i) { if (origSrcs[i]) img.src = origSrcs[i]; });
      pageEl.style.display    = origDisplay;
      pageEl.style.visibility = origVisibility;
    }

    // Paso 2: componer cada canvas directamente sobre el resultado
    // (getBoundingClientRect da posición real incluso en left:-9999px)
    var pixelRatio = 2;
    var ctx = captured.getContext('2d');
    pageEl.querySelectorAll('canvas').forEach(function (cv) {
      if (!cv.width || !cv.height) return;
      var r  = cv.getBoundingClientRect();
      var x  = (r.left - pageRect.left) * pixelRatio;
      var y  = (r.top  - pageRect.top)  * pixelRatio;
      var cw = r.width  * pixelRatio;
      var ch = r.height * pixelRatio;
      ctx.drawImage(cv, x, y, cw, ch);
    });

    return captured;
  }

  /* ------------------------------------------------------------------ */
  /* exportStudentReport                                                 */
  /* Genera y descarga el PDF de un estudiante automáticamente.         */
  /* ------------------------------------------------------------------ */
  async function exportStudentReport(studentId) {
    if (!window.htmlToImage) throw new Error('html-to-image no está disponible.');
    if (!window.jspdf)       throw new Error('jsPDF no está disponible.');

    var reportEl = document.querySelector('.student-report[data-student-id="' + studentId + '"]');
    if (!reportEl) throw new Error('No se encontró el reporte con id: ' + studentId);

    // Chart.js no pinta en canvas con display:none (dimensiones=0) → visibilidad temporal
    var pages = reportEl.querySelectorAll('.report-page');
    var origStates = Array.from(pages).map(function (p) {
      var d = p.style.display, v = p.style.visibility;
      p.style.display = 'block'; p.style.visibility = 'visible';
      return { el: p, d: d, v: v };
    });

    initRadarCharts(reportEl);
    await new Promise(function (r) { requestAnimationFrame(r); });
    await new Promise(function (r) { requestAnimationFrame(r); });
    await new Promise(function (r) { setTimeout(r, 400); });

    // Restaurar antes de capturar (_capturePageToCanvas maneja la suya internamente)
    origStates.forEach(function (s) { s.el.style.display = s.d; s.el.style.visibility = s.v; });

    var { jsPDF } = window.jspdf;
    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    var pdfW = pdf.internal.pageSize.getWidth();
    var pdfH = pdf.internal.pageSize.getHeight();
    var firstPage = true;

    for (var i = 0; i < pages.length; i++) {
      var pageEl = pages[i];
      var canvas  = await _capturePageToCanvas(pageEl);
      var imgData = canvas.toDataURL('image/jpeg', 0.95);
      var cW = canvas.width, cH = canvas.height;
      var ratio = pdfW / (cW / 2);
      var imgH  = (cH / 2) * ratio;

      if (!firstPage) pdf.addPage('letter', 'portrait');
      firstPage = false;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, Math.min(imgH, pdfH));
    }

    var nombre   = reportEl.dataset.studentName || studentId;
    var filename = 'reporte-' + nombre.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-') + '.pdf';

    pdf.save(filename);
  }

  /* ------------------------------------------------------------------ */
  /* exportAllReports                                                    */
  /* ------------------------------------------------------------------ */
  async function exportAllReports(students) {
    if (!students || students.length === 0) return;
    if (!window.htmlToImage) throw new Error('html-to-image no está disponible.');
    if (!window.jspdf)       throw new Error('jsPDF no está disponible.');

    var { jsPDF } = window.jspdf;
    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    var pdfW = pdf.internal.pageSize.getWidth();
    var pdfH = pdf.internal.pageSize.getHeight();
    var firstPage = true;

    for (var s = 0; s < students.length; s++) {
      var entry = students[s];
      var id = (typeof entry === 'string') ? entry : entry.id;
      if (!id) continue;

      var reportEl = document.querySelector('.student-report[data-student-id="' + id + '"]');
      if (!reportEl) continue;

      var pages = reportEl.querySelectorAll('.report-page');
      var origStates = Array.from(pages).map(function (p) {
        var d = p.style.display, v = p.style.visibility;
        p.style.display = 'block'; p.style.visibility = 'visible';
        return { el: p, d: d, v: v };
      });

      initRadarCharts(reportEl);
      await new Promise(function (r) { requestAnimationFrame(r); });
      await new Promise(function (r) { requestAnimationFrame(r); });
      await new Promise(function (r) { setTimeout(r, 400); });

      origStates.forEach(function (s) { s.el.style.display = s.d; s.el.style.visibility = s.v; });

      for (var i = 0; i < pages.length; i++) {
        var captured = await _capturePageToCanvas(pages[i]);
        var imgData  = captured.toDataURL('image/jpeg', 0.95);
        var ratio    = pdfW / (captured.width / 2);
        var imgH     = (captured.height / 2) * ratio;

        if (!firstPage) pdf.addPage('letter', 'portrait');
        firstPage = false;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, Math.min(imgH, pdfH));
      }
    }

    pdf.save('reportes-dcrea.pdf');
  }

  /* ------------------------------------------------------------------ */
  /* destroyRadarChart / destroyAllChartsIn                              */
  /* ------------------------------------------------------------------ */
  function destroyRadarChart(canvas) {
    var chart = initializedCanvases.get(canvas);
    if (chart) {
      try { chart.destroy(); } catch (e) { /* noop */ }
      initializedCanvases.delete(canvas);
    }
  }

  function destroyAllChartsIn(containerEl) {
    containerEl.querySelectorAll(".radar-chart").forEach(destroyRadarChart);
  }

  /* ------------------------------------------------------------------ */
  /* Exports globales                                                    */
  /* ------------------------------------------------------------------ */
  window.initRadarCharts     = initRadarCharts;
  window.exportStudentReport = exportStudentReport;
  window.exportAllReports    = exportAllReports;
  window.destroyRadarChart   = destroyRadarChart;
  window.destroyAllChartsIn  = destroyAllChartsIn;

})();
