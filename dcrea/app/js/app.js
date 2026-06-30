/**
 * D-CREA — Destrezas de Comprensión y Resolución
 * Grupo Mentora
 *
 * app.js — Orquestación de la interfaz unificada (workspace + progreso).
 * Sin módulos ES: funciones globales, compatible con GitHub Pages.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* PDF.js Worker                                                        */
  /* ------------------------------------------------------------------ */
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  /* ------------------------------------------------------------------ */
  /* Estado de la aplicación                                             */
  /* ------------------------------------------------------------------ */
  var state = {
    file: null,
    institucion: '',
    fecha: '',
    rawStudents: [],
    reportDataList: [],
    selectedIds: new Set()
  };

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function nivelSlug(nivel) {
    if (!nivel) return 'na';
    return nivel.toLowerCase().replace(/\s+/g, '-');
  }

  function formatBytes(bytes) {
    if (bytes < 1024)           return bytes + ' B';
    if (bytes < 1024 * 1024)   return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function formatDateSpanish(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var meses = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var day = parseInt(parts[2], 10);
    var mon = parseInt(parts[1], 10) - 1;
    var yr  = parseInt(parts[0], 10);
    if (isNaN(day) || isNaN(mon) || isNaN(yr)) return iso;
    return day + ' de ' + meses[mon] + ' de ' + yr;
  }

  /* ------------------------------------------------------------------ */
  /* Referencias al DOM                                                  */
  /* ------------------------------------------------------------------ */
  function $(id) { return document.getElementById(id); }

  var dom = {
    // Workspace
    workspace:         $('workspace'),
    panelEmpty:        $('panel-empty'),
    studentsLoaded:    $('students-loaded'),

    // Upload
    dropZone:          $('drop-zone'),
    pdfUpload:         $('pdf-upload'),
    fileInfo:          $('file-info'),
    fileName:          $('file-name'),
    fileSize:          $('file-size'),
    fileRemoveBtn:     $('file-remove-btn'),
    dropOverlay:       $('drop-overlay'),

    // Config form
    institutionInput:  $('institution-input'),
    dateInput:         $('date-input'),
    parseBtn:          $('parse-btn'),
    parsingIndicator:  $('parsing-indicator'),
    parsingStatus:     $('parsing-status'),

    // Students panel
    studentsList:      $('students-list'),
    studentsCount:     $('students-count'),
    previewInstLabel:  $('preview-institution-label'),
    studentsSearch:    $('students-search'),
    selectAllBtn:      $('select-all-btn'),
    deselectAllBtn:    $('deselect-all-btn'),
    selectionInfo:     $('selection-info'),
    generateSelBtn:    $('generate-selected-btn'),
    generateAllBtn:    $('generate-all-btn'),
    noSearchResults:   $('no-search-results'),

    // Modal de progreso
    progressModal:      $('progress-modal'),
    modalGenerating:    $('modal-generating'),
    progressStudName:   $('progress-student-name'),
    progressStudGrade:  $('progress-student-grade'),
    progressAvatar:     $('progress-avatar'),
    ringFill:           $('ring-fill'),
    ringFraction:       $('ring-fraction'),
    ringPctInner:       $('ring-pct-inner'),
    progressBar:        $('progress-bar'),
    progressText:       $('progress-text'),
    progressPct:        $('progress-pct'),
    progressTrack:      $('progress-track'),
    progressSpinner:    $('progress-spinner-wrapper'),
    progressLogInner:   $('progress-log-inner'),
    progressDone:       $('progress-done'),
    doneDesc:           $('done-desc'),
    doneStats:          $('done-stats'),
    restartBtn:         $('restart-btn'),

    // Error
    errorToast:        $('error-toast'),
    errorMessage:      $('error-message'),
    errorCloseBtn:     $('error-close-btn'),

    // Header meta
    headerMeta:        $('header-meta'),
    headerMetaInst:    $('header-meta-institution'),
    headerMetaDate:    $('header-meta-date'),

    reportsContainer:  $('reports-container'),

    // Modal vista previa
    prevModal:         $('prev-modal'),
    prevTitleName:     $('prev-title-name'),
    ptabHtml:          $('ptab-html'),
    ptabPdf:           $('ptab-pdf'),
    prevPaneHtml:      $('prev-pane-html'),
    prevPanePdf:       $('prev-pane-pdf'),
    prevHtmlPages:     $('prev-html-pages'),
    prevPdfTrigger:    $('prev-pdf-trigger'),
    prevPdfLoading:    $('prev-pdf-loading'),
    prevPdfPages:      $('prev-pdf-pages'),
    prevGenPdfBtn:     $('prev-gen-pdf-btn'),
    prevCloseBtn:      $('prev-close-btn'),
    prevDownloadBtn:   $('prev-download-btn')
  };

  /* ------------------------------------------------------------------ */
  /* Navegación: workspace ↔ progreso                                    */
  /* ------------------------------------------------------------------ */
  function showWorkspace() {
    if (dom.progressModal) dom.progressModal.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showProgress() {
    if (dom.progressModal) dom.progressModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  /* ------------------------------------------------------------------ */
  /* Carga de archivo                                                    */
  /* ------------------------------------------------------------------ */
  function handleFile(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showError('El archivo seleccionado no es un PDF. Por favor elige un archivo .pdf');
      return;
    }
    state.file = file;
    dom.fileName.textContent = file.name;
    dom.fileSize.textContent = formatBytes(file.size);
    dom.dropZone.style.display = 'none';
    dom.fileInfo.style.display = 'flex';
    dom.parseBtn.disabled = false;
  }

  function clearFile() {
    state.file = null;
    dom.pdfUpload.value = '';
    dom.dropZone.style.display = '';
    dom.fileInfo.style.display = 'none';
    dom.parseBtn.disabled = true;
  }

  dom.dropZone.addEventListener('click', function (e) {
    if (!e.target.closest('#file-remove-btn')) dom.pdfUpload.click();
  });
  dom.dropZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dom.pdfUpload.click(); }
  });
  dom.dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dom.dropZone.classList.add('dragover');
  });
  dom.dropZone.addEventListener('dragleave', function () {
    dom.dropZone.classList.remove('dragover');
  });
  dom.dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dom.dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });
  dom.pdfUpload.addEventListener('change', function () {
    if (this.files.length > 0) handleFile(this.files[0]);
  });
  dom.fileRemoveBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    clearFile();
  });

  [dom.institutionInput, dom.dateInput].forEach(function (el) {
    if (el) el.addEventListener('input', function () { el.classList.remove('input-error'); });
  });

  /* ------------------------------------------------------------------ */
  /* Extracción del PDF                                                  */
  /* ------------------------------------------------------------------ */
  dom.parseBtn.addEventListener('click', async function () {
    var inst     = (dom.institutionInput.value || '').trim();
    var fechaIso = (dom.dateInput.value        || '').trim();

    var valid = true;
    if (!inst) {
      dom.institutionInput.classList.add('input-error');
      dom.institutionInput.focus();
      valid = false;
    }
    if (!fechaIso) {
      dom.dateInput.classList.add('input-error');
      if (valid) dom.dateInput.focus();
      valid = false;
    }
    if (!valid) return;

    var fecha = formatDateSpanish(fechaIso);
    state.institucion = inst;
    state.fecha       = fecha;

    dom.parseBtn.disabled = true;
    dom.parsingIndicator.style.display = 'flex';
    dom.parsingStatus.textContent = 'Leyendo páginas del PDF…';

    try {
      if (typeof parsePDF !== 'function') throw new Error('Motor de PDF no disponible. Recarga la página.');

      var rawStudents = await parsePDF(state.file);

      if (!rawStudents || rawStudents.length === 0) {
        throw new Error(
          'No se encontraron estudiantes en el PDF. ' +
          'Verifica que el archivo contenga la tabla "Resultados por participante".'
        );
      }

      dom.parsingStatus.textContent = 'Procesando ' + rawStudents.length + ' estudiantes…';
      await new Promise(function (r) { setTimeout(r, 50); });

      state.rawStudents    = rawStudents;
      state.reportDataList = processAllStudents(rawStudents, state.institucion, state.fecha);
      state.selectedIds    = new Set(state.reportDataList.map(function (r) { return r.id; }));

      // Pre-renderizar reportes en contenedor oculto
      dom.reportsContainer.innerHTML = '';
      state.reportDataList.forEach(function (rd) {
        var html = renderReport(rd);
        dom.reportsContainer.insertAdjacentHTML('beforeend', html);
      });

      // Actualizar header
      dom.headerMeta.style.display   = 'flex';
      dom.headerMetaInst.textContent = inst;
      dom.headerMetaDate.textContent = fecha;

      // Mostrar estudiantes en el panel derecho
      dom.studentsCount.textContent    = state.reportDataList.length + ' estudiante' +
        (state.reportDataList.length !== 1 ? 's' : '');
      dom.previewInstLabel.textContent = inst;
      renderStudentCards(state.reportDataList);

      dom.panelEmpty.style.display    = 'none';
      dom.studentsLoaded.style.display = 'block';

    } catch (err) {
      console.error('[app] Error al procesar PDF:', err);
      showError(err.message || 'Error al procesar el PDF. Intenta de nuevo.');
    } finally {
      dom.parseBtn.disabled = false;
      dom.parsingIndicator.style.display = 'none';
    }
  });

  /* ------------------------------------------------------------------ */
  /* Cards de estudiantes                                                */
  /* ------------------------------------------------------------------ */
  function renderStudentCards(students) {
    dom.studentsList.innerHTML = '';

    students.forEach(function (rd) {
      var card = document.createElement('div');
      card.className = 'student-card' + (state.selectedIds.has(rd.id) ? ' selected' : '');
      card.dataset.id    = rd.id;
      card.dataset.name  = rd.nombre.toLowerCase();
      card.dataset.grado = (rd.grado || '').toLowerCase();
      card.setAttribute('role', 'listitem');

      var cScore = rd.promedios.comprension !== null ? rd.promedios.comprension + '%' : 'N/A';
      var rScore = rd.promedios.resolucion  !== null ? rd.promedios.resolucion  + '%' : 'N/A';
      var cNivel = rd.niveles.comprension   || '';

      card.innerHTML =
        '<label class="student-card-inner">' +
          '<input type="checkbox" class="student-checkbox" data-id="' + esc(rd.id) + '"' +
            (state.selectedIds.has(rd.id) ? ' checked' : '') + '>' +
          '<div class="student-card-avatar" aria-hidden="true">' + esc(rd.nombre.charAt(0).toUpperCase()) + '</div>' +
          '<div class="student-card-info">' +
            '<div class="student-card-name">' + esc(rd.nombre) + '</div>' +
            '<div class="student-card-meta">' + esc(rd.grado || '') + ' · ' + (rd.edad || '?') + ' años</div>' +
            '<div class="student-card-scores">' +
              '<span class="score-pill score-comp">C: ' + cScore + '</span>' +
              '<span class="score-pill score-res">R: ' + rScore + '</span>' +
              (cNivel ? '<span class="nivel-badge nivel-' + nivelSlug(cNivel) + ' badge-sm">' + esc(cNivel) + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</label>' +
        '<button class="student-preview-btn" title="Vista previa del reporte" aria-label="Vista previa de ' + esc(rd.nombre) + '" type="button" data-id="' + esc(rd.id) + '">👁</button>';

      card.querySelector('.student-checkbox').addEventListener('change', function (e) {
        if (e.target.checked) {
          state.selectedIds.add(rd.id);
          card.classList.add('selected');
        } else {
          state.selectedIds.delete(rd.id);
          card.classList.remove('selected');
        }
        updateSelectionInfo();
      });

      card.querySelector('.student-preview-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        openPreviewModal(rd);
      });

      dom.studentsList.appendChild(card);
    });

    updateSelectionInfo();
  }

  function updateSelectionInfo() {
    var n = state.selectedIds.size;
    dom.selectionInfo.textContent = n + (n === 1 ? ' seleccionado' : ' seleccionados');
    dom.generateSelBtn.disabled = n === 0;
  }

  dom.studentsSearch.addEventListener('input', function () {
    var term    = this.value.toLowerCase().trim();
    var cards   = dom.studentsList.querySelectorAll('.student-card');
    var visible = 0;
    cards.forEach(function (c) {
      var match = !term || c.dataset.name.includes(term) || c.dataset.grado.includes(term);
      c.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    dom.noSearchResults.style.display = (visible === 0 && term) ? 'block' : 'none';
  });

  dom.selectAllBtn.addEventListener('click', function () {
    dom.studentsList.querySelectorAll('.student-checkbox').forEach(function (cb) {
      cb.checked = true;
      var card = cb.closest('.student-card');
      if (card) { state.selectedIds.add(card.dataset.id); card.classList.add('selected'); }
    });
    updateSelectionInfo();
  });

  dom.deselectAllBtn.addEventListener('click', function () {
    dom.studentsList.querySelectorAll('.student-checkbox').forEach(function (cb) {
      cb.checked = false;
      var card = cb.closest('.student-card');
      if (card) { state.selectedIds.delete(card.dataset.id); card.classList.remove('selected'); }
    });
    updateSelectionInfo();
  });

  dom.generateAllBtn.addEventListener('click', function () {
    startGeneration(state.reportDataList);
  });

  dom.generateSelBtn.addEventListener('click', function () {
    var sel = state.reportDataList.filter(function (rd) { return state.selectedIds.has(rd.id); });
    if (sel.length === 0) { showError('Selecciona al menos un estudiante.'); return; }
    startGeneration(sel);
  });

  /* ------------------------------------------------------------------ */
  /* Generación de PDFs                                                  */
  /* ------------------------------------------------------------------ */
  var RING_CIRCUMFERENCE = 376.99; // 2 * π * 60

  async function startGeneration(students) {
    showProgress();

    // Reset modal al estado "generando"
    if (dom.modalGenerating) dom.modalGenerating.style.display = '';
    dom.progressDone.style.display    = 'none';
    dom.progressSpinner.style.display = '';
    dom.progressBar.style.width       = '0%';
    dom.progressText.textContent      = '0 de ' + students.length + ' reportes';
    dom.progressPct.textContent       = '0%';
    dom.progressLogInner.innerHTML    = '';

    // Reset anillo
    if (dom.ringFill)     dom.ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE;
    if (dom.ringFraction) dom.ringFraction.textContent = '0/' + students.length;
    if (dom.ringPctInner) dom.ringPctInner.textContent = '0%';

    var ok = 0, fail = 0;

    for (var i = 0; i < students.length; i++) {
      var rd = students[i];
      if (dom.progressAvatar) dom.progressAvatar.textContent = rd.nombre.charAt(0).toUpperCase();
      dom.progressStudName.textContent  = rd.nombre;
      dom.progressStudGrade.textContent = rd.grado || '';
      logEntry('info', 'Generando reporte de ' + rd.nombre + '…');

      try {
        var reportEl = dom.reportsContainer.querySelector('[data-student-id="' + rd.id + '"]');
        if (reportEl && typeof initRadarCharts === 'function') {
          initRadarCharts(reportEl);
        }
        await new Promise(function (r) { setTimeout(r, 450); });

        if (typeof exportStudentReport !== 'function') throw new Error('Exportador no disponible.');
        await exportStudentReport(rd.id);

        ok++;
        logEntry('success', '✓ ' + rd.nombre + ' — PDF descargado');
      } catch (err) {
        fail++;
        console.error('[app] Reporte de ' + rd.nombre + ':', err);
        logEntry('error', '✗ ' + rd.nombre + ' — ' + (err.message || 'Error'));
      }

      var pct = Math.round(((i + 1) / students.length) * 100);
      // Anillo SVG
      if (dom.ringFill)     dom.ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct / 100);
      if (dom.ringFraction) dom.ringFraction.textContent = (i + 1) + '/' + students.length;
      if (dom.ringPctInner) dom.ringPctInner.textContent = pct + '%';
      // Barra lineal
      dom.progressBar.style.width = pct + '%';
      dom.progressTrack.setAttribute('aria-valuenow', pct);
      dom.progressText.textContent = (i + 1) + ' de ' + students.length + ' reportes';
      dom.progressPct.textContent  = pct + '%';

      if (i < students.length - 1) await new Promise(function (r) { setTimeout(r, 500); });
    }

    // Estado completado: ocultar vista generando, mostrar done
    if (dom.modalGenerating) dom.modalGenerating.style.display = 'none';
    dom.progressSpinner.style.display = 'none';

    dom.doneDesc.textContent = ok + ' de ' + students.length + ' reportes generados exitosamente.';
    dom.doneStats.innerHTML =
      '<div class="stat-item stat-ok"><span class="stat-num">' + ok + '</span> exitosos</div>' +
      (fail > 0
        ? '<div class="stat-item stat-err"><span class="stat-num">' + fail + '</span> con error</div>'
        : '');

    dom.progressDone.style.display = 'block';
  }

  function logEntry(type, text) {
    var el = document.createElement('div');
    el.className = 'log-entry log-' + type;
    el.textContent = text;
    dom.progressLogInner.appendChild(el);
    dom.progressLogInner.parentElement.scrollTop = dom.progressLogInner.parentElement.scrollHeight;
  }

  dom.restartBtn.addEventListener('click', function () {
    Object.assign(state, {
      file: null, institucion: '', fecha: '',
      rawStudents: [], reportDataList: [], selectedIds: new Set()
    });
    clearFile();
    if (dom.institutionInput) dom.institutionInput.value = '';
    if (dom.dateInput)        dom.dateInput.value = '';
    dom.reportsContainer.innerHTML   = '';
    dom.headerMeta.style.display     = 'none';
    dom.progressSpinner.style.display = '';
    dom.studentsList.innerHTML       = '';
    dom.panelEmpty.style.display     = '';
    dom.studentsLoaded.style.display = 'none';
    // Mostrar workspace y cerrar modal
    showWorkspace();
  });

  /* ------------------------------------------------------------------ */
  /* Modal Vista Previa                                                  */
  /* ------------------------------------------------------------------ */
  var prevCurrentId = null;

  function openPreviewModal(rd) {
    prevCurrentId = rd.id;
    dom.prevTitleName.textContent = rd.nombre + ' · ' + (rd.grado || '');

    // Asegurar que el reporte esté renderizado en reports-container
    var existing = dom.reportsContainer.querySelector('[data-student-id="' + rd.id + '"]');
    if (!existing) {
      dom.reportsContainer.insertAdjacentHTML('beforeend', renderReport(rd));
      var newEl = dom.reportsContainer.querySelector('[data-student-id="' + rd.id + '"]');
      if (newEl) initRadarCharts(newEl);
    }

    // Pestaña HTML: clonar páginas y escalarlas
    dom.prevHtmlPages.innerHTML = '';
    var reportEl = dom.reportsContainer.querySelector('[data-student-id="' + rd.id + '"]');
    if (reportEl) {
      var pages = reportEl.querySelectorAll('.report-page');
      var SCALE = 0.62; // 816px → ~505px
      pages.forEach(function(page, i) {
        var wrapper = document.createElement('div');
        wrapper.className = 'prev-page-wrap';
        var label = document.createElement('span');
        label.className = 'prev-page-label';
        label.textContent = 'Página ' + (i + 1);
        wrapper.appendChild(label);
        var clone = page.cloneNode(true);
        clone.style.cssText = 'transform:scale(' + SCALE + ');transform-origin:top left;' +
          'width:816px;display:block;flex-shrink:0;margin-bottom:0;';
        // Contenedor del tamaño escalado
        var scaleWrap = document.createElement('div');
        scaleWrap.style.cssText = 'width:' + Math.round(816 * SCALE) + 'px;height:' + Math.round(1056 * SCALE) + 'px;overflow:hidden;position:relative;';
        scaleWrap.appendChild(clone);
        wrapper.appendChild(scaleWrap);
        dom.prevHtmlPages.appendChild(wrapper);
        // Re-init radars en el clon
        if (window.initRadarCharts) initRadarCharts(clone);
      });
    }

    // Resetear pestaña PDF
    dom.prevPdfTrigger.style.display  = 'block';
    dom.prevPdfLoading.style.display  = 'none';
    dom.prevPdfPages.style.display    = 'none';
    dom.prevPdfPages.innerHTML        = '';

    // Activar pestaña HTML por defecto
    switchPrevTab('html');

    // Mostrar modal
    dom.prevModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closePrevModal() {
    dom.prevModal.style.display = 'none';
    document.body.style.overflow = '';
    prevCurrentId = null;
  }

  function switchPrevTab(tab) {
    if (tab === 'html') {
      dom.ptabHtml.classList.add('is-active');
      dom.ptabPdf.classList.remove('is-active');
      dom.prevPaneHtml.style.display = '';
      dom.prevPanePdf.style.display  = 'none';
    } else {
      dom.ptabPdf.classList.add('is-active');
      dom.ptabHtml.classList.remove('is-active');
      dom.prevPanePdf.style.display  = '';
      dom.prevPaneHtml.style.display = 'none';
    }
  }

  dom.ptabHtml.addEventListener('click', function() { switchPrevTab('html'); });
  dom.ptabPdf.addEventListener('click',  function() { switchPrevTab('pdf'); });
  dom.prevCloseBtn.addEventListener('click', closePrevModal);
  dom.prevModal.addEventListener('click', function(e) {
    if (e.target === dom.prevModal) closePrevModal();
  });

  dom.prevGenPdfBtn.addEventListener('click', function() {
    if (!prevCurrentId) return;
    dom.prevPdfTrigger.style.display = 'none';
    dom.prevPdfLoading.style.display = 'flex';
    exportStudentReport(prevCurrentId)
      .then(function() {
        dom.prevPdfLoading.style.display = 'none';
        dom.prevPdfTrigger.style.display = 'block';
      })
      .catch(function(e) {
        dom.prevPdfLoading.style.display = 'none';
        dom.prevPdfTrigger.style.display = 'block';
        showError('Error al abrir impresión: ' + (e.message || e));
      });
  });

  dom.prevDownloadBtn.addEventListener('click', function() {
    if (!prevCurrentId) return;
    closePrevModal();
    exportStudentReport(prevCurrentId).catch(function(e) { showError('Error al exportar: ' + e.message); });
  });

  /* ------------------------------------------------------------------ */
  /* Error toast                                                         */
  /* ------------------------------------------------------------------ */
  function showError(msg) {
    dom.errorMessage.textContent = msg;
    dom.errorToast.style.display = 'flex';
    setTimeout(function () { dom.errorToast.style.display = 'none'; }, 7000);
  }
  dom.errorCloseBtn.addEventListener('click', function () {
    dom.errorToast.style.display = 'none';
  });

  /* ------------------------------------------------------------------ */
  /* Arranque                                                            */
  /* ------------------------------------------------------------------ */
  showWorkspace();

  // Exponer para pruebas y uso externo
  window._openPreviewModal = openPreviewModal;

})();
