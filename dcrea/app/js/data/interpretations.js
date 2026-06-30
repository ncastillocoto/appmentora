/**
 * D-CREA — Destrezas de Comprensión y Resolución Avanzadas
 * Grupo Mentora
 *
 * interpretations.js
 * Contenido pedagógico: etiquetas de dimensiones, textos de interpretación por nivel,
 * plantillas de resumen ejecutivo y plantillas de perfil cognitivo.
 *
 * Marcos de referencia:
 *  - Comprensión Lectora: Isabel Solé (estrategias de lectura), Daniel Cassany (literacidad crítica).
 *  - Resolución de Problemas: George Polya (heurística de 4 fases), Alan Schoenfeld (metacognición y autorregulación).
 *
 * Sin módulos ES: solo constantes globales para uso con <script>.
 */

/* ------------------------------------------------------------------ */
/* Etiquetas legibles de cada dimensión                                */
/* ------------------------------------------------------------------ */
const DIMENSION_LABELS = {
  Literal: "Comprensión Literal",
  Inferencial: "Comprensión Inferencial",
  Critica: "Pensamiento Crítico",          // clave normalizada sin tilde
  Comprender: "Comprensión del Problema",
  Pensar: "Planificación Estratégica",
  Ejecutar: "Ejecución de Procedimientos",
  Responder: "Verificación de Respuestas"
};

const COMPRENSION_DIMS = ["Literal", "Inferencial", "Critica"];
const RESOLUCION_DIMS = ["Comprender", "Pensar", "Ejecutar", "Responder"];

