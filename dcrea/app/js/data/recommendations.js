/**
 * D-CREA — Destrezas de Comprensión y Resolución Avanzadas
 * Grupo Mentora
 *
 * recommendations.js
 * Recomendaciones para docentes (por dimensión y nivel) y recomendaciones
 * para el hogar (universales + condicionales según el perfil).
 *
 * Marcos de referencia: Solé y Cassany (lectura), Polya y Schoenfeld (resolución).
 *
 * Sin módulos ES: constantes y funciones globales para uso con <script>.
 */

/* ------------------------------------------------------------------ */
/* Recomendaciones para el docente                                     */
/* Texto accionable y pedagógico por dimensión y nivel.                */
/* Excelente => null (no se muestra; ya es una fortaleza consolidada). */
/* ------------------------------------------------------------------ */
const TEACHER_RECOMMENDATIONS = {
  Literal: {
    Inicial:
      "Trabajar con textos breves y preguntas literales muy dirigidas (¿quién?, ¿qué?, ¿dónde?, ¿cuándo?). Usar lectura compartida y señalar físicamente en el texto dónde está cada respuesta.",
    "En desarrollo":
      "Usar organizadores gráficos, resúmenes guiados y ejercicios de identificación de ideas principales. Graduar la complejidad de los textos según el avance.",
    Avanzado:
      "Aumentar la densidad y extensión de los textos e introducir tareas de localización rápida de datos dispersos. Pedir síntesis precisas para afianzar la jerarquización de la información.",
    Excelente: null
  },
  Inferencial: {
    Inicial:
      "Modelar el razonamiento inferencial en voz alta a partir de pistas evidentes del texto. Comenzar con inferencias de causa-efecto y de significado de palabras por contexto.",
    "En desarrollo":
      "Usar actividades de predicción, anticipación de ideas y construcción de significado contextual. Verbalizar en voz alta el razonamiento inferencial que conecta las pistas con la conclusión.",
    Avanzado:
      "Proponer textos con implícitos sutiles, ironía o dobles sentidos y solicitar la justificación de cada inferencia con evidencia del texto. Trabajar la intención del autor.",
    Excelente: null
  },
  Critica: {
    Inicial:
      "Formular preguntas de opinión sencillas tras la lectura (¿qué te pareció?, ¿por qué?) y validar las respuestas para construir confianza. Relacionar el texto con experiencias cercanas del estudiante.",
    "En desarrollo":
      "Enseñar a distinguir hechos de opiniones e identificar la postura del autor. Usar debates guiados y exigir que cada juicio se acompañe de al menos un argumento.",
    Avanzado:
      "Proponer proyectos de investigación, debates formales y producción de textos argumentativos para potenciar esta fortaleza crítica. Trabajar el contraste de fuentes y la detección de sesgos.",
    Excelente: null
  },
  Comprender: {
    Inicial:
      "Enseñar a reformular el problema con palabras propias antes de resolverlo. Subrayar juntos los datos y la pregunta, separando lo que se sabe de lo que se busca.",
    "En desarrollo":
      "Practicar la identificación de datos relevantes vs. irrelevantes en enunciados. Usar organizadores de la estructura del problema: ¿qué sé?, ¿qué me piden?",
    Avanzado:
      "Presentar problemas con datos implícitos, sobrantes o en formatos variados (tablas, gráficos) para exigir una interpretación más fina del enunciado.",
    Excelente: null
  },
  Pensar: {
    Inicial:
      "Introducir un único método estructurado (por ejemplo, las cuatro fases de Polya) y aplicarlo de forma repetida en problemas sencillos hasta interiorizar el hábito de planificar.",
    "En desarrollo":
      "Modelar en voz alta cómo planificar: 'Primero voy a... luego voy a...'. Usar plantillas de resolución paso a paso. Trabajar con problemas resueltos para análisis de estrategia.",
    Avanzado:
      "Plantear problemas que admitan varias estrategias y pedir que se comparen y justifiquen. Introducir problemas no rutinarios que exijan transferir heurísticas conocidas.",
    Excelente: null
  },
  Ejecutar: {
    Inicial:
      "Reforzar el cálculo y la aplicación de procedimientos con práctica corta, frecuente y supervisada. Descomponer cada operación en pasos visibles y verificar uno a uno.",
    "En desarrollo":
      "Aumentar gradualmente la longitud de los procedimientos y fomentar el orden en la presentación del trabajo. Identificar y registrar los errores recurrentes para anticiparlos.",
    Avanzado:
      "Proponer ejercicios de mayor complejidad y estimar tiempos para ganar fluidez. Promover la autocorrección como paso natural tras cada ejecución.",
    Excelente: null
  },
  Responder: {
    Inicial:
      "Instalar una rutina de cierre obligatoria: releer la pregunta y comprobar si la respuesta tiene sentido. Modelar la estimación previa del resultado esperado.",
    "En desarrollo":
      "Convertir la verificación en hábito mediante una lista de control breve al finalizar cada problema (¿responde lo que se pide?, ¿es coherente con los datos?).",
    Avanzado:
      "Fomentar la verificación por vías alternativas (estimación, sustitución, método distinto) y la comunicación clara y justificada de la respuesta.",
    Excelente: null
  }
};

