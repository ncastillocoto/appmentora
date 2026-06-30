/**
 * D-CREA — Destrezas de Comprensión y Resolución Avanzadas
 * Grupo Mentora
 *
 * strengths.js
 * Genera el listado de fortalezas y áreas de oportunidad a partir de los scores
 * normalizados (0-100) de cada dimensión.
 *
 * Reglas:
 *  - Dimensiones con score >= 70 (Avanzado / Excelente) producen FORTALEZAS.
 *  - Dimensiones con score < 70 (Inicial / En desarrollo) producen OPORTUNIDADES.
 *  - score === null o undefined => N/A, se ignora.
 *
 * Sin módulos ES: constantes y funciones globales para uso con <script>.
 */

/* ------------------------------------------------------------------ */
/* Banco de FORTALEZAS (score >= 70)                                   */
/* Describe QUÉ hace bien el estudiante. Diferenciado Avanzado/Excelente*/
/* ------------------------------------------------------------------ */
const STRENGTH_BANK = {
  Literal: {
    Avanzado:
      "Localiza con seguridad la información explícita del texto y distingue las ideas principales de los detalles de apoyo.",
    Excelente:
      "Recupera con rapidez y exactitud toda la información explícita, jerarquizando ideas principales y secundarias incluso en textos extensos."
  },
  Inferencial: {
    Avanzado:
      "Infiere información implícita con buen criterio, deduciendo causas, intenciones y consecuencias a partir de las pistas del texto.",
    Excelente:
      "Construye inferencias complejas y bien sustentadas, integrando pistas dispersas y leyendo entre líneas con notable agudeza."
  },
  Critica: {
    Avanzado:
      "Valora el texto con criterio, distingue hechos de opiniones y construye una opinión propia argumentada.",
    Excelente:
      "Evidencia un pensamiento crítico avanzado: analiza, juzga y transfiere ideas a nuevos contextos detectando sesgos y contrastando perspectivas."
  },
  Comprender: {
    Avanzado:
      "Comprende con claridad el objetivo del problema e identifica con precisión los datos relevantes del enunciado.",
    Excelente:
      "Interpreta con total precisión el objetivo del problema, incluso con datos implícitos, detectando condiciones y restricciones con gran finura."
  },
  Pensar: {
    Avanzado:
      "Diseña estrategias pertinentes antes de operar, descomponiendo la tarea en pasos ordenados y anticipando el camino de solución.",
    Excelente:
      "Planifica con flexibilidad y sofisticación, eligiendo la estrategia más eficiente y transfiriendo heurísticas a problemas novedosos."
  },
  Ejecutar: {
    Avanzado:
      "Ejecuta los procedimientos con orden y precisión, obteniendo resultados correctos en la mayoría de los casos.",
    Excelente:
      "Domina la ejecución de procedimientos con precisión y consistencia, aplicando las técnicas con fluidez y sin perder el control de la secuencia."
  },
  Responder: {
    Avanzado:
      "Verifica la coherencia de su respuesta con la pregunta y los datos, repasando los pasos para confirmar el resultado.",
    Excelente:
      "Verifica de forma sistemática la validez y razonabilidad de cada respuesta, detectando y corrigiendo errores con plena autonomía."
  }
};