/* ------------------------------------------------------------------ */
/* Interpretaciones: 7 dimensiones × 4 niveles = 28 textos             */
/* Tercera persona, descriptivo del desempeño observado (no normativo) */
/* ------------------------------------------------------------------ */
const INTERPRETATIONS = {

  /* ---------- COMPRENSIÓN LECTORA ---------- */

  Literal: {
    Inicial:
      "Localiza información explícita de manera intermitente y suele omitir datos relevantes presentes en el texto. Confunde detalles secundarios con la idea principal y necesita relecturas frecuentes para ubicar lo solicitado. Depende del acompañamiento del adulto para reconocer qué información responde a cada pregunta.",
    "En desarrollo":
      "Identifica información explícita con cierta dificultad, reconociendo algunos datos concretos aunque puede omitir detalles importantes. Recupera con mayor seguridad la información que aparece al inicio del texto que la situada en párrafos extensos. Requiere acompañamiento para organizar la información encontrada y distinguir lo principal de lo accesorio.",
    Avanzado:
      "Reconoce con solvencia la información explícita del texto, ubicando datos, nombres y secuencias con precisión la mayoría de las veces. Distingue de forma consistente las ideas principales de los detalles de apoyo. Organiza lo leído de manera autónoma y solo ocasionalmente necesita verificar datos en textos densos.",
    Excelente:
      "Localiza la totalidad de la información explícita con rapidez y exactitud, incluso en textos extensos o con datos dispersos. Jerarquiza con claridad ideas principales y secundarias, y recupera detalles puntuales sin esfuerzo aparente. La lectura literal es una base sólida y consolidada de su perfil comprensivo."
  },

  Inferencial: {
    Inicial:
      "Permanece anclado a la información literal y rara vez deduce datos que el texto no expresa de forma directa. Le cuesta establecer relaciones de causa-efecto o anticipar lo que ocurrirá a continuación. Tiende a responder lo que 'dice el texto' sin completar los significados implícitos.",
    "En desarrollo":
      "Realiza inferencias sencillas cuando el texto ofrece pistas evidentes, pero pierde precisión ante implícitos más sutiles. Establece algunas relaciones de causa-efecto y deduce el significado de palabras por contexto con apoyo. Aún confunde, en ocasiones, lo que infiere con lo que el texto afirma literalmente.",
    Avanzado:
      "Infiere con seguridad información implícita, deduciendo intenciones, causas y consecuencias a partir de las pistas del texto. Conecta ideas distantes y anticipa el desarrollo de la lectura con buen criterio. Reconstruye el significado global integrando lo dicho y lo sugerido de manera autónoma.",
    Excelente:
      "Construye inferencias complejas y bien sustentadas, integrando pistas dispersas para reconstruir significados profundos del texto. Detecta intenciones del autor, dobles sentidos y relaciones implícitas con notable agudeza. La lectura entre líneas es una fortaleza destacada que sostiene una comprensión global rica y matizada."
  },

  Critica: {
    Inicial:
      "Acepta el contenido del texto sin cuestionarlo y le resulta difícil emitir una opinión propia fundamentada. Rara vez relaciona lo leído con sus experiencias o con otros conocimientos. Suele repetir lo que el texto plantea sin valorar su intención, su validez o sus alcances.",
    "En desarrollo":
      "Comienza a emitir juicios sobre el texto, aunque sus valoraciones se apoyan más en gustos personales que en argumentos. Relaciona la lectura con sus experiencias de forma puntual y con acompañamiento. Identifica la postura del autor en casos evidentes, pero aún le cuesta sustentar su propia opinión.",
    Avanzado:
      "Valora el texto con criterio, distinguiendo hechos de opiniones y reconociendo la intención del autor. Relaciona lo leído con sus conocimientos y experiencias para construir una opinión propia argumentada. Cuestiona ideas y transfiere lo comprendido a situaciones nuevas con autonomía.",
    Excelente:
      "Demuestra pensamiento crítico avanzado, relacionando eficazmente el contenido con sus experiencias y construyendo una opinión propia bien fundamentada. Evalúa la fiabilidad de las fuentes, detecta sesgos y contrasta perspectivas con solvencia. Tiene una perspectiva analítica destacada que transfiere con naturalidad a nuevos contextos."
  },

  /* ---------- RESOLUCIÓN DE PROBLEMAS ---------- */

  Comprender: {
    Inicial:
      "Presenta dificultad para comprender el objetivo del problema y los datos que ofrece el enunciado. Comienza a operar antes de entender qué se le pide y confunde datos relevantes con información accesoria. Necesita que se le reformule el problema para identificar la incógnita.",
    "En desarrollo":
      "Comprende el sentido general del problema, aunque puede pasar por alto datos o condiciones importantes del enunciado. Identifica la incógnita en problemas familiares, pero se desorienta cuando la información se presenta de forma indirecta. Reconoce los datos con mayor claridad cuando recibe apoyo para releer y reformular.",
    Avanzado:
      "Comprende con claridad el objetivo del problema e identifica de manera precisa los datos relevantes. Distingue la información necesaria de la accesoria y reconoce las condiciones del enunciado. Reformula el problema con sus propias palabras antes de resolverlo, lo que orienta acertadamente su estrategia.",
    Excelente:
      "Interpreta con total precisión el objetivo del problema, incluso cuando los datos están implícitos o aparecen en formatos diversos. Detecta condiciones, restricciones y relaciones entre datos con gran finura. Esta comprensión profunda del enunciado es una fortaleza que asegura el éxito de las fases posteriores."
  },

  Pensar: {
    Inicial:
      "Presenta dificultad para diseñar estrategias de resolución. Tiende a proceder de manera intuitiva sin planificar los pasos a seguir, lo que limita la efectividad en la resolución. Aborda los problemas por ensayo y error sin anticipar un camino de solución.",
    "En desarrollo":
      "Esboza un plan de resolución en problemas conocidos, pero le cuesta anticipar los pasos en situaciones nuevas. Recurre a estrategias aprendidas de memoria y se bloquea cuando estas no se ajustan al problema. Comienza a planificar con apoyo, aunque aún no evalúa rutas alternativas de solución.",
    Avanzado:
      "Diseña estrategias pertinentes antes de operar, seleccionando procedimientos adecuados al tipo de problema. Descompone la tarea en pasos ordenados y anticipa el camino hacia la solución. Ajusta su plan cuando encuentra obstáculos y considera más de una vía de resolución.",
    Excelente:
      "Planifica con flexibilidad y sofisticación, eligiendo entre varias estrategias la más eficiente para cada problema. Anticipa dificultades, organiza los pasos con criterio y transfiere heurísticas conocidas a contextos novedosos. La planificación estratégica es una fortaleza sobresaliente de su perfil de resolución."
  },

  Ejecutar: {
    Inicial:
      "Comete errores frecuentes al ejecutar procedimientos y operaciones, incluso cuando ha comprendido el problema. Pierde el hilo de los pasos a mitad del proceso y aplica las técnicas con poca precisión. Necesita supervisión constante para llevar a cabo los cálculos sin equivocarse.",
    "En desarrollo":
      "Ejecuta los procedimientos con resultados desiguales, alternando aciertos con errores de cálculo o de aplicación. Sigue secuencias de pasos conocidas, pero se equivoca cuando estas se vuelven más largas o complejas. Mejora su precisión cuando trabaja con calma y revisa cada paso con apoyo.",
    Avanzado:
      "Ejecuta los procedimientos con orden y precisión, obteniendo resultados correctos en la mayoría de los casos. Aplica las operaciones con seguridad y mantiene el control de la secuencia de pasos. Comete errores aislados que suele detectar y corregir por sí mismo.",
    Excelente:
      "Demuestra dominio en la ejecución de procedimientos y operaciones, obteniendo resultados precisos de manera consistente. Aplica las técnicas con fluidez, rapidez y sin perder el control de la secuencia. La fase de ejecución es una fortaleza destacada en su perfil de resolución."
  },

  Responder: {
    Inicial:
      "Concluye los problemas sin verificar si su respuesta es coherente con lo que se preguntaba. No contrasta el resultado con los datos del enunciado y rara vez detecta sus propios errores. Da por terminada la tarea apenas obtiene un número, aunque no tenga sentido en el contexto.",
    "En desarrollo":
      "Revisa la respuesta de forma superficial y solo detecta los errores más evidentes. Comprueba el resultado cuando se le solicita, pero no ha incorporado la verificación como un hábito propio. A veces ofrece respuestas desconectadas de la pregunta original por falta de un cierre reflexivo.",
    Avanzado:
      "Verifica la coherencia de su respuesta con la pregunta planteada y con los datos del problema. Repasa los pasos para confirmar el resultado y detecta la mayoría de sus errores. Expresa la respuesta de forma clara y ajustada a lo que se solicitaba.",
    Excelente:
      "Verifica de forma sistemática la validez y la coherencia de cada respuesta, contrastándola con el enunciado y estimando su razonabilidad. Detecta y corrige errores con autonomía y comunica el resultado con precisión y sentido. La autorregulación y el control del proceso son una fortaleza consolidada."
  }
};

