/**
 * D-CREA — Banco de destrezas Progrentis
 * Mapeo de dimensiones D-CREA → destrezas que Progrentis trabajará con el estudiante.
 */
window.PROGRENTIS_SKILLS = {

  /* ------------------------------------------------------------------ */
  /* Banco completo por categoría                                        */
  /* ------------------------------------------------------------------ */
  categorias: {
    "Comprensión": {
      color: "#E88439",
      destrezas: [
        "Pensamiento interpretativo","Organizar información","Potenciar búsquedas",
        "Análisis gramatical","Asociar","Campos semánticos","Completar ideas",
        "Completar mensajes","Comprensión literal en textos discontinuos","Corregir textos",
        "Deducir","Secuenciar elementos","Secuenciar elementos complejos","Agrupar palabras",
        "Ampliar campo visual","Ampliar fijación ocular","Capturar elementos",
        "Completar figuras geométricas","Conciencia fonética","Conciencia fonológica",
        "Conciencia léxica","Conciencia ortográfica","Conciencia silábica","Deslizar la vista",
        "Discriminación espacial","Discriminación perceptiva","Discriminación visual",
        "Distinguir colores","Fragmentar números","Identificar formas completas o incompletas",
        "Identificar patrones","Leer textos continuos","Leer textos discontinuos",
        "Memoria visual","Planificación","Reconocer direccionalidad",
        "Reconocer palabras por su forma","Reconocer posiciones","Reconocer rimas",
        "Reproducir trazos lineales","Seguir con la vista","Semejanzas entre objetos"
      ]
    },
    "Resolución": {
      color: "#9B59B6",
      destrezas: [
        "Analizar geometría","Aprox. numéricas","Cálculo mental","Cálculo numérico",
        "Comparar tamaños","Entender cantidades","Entender conceptos +->< ","Entender ejes",
        "Entender gráficas","Entender operaciones","Expresar valores","Interpretar datos",
        "Interpretar gráficos estadísticos","Resolver ecuaciones","Número gráficamente",
        "Operatoria","Organizar datos","Predicciones y conjeturas","Proporcionalidad",
        "Realizar operaciones problemas","Reconocer formas","Reconocer obj. problema",
        "Reconocer relaciones elementos","Reconocer traslaciones simetrías y giros",
        "Representar geometría","Tipos de números","Usar croquis mapas y planos",
        "Comprobar resultados problemas","Discriminar datos","Estrategia resolución problemas",
        "Relacionar datos y enunciados","Responder problemas","Pensamiento comprensivo",
        "Pensamiento creativo"
      ]
    },
    "Investigación": {
      color: "#289889",
      destrezas: [
        "Aprender con base a problemas","Conceptualización del entorno digital",
        "Conciencia y comportamiento web","Detectar noticias falsas",
        "Identificar dato erróneo","Iniciación a la filtración digital",
        "Internet (uso y seguridad)","Investigar y contrastar en Internet"
      ]
    },
    "Pensamiento computacional": {
      color: "#E91E8C",
      destrezas: [
        "Descomponer un problema en uno más sencillo","Estrategia y planificación",
        "Formulación de hipótesis","Realización de algoritmos","Reconocimiento de patrones"
      ]
    },
    "Funciones ejecutivas": {
      color: "#4FC3F7",
      destrezas: [
        "Control inhibitorio","Memoria de trabajo","Flexibilidad cognitiva",
        "Planificación","Razonamiento en resolución de problemas"
      ]
    },
    "Atención": {
      color: "#E88439",
      destrezas: [
        "Atención alternada","Atención selectiva","Atención sostenida"
      ]
    }
  },

  /* ------------------------------------------------------------------ */
  /* Mapeo: dimensión D-CREA → destrezas prioritarias por categoría      */
  /* ------------------------------------------------------------------ */
  mapeo: {
    "Comprensión Literal": {
      "Comprensión": [
        "Leer textos continuos","Leer textos discontinuos",
        "Comprensión literal en textos discontinuos","Memoria visual",
        "Identificar patrones","Reconocer palabras por su forma","Ampliar campo visual"
      ]
    },
    "Comprensión Inferencial": {
      "Comprensión": [
        "Pensamiento interpretativo","Deducir","Completar ideas",
        "Asociar","Campos semánticos","Organizar información"
      ]
    },
    "Pensamiento Crítico": {
      "Investigación": [
        "Detectar noticias falsas","Identificar dato erróneo",
        "Aprender con base a problemas","Investigar y contrastar en Internet"
      ],
      "Comprensión": [
        "Análisis gramatical","Organizar información"
      ]
    },
    "Comprensión del Problema": {
      "Resolución": [
        "Reconocer obj. problema","Relacionar datos y enunciados",
        "Discriminar datos","Interpretar datos","Responder problemas"
      ]
    },
    "Planificación Estratégica": {
      "Resolución": [
        "Estrategia resolución problemas","Predicciones y conjeturas"
      ],
      "Funciones ejecutivas": [
        "Planificación","Razonamiento en resolución de problemas"
      ],
      "Pensamiento computacional": [
        "Estrategia y planificación","Formulación de hipótesis"
      ]
    },
    "Ejecución de Procedimientos": {
      "Resolución": [
        "Cálculo mental","Cálculo numérico","Realizar operaciones problemas",
        "Operatoria","Entender operaciones"
      ],
      "Pensamiento computacional": [
        "Realización de algoritmos"
      ]
    },
    "Verificación de Respuestas": {
      "Resolución": [
        "Comprobar resultados problemas","Pensamiento comprensivo"
      ],
      "Funciones ejecutivas": [
        "Control inhibitorio","Memoria de trabajo",
        "Razonamiento en resolución de problemas"
      ]
    }
  }
};