/* ------------------------------------------------------------------ */
/* Banco de OPORTUNIDADES (score < 70)                                 */
/* Describe QUÉ trabajar, con estrategia específica y nombrada         */
/* ------------------------------------------------------------------ */
const OPPORTUNITY_BANK = {
  Literal: {
    Inicial:
      "Fortalecer la identificación de información explícita mediante lectura guiada y preguntas literales dirigidas.",
    "En desarrollo":
      "Consolidar la localización de datos relevantes con organizadores gráficos y ejercicios de subrayado de ideas principales."
  },
  Inferencial: {
    Inicial:
      "Desarrollar la capacidad de interpretar información implícita mediante actividades de inferencia contextual y predicción.",
    "En desarrollo":
      "Afianzar las inferencias y las relaciones de causa-efecto verbalizando en voz alta el razonamiento que lleva de las pistas a la conclusión."
  },
  Critica: {
    Inicial:
      "Estimular el pensamiento crítico mediante preguntas de opinión fundamentada: ¿qué piensas?, ¿por qué?, ¿estás de acuerdo?",
    "En desarrollo":
      "Profundizar la valoración crítica distinguiendo hechos de opiniones e identificando la intención del autor con debates guiados."
  },
  Comprender: {
    Inicial:
      "Reforzar la comprensión del enunciado del problema mediante la técnica de reformulación y subrayado de datos e incógnita.",
    "En desarrollo":
      "Consolidar la identificación de datos relevantes vs. irrelevantes con organizadores del tipo ¿qué sé?, ¿qué me piden?"
  },
  Pensar: {
    Inicial:
      "Desarrollar la planificación estratégica con métodos estructurados de resolución como el método de Polya.",
    "En desarrollo":
      "Afianzar el diseño de estrategias con plantillas de resolución paso a paso y análisis de problemas ya resueltos."
  },
  Ejecutar: {
    Inicial:
      "Reforzar la ejecución de procedimientos con práctica guiada y revisión paso a paso de cada operación.",
    "En desarrollo":
      "Consolidar la precisión en los cálculos mediante práctica gradual y control del orden de los pasos en problemas más largos."
  },
  Responder: {
    Inicial:
      "Instalar el hábito de verificación contrastando la respuesta con la pregunta: ¿tiene sentido este resultado?",
    "En desarrollo":
      "Consolidar el hábito de verificación de respuestas mediante rutinas de revisión al finalizar cada solución."
  }
};

/* ------------------------------------------------------------------ */
/* Utilidad: nivel a partir de un score normalizado (0-100)            */
/* ------------------------------------------------------------------ */
function nivelFromScore(score) {
  if (score === null || score === undefined || isNaN(score)) return null;
  if (score < 40) return "Inicial";
  if (score < 70) return "En desarrollo";
  if (score < 85) return "Avanzado";
  return "Excelente";
}

/* ------------------------------------------------------------------ */
/* Función principal                                                   */
/*                                                                     */
/* @param {string} nombre   Nombre del estudiante (reservado para uso  */
/*                          futuro en plantillas personalizadas).      */
/* @param {Object} scores   { Literal: 33, Inferencial: 80, ... }      */
/*                          null => N/A, se ignora.                    */
/* @param {Object} [niveles] Opcional { Literal: "Inicial", ... }.     */
/*                          Si no se pasa, se deriva de los scores.    */
/* @returns {{fortalezas: string[], oportunidades: string[]}}          */
/* ------------------------------------------------------------------ */
function getStrengthsAndOpportunities(nombre, scores, niveles) {
  const ORDER = [
    "Literal", "Inferencial", "Critica",
    "Comprender", "Pensar", "Ejecutar", "Responder"
  ];

  // Candidatos ordenados por score para priorizar cuando hay que recortar.
  const conScore = ORDER
    .filter(function (dim) {
      const s = scores ? scores[dim] : null;
      return s !== null && s !== undefined && !isNaN(s);
    })
    .map(function (dim) {
      const score = scores[dim];
      const nivel = (niveles && niveles[dim]) || nivelFromScore(score);
      return { dim: dim, score: score, nivel: nivel };
    });

  const fortalezas = [];
  const oportunidades = [];

  // Fortalezas: de mayor a menor score (las más destacadas primero).
  conScore
    .filter(function (c) { return c.score >= 70; })
    .sort(function (a, b) { return b.score - a.score; })
    .forEach(function (c) {
      const bank = STRENGTH_BANK[c.dim];
      const texto = bank && (bank[c.nivel] || bank.Excelente || bank.Avanzado);
      if (texto) fortalezas.push(texto);
    });

  // Oportunidades: de menor a mayor score (las más urgentes primero).
  conScore
    .filter(function (c) { return c.score < 70; })
    .sort(function (a, b) { return a.score - b.score; })
    .forEach(function (c) {
      const bank = OPPORTUNITY_BANK[c.dim];
      const texto = bank && (bank[c.nivel] || bank.Inicial || bank["En desarrollo"]);
      if (texto) oportunidades.push(texto);
    });

  // Acotar a los rangos esperados por el reporte.
  // Fortalezas: 1-3. Oportunidades: 3-5 (cuando hay material suficiente).
  return {
    fortalezas: fortalezas.slice(0, 3),
    oportunidades: oportunidades.slice(0, 5)
  };
}