/* ------------------------------------------------------------------ */
/* Plantillas del resumen ejecutivo                                    */
/* 4 niveles de comprensión × 4 niveles de resolución = 16 combinaciones*/
/* Patrón de clave: "comprension_nivel__resolucion_nivel"              */
/* Variables disponibles: {nombre}, {areaFortaleza}, {scoreFortaleza}, */
/*                         {areaOportunidad}                            */
/* ------------------------------------------------------------------ */
const RESUMEN_TEMPLATES = {
  "Inicial__Inicial":
    "{nombre} se encuentra en una etapa inicial tanto en comprensión lectora como en resolución de problemas, lo que abre una valiosa oportunidad de acompañamiento temprano. Su desempeño más sostenido aparece en {areaFortaleza} ({scoreFortaleza}%), área desde la cual conviene apuntalar el resto. El foco prioritario está en {areaOportunidad}, donde un trabajo guiado y constante producirá avances significativos.",
  "Inicial__En desarrollo":
    "{nombre} muestra una resolución de problemas en desarrollo que contrasta con una comprensión lectora todavía inicial. Destaca en {areaFortaleza} ({scoreFortaleza}%), un punto de apoyo para fortalecer la lectura comprensiva. Resulta clave atender {areaOportunidad}, ya que una mejor comprensión del texto potenciará también su razonamiento.",
  "Inicial__Avanzado":
    "{nombre} resuelve problemas con un nivel avanzado, mientras que su comprensión lectora se mantiene en una fase inicial. Su fortaleza en {areaFortaleza} ({scoreFortaleza}%) revela un buen potencial de razonamiento que conviene transferir a la lectura. Trabajar {areaOportunidad} permitirá que la comprensión del texto acompañe a su capacidad de resolución.",
  "Inicial__Excelente":
    "{nombre} alcanza un desempeño excelente en resolución de problemas que convive con una comprensión lectora aún inicial. Sobresale en {areaFortaleza} ({scoreFortaleza}%), lo que confirma un razonamiento sólido pese a las dificultades con el texto. Priorizar {areaOportunidad} cerrará la brecha y equilibrará un perfil con gran proyección.",

  "En desarrollo__Inicial":
    "{nombre} avanza en comprensión lectora mientras su resolución de problemas se encuentra en una etapa inicial. Su mejor desempeño se observa en {areaFortaleza} ({scoreFortaleza}%), una base útil para abordar el razonamiento. El acompañamiento debe concentrarse en {areaOportunidad}, donde se concentran las mayores oportunidades de crecimiento.",
  "En desarrollo__En desarrollo":
    "{nombre} presenta un perfil en desarrollo y equilibrado entre la comprensión lectora y la resolución de problemas. Su fortaleza relativa en {areaFortaleza} ({scoreFortaleza}%) ofrece un punto de partida sólido para seguir progresando. El trabajo en {areaOportunidad} consolidará habilidades que ya están en franca evolución.",
  "En desarrollo__Avanzado":
    "{nombre} resuelve problemas con un nivel avanzado y muestra una comprensión lectora en desarrollo. Destaca particularmente en {areaFortaleza} ({scoreFortaleza}%), capacidad que sostiene su buen razonamiento. Reforzar {areaOportunidad} permitirá que la comprensión del texto alcance el mismo nivel que la resolución.",
  "En desarrollo__Excelente":
    "{nombre} exhibe una resolución de problemas excelente junto a una comprensión lectora en desarrollo. Su dominio en {areaFortaleza} ({scoreFortaleza}%) es un sello distintivo de su perfil cognitivo. Atender {areaOportunidad} ayudará a que la lectura comprensiva acompañe a su notable capacidad de razonamiento.",

  "Avanzado__Inicial":
    "{nombre} comprende los textos con un nivel avanzado, mientras su resolución de problemas se mantiene en una fase inicial. Su fortaleza en {areaFortaleza} ({scoreFortaleza}%) es un recurso valioso para abordar el razonamiento matemático. El foco prioritario está en {areaOportunidad}, donde un trabajo estructurado producirá avances claros.",
  "Avanzado__En desarrollo":
    "{nombre} muestra una comprensión lectora avanzada y una resolución de problemas en desarrollo. Sobresale en {areaFortaleza} ({scoreFortaleza}%), capacidad que puede transferir a la fase de razonamiento. Fortalecer {areaOportunidad} ayudará a equilibrar un perfil que ya presenta logros destacados.",
  "Avanzado__Avanzado":
    "{nombre} presenta un perfil avanzado y armónico entre la comprensión lectora y la resolución de problemas. Su fortaleza en {areaFortaleza} ({scoreFortaleza}%) confirma un desempeño sólido en ambas áreas. Pulir {areaOportunidad} le permitirá dar el salto hacia un nivel de excelencia.",
  "Avanzado__Excelente":
    "{nombre} combina una comprensión lectora avanzada con una resolución de problemas excelente, lo que perfila un desempeño muy sólido. Brilla especialmente en {areaFortaleza} ({scoreFortaleza}%), una de sus mayores fortalezas. Afinar {areaOportunidad} consolidará un perfil con proyección sobresaliente.",

  "Excelente__Inicial":
    "{nombre} comprende los textos con un nivel excelente, mientras su resolución de problemas se encuentra en una etapa inicial. Su dominio en {areaFortaleza} ({scoreFortaleza}%) demuestra un gran potencial que conviene trasladar al razonamiento. El acompañamiento debe centrarse en {areaOportunidad} para equilibrar un perfil con marcada asimetría.",
  "Excelente__En desarrollo":
    "{nombre} alcanza una comprensión lectora excelente junto a una resolución de problemas en desarrollo. Su fortaleza en {areaFortaleza} ({scoreFortaleza}%) es un recurso poderoso para impulsar el razonamiento. Trabajar {areaOportunidad} permitirá que la resolución acompañe a su sobresaliente comprensión de los textos.",
  "Excelente__Avanzado":
    "{nombre} combina una comprensión lectora excelente con una resolución de problemas avanzada, lo que evidencia un perfil muy completo. Destaca de forma notable en {areaFortaleza} ({scoreFortaleza}%). Refinar {areaOportunidad} lo acercará a un desempeño excelente en todas las dimensiones evaluadas.",
  "Excelente__Excelente":
    "{nombre} muestra un desempeño excelente y equilibrado tanto en comprensión lectora como en resolución de problemas. Su dominio en {areaFortaleza} ({scoreFortaleza}%) corona un perfil cognitivo sólido y armónico. El reto ahora es sostener este nivel mediante desafíos de mayor complejidad que sigan estimulando {areaOportunidad}."
};