/* ------------------------------------------------------------------ */
/* Recomendaciones para el hogar                                       */
/* Universales (siempre) + condicionales (según el perfil).            */
/* ------------------------------------------------------------------ */
const HOME_UNIVERSAL = [
  "📚 Dedicar 15-20 minutos diarios a la lectura en voz alta o silenciosa. La constancia es más valiosa que la cantidad.",
  "💬 Después de leer, preguntar al estudiante: ¿qué entendiste?, ¿qué opinas?, ¿qué harías tú en esa situación?",
  "✅ Celebrar el esfuerzo y el proceso, no solo el resultado correcto. La perseverancia es una habilidad cognitiva fundamental.",
  "🗣️ Conversar sobre lo cotidiano y animar a explicar sus ideas con detalle: hablar es la antesala de pensar y escribir mejor.",
  "📖 Crear un espacio de estudio tranquilo, sin pantallas de distracción, y respetar un horario regular de trabajo."
];

const HOME_CONDITIONAL = {
  Literal:
    "📝 Pedir que cuente con sus propias palabras lo que acaba de leer o ver, asegurándose de que recuerde los datos importantes.",
  Inferencial:
    "🎬 Mientras leen o ven una película, pausar y preguntar: ¿qué crees que pasará?, ¿por qué actuó así el personaje?",
  Critica:
    "💭 Invitar a dar y defender opiniones sobre noticias o historias: ¿estás de acuerdo?, ¿qué harías tú diferente?",
  Comprender:
    "🔍 Ante un problema cotidiano (una compra, una receta), pedir que primero diga qué se necesita averiguar y con qué datos cuenta.",
  Pensar:
    "🔊 Pedir que explique en voz alta cómo resolvió un problema: el proceso verbal fortalece el pensamiento estratégico.",
  Ejecutar:
    "🎮 Jugar juegos de lógica, rompecabezas, sudoku o acertijos matemáticos de manera regular y relajada.",
  Responder:
    "✔️ Animar a revisar su trabajo antes de darlo por terminado, preguntándose siempre: ¿tiene sentido esta respuesta?"
};

/* ------------------------------------------------------------------ */
/* Utilidad interna: nivel a partir de un score (0-100)                */
/* (Reutiliza nivelFromScore si ya existe; si no, se define aquí.)     */
/* ------------------------------------------------------------------ */
if (typeof nivelFromScore !== "function") {
  function nivelFromScore(score) {
    if (score === null || score === undefined || isNaN(score)) return null;
    if (score < 40) return "Inicial";
    if (score < 70) return "En desarrollo";
    if (score < 85) return "Avanzado";
    return "Excelente";
  }
}

/* ------------------------------------------------------------------ */
/* Recomendaciones para el hogar personalizadas                        */
/*                                                                     */
/* @param {Object} scores   { Literal: 33, Inferencial: 80, ... }      */
/*                          null => N/A, se ignora.                    */
/* @param {Object} [niveles] Opcional { Literal: "Inicial", ... }.     */
/* @returns {string[]} 5-7 recomendaciones (universales + específicas) */
/* ------------------------------------------------------------------ */
function getHomeRecommendations(scores, niveles) {
  const recs = HOME_UNIVERSAL.slice(); // siempre las universales

  const ORDER = [
    "Literal", "Inferencial", "Critica",
    "Comprender", "Pensar", "Ejecutar", "Responder"
  ];

  // Dimensiones por debajo de Avanzado (score < 70), de menor a mayor score.
  const debiles = ORDER
    .filter(function (dim) {
      const s = scores ? scores[dim] : null;
      return s !== null && s !== undefined && !isNaN(s) && s < 70;
    })
    .sort(function (a, b) { return scores[a] - scores[b]; });

  // Agregar hasta 2 recomendaciones condicionales según las áreas más débiles,
  // sin superar el tope de 7 recomendaciones totales.
  for (let i = 0; i < debiles.length && recs.length < 7; i++) {
    const cond = HOME_CONDITIONAL[debiles[i]];
    if (cond && recs.indexOf(cond) === -1) {
      recs.push(cond);
    }
    if (recs.length - HOME_UNIVERSAL.length >= 2) break; // máx 2 condicionales
  }

  return recs;
}