/* ------------------------------------------------------------------ */
/* Plantillas del perfil cognitivo (cierre de la página 3)             */
/* 2 a 4 oraciones que explican el patrón cognitivo observado          */
/* Variable disponible: {nombre}                                       */
/* ------------------------------------------------------------------ */
const PERFIL_COGNITIVO_TEMPLATES = {
  alta_comprension_baja_resolucion:
    "El perfil de {nombre} revela una fortaleza clara en la comprensión de la información, que aún no logra traducir plenamente en la resolución de problemas. Comprende lo que lee y lo que se le plantea, pero encuentra obstáculos al planificar o ejecutar una solución estructurada. Este patrón sugiere que el reto no está en entender, sino en sistematizar el razonamiento. Un trabajo centrado en estrategias de resolución paso a paso permitirá que su buena comprensión se convierta en desempeño efectivo.",
  baja_comprension_alta_resolucion:
    "{nombre} muestra un razonamiento ágil y procedimientos sólidos, pero su comprensión de los textos y enunciados todavía limita su rendimiento. Resuelve bien cuando entiende qué se le pide, de modo que sus errores suelen originarse en la lectura más que en el cálculo. Este patrón indica que fortalecer la comprensión lectora liberará todo su potencial de resolución. Conviene insistir en la interpretación atenta del enunciado antes de operar.",
  alto_literal_bajo_inferencial:
    "{nombre} recupera con facilidad la información explícita del texto, pero le cuesta leer entre líneas e inferir lo que no se dice de forma directa. Domina el 'qué dice el texto' y necesita avanzar hacia el 'qué quiere decir'. Este patrón es habitual y muy abordable: el lector literal posee una base sólida sobre la cual construir la inferencia. Actividades de predicción, deducción y preguntas implícitas impulsarán este salto cualitativo.",
  alta_critica_baja_planificacion:
    "{nombre} despliega un pensamiento crítico notable, capaz de valorar, opinar y transferir ideas, mientras que la planificación de soluciones aún representa un desafío. Piensa con profundidad sobre los textos, pero le cuesta organizar de forma metódica los pasos para resolver un problema. Este contraste sugiere canalizar su capacidad analítica hacia la estructuración del razonamiento. Métodos como el de Polya darán forma ordenada a su evidente potencial reflexivo.",
  equilibrado_alto:
    "El perfil de {nombre} es equilibrado y de alto rendimiento: comprende, razona, ejecuta y verifica con solvencia en ambas áreas evaluadas. Esta armonía cognitiva constituye una base excelente para enfrentar aprendizajes de mayor complejidad. El desafío pedagógico ya no es nivelar, sino estimular con tareas retadoras que sostengan su motivación. Proyectos abiertos y problemas no rutinarios serán el mejor alimento para su desarrollo.",
  equilibrado_bajo:
    "{nombre} presenta un perfil equilibrado en una fase inicial de desarrollo, con oportunidades de crecimiento repartidas de forma pareja entre la comprensión y la resolución. La buena noticia es que no existen brechas marcadas, lo que permite un acompañamiento integral y sin urgencias aisladas. Un plan de trabajo constante, gradual y motivador producirá avances visibles en todas las dimensiones. La regularidad será más decisiva que la intensidad.",
  alto_ejecutar_bajo_pensar:
    "{nombre} ejecuta los procedimientos con destreza, pero tiende a operar antes de planificar, lo que lo lleva a actuar de forma intuitiva. Sabe 'cómo hacer', aunque aún debe afianzar el 'qué hacer primero' y por qué. Este patrón indica un buen dominio técnico que conviene encauzar con una etapa previa de diseño de estrategia. Detenerse a planificar antes de calcular multiplicará la eficacia de su evidente habilidad operativa.",
  bajo_comprension_bajo_resolucion:
    "{nombre} se encuentra en una etapa inicial de desarrollo en ambas áreas, lo que define un punto de partida claro para un acompañamiento estructurado. Las dificultades observadas son propias de un proceso en construcción y responden muy bien a la intervención temprana y sostenida. Conviene priorizar primero la comprensión, ya que es la base sobre la que se asientan tanto la lectura crítica como la resolución de problemas. Con apoyo guiado y constante, los avances no tardarán en hacerse visibles.",
  default:
    "El perfil de {nombre} combina fortalezas y áreas de oportunidad que conviene atender de manera articulada. Cada dimensión evaluada aporta información valiosa para orientar un acompañamiento personalizado y progresivo. Apoyarse en lo que ya domina para impulsar lo que aún está en desarrollo será la estrategia más efectiva. El seguimiento continuo permitirá ajustar el plan y consolidar los aprendizajes de forma sostenida."
};
