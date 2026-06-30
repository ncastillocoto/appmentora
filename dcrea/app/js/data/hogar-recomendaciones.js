/**
 * D-CREA — Destrezas de Comprensión y Resolución
 * Grupo Mentora
 *
 * hogar-recomendaciones.js
 * Banco personalizado de recomendaciones para el hogar.
 * Organizado por dimensión → nivel → [principal, secundaria1, secundaria2]
 *
 * Principios pedagógicos aplicados:
 *  - Comprensión lectora: Solé (2009), Cassany (2006) — lectura como proceso activo
 *  - Resolución de problemas: Polya (1945), Schoenfeld (1992) — heurística y metacognición
 *  - Implicación familiar: Epstein (2002) — actividades concretas y cálidas para el hogar
 *  - Calibración por nivel: Vygotsky (ZDP) — andamiaje en Inicial, autonomía en Excelente
 *
 * Reglas de presentación:
 *  - Inicial / En desarrollo → mostrar las 3 recomendaciones
 *  - Avanzado              → mostrar principal + 1 secundaria
 *  - Excelente             → mostrar solo la principal
 *  - Máximo 3 dimensiones (las de menor score primero)
 *  - Si todas ≥ 70 (Avanzado o Excelente) → bloque de fortaleza + enriquecimiento general
 *
 * Sin módulos ES — variables globales para uso con <script>.
 */

/* ------------------------------------------------------------------ */
/* BANCO DE RECOMENDACIONES                                            */
/* Estructura: [principal, secundaria1, secundaria2]                   */
/* Extensión: 25-50 palabras por ítem, lenguaje para familias.         */
/* ------------------------------------------------------------------ */
window.HOGAR_RECOMENDACIONES = {

  /* ======================================================
     COMPRENSIÓN LECTORA
     ====================================================== */

  "Comprensión Literal": {
    "Inicial": [
      "Lean juntos un párrafo corto y, al terminarlo, cierren el libro. Pregúntenle qué recuerda. Si olvida algo, búsquenlo juntos señalando el texto. Repetir esta rutina a diario entrena la memoria de lectura y enseña que las respuestas viven dentro del texto.",
      "Mientras leen en voz alta, señalen con el dedo cada dato importante —un nombre, un número, un lugar— y digan: '¿Lo ves? Aquí dice que...'. Señalar físicamente enseña a su hijo que la información tiene una ubicación exacta en el texto.",
      "Después de leer, dibujen juntos lo que dice el texto: quién aparece, dónde ocurre, qué pasó. Convertir las palabras en imagen ayuda a recordar los datos literales sin presión y hace la lectura más memorable y concreta."
    ],
    "En desarrollo": [
      "Elijan una noticia o cuento corto. Lean un párrafo y luego pregunten: '¿Dónde dice eso exactamente? Señálalo.' Practiquen siempre buscar la respuesta en el texto antes de contestar de memoria. Este hábito afina la lectura atenta de forma progresiva.",
      "Jueguen a '¿Verdad o invento?': después de leer, digan una frase sobre el texto —verdadera o inventada— y su hijo debe comprobarlo en la página. Diez turnos al día desarrollan la búsqueda precisa de información y la lectura verificadora.",
      "Tras leer un texto breve, pídanle que anote tres datos que recuerde. Luego busquen juntos dónde estaba cada dato en el texto. Confirmar que los datos existen realmente refuerza el hábito de leer con atención y precisión verificable."
    ],
    "Avanzado": [
      "Después de leer, pídanle que construya de memoria un esquema o lista con los datos más relevantes. Luego compárenlo con el texto. Esta síntesis activa fortalece la jerarquización de la información y prepara para lecturas más densas y complejas.",
      "Propónganle comparar dos textos cortos sobre el mismo tema —una noticia y un artículo— y listar los datos que comparten. Cotejar fuentes afina la localización de información literal y abre la puerta al pensamiento crítico sobre distintas fuentes.",
      "Propongan leer un texto y hacerle preguntas sobre detalles en distintos párrafos. Localizar información no contigua exige un nivel superior de lectura atenta y prepara para los textos académicos y científicos más exigentes que enfrentará en el futuro."
    ],
    "Excelente": [
      "Invítenle a crear un 'mini examen' sobre un texto que le guste: que escriba cinco preguntas cuya respuesta esté explícitamente en el texto. Diseñar preguntas es más exigente que responderlas y demuestra el más alto dominio de la comprensión literal.",
      "Pídanle que lea un artículo de su interés y prepare una presentación oral breve con los datos más relevantes, indicando dónde los encontró. Organizar y citar información literal es el nivel más alto del dominio lector que puede practicarse en casa.",
      "Propónganle leer un texto en tiempo limitado y luego responder preguntas de detalle sin volver a consultarlo. El procesamiento rápido y preciso de información literal es la destreza que distingue a los lectores expertos y seguros en contextos académicos."
    ]
  },

  "Comprensión Inferencial": {
    "Inicial": [
      "Antes de leer, miren juntos el título y las ilustraciones y pregunten: '¿De qué crees que trata? ¿Qué va a pasar?' Al terminar, comparen sus predicciones con lo que realmente ocurrió. Esta rutina activa el pensamiento inferencial desde el primer momento.",
      "Mientras leen, hagan pausas y pregunten: '¿Por qué crees que ese personaje hizo eso?' No hay respuesta incorrecta; lo importante es que su hijo busque razones en el texto. Razonar el 'por qué' es el primer paso de la inferencia lectora.",
      "Al terminar una lectura, pregunten: '¿Cómo crees que se siente el personaje aquí, y por qué?' Ayúdenle a conectar las pistas del texto con lo que él ha vivido. Relacionar emociones y claves textuales inicia el camino inferencial de manera natural."
    ],
    "En desarrollo": [
      "Después de leer un párrafo, pregunten: 'Aquí no lo dice directamente, ¿pero qué crees que quiso decir el autor?' Pídanle que señale la parte del texto que le dio la pista. Unir pistas con conclusiones es el núcleo de la inferencia.",
      "Lean juntos un cuento con final abierto o un pasaje que no lo explica todo. Pídanle que complete lo que 'falta' usando la lógica del texto y lo que ya saben. Completar lo implícito activa el razonamiento inferencial de forma entretenida y natural.",
      "Lean el título y el primer párrafo de una noticia y pídanle que prediga qué vendrá después, con una razón. Al terminar de leer, verifiquen juntos. Confirmar y corregir predicciones genera conciencia sobre cómo el texto adelanta información de forma implícita."
    ],
    "Avanzado": [
      "Después de leer, pregunten: '¿Cuál es el mensaje principal que quería transmitir el autor?' Pídanle que lo exprese en una oración y que señale tres partes del texto que lo demuestren. Identificar la idea central implícita consolida la inferencia temática avanzada.",
      "Propongan subrayar en el texto lo que el autor no dice pero 'da a entender'. Luego conversen: ¿qué información necesitaron para llegar a esa conclusión? Hacer visible el proceso inferencial propio profundiza la conciencia y el control sobre la lectura.",
      "Busquen un texto con un título ambiguo o metafórico y pregunten: '¿Por qué crees que el autor eligió este título? ¿Qué quería sugerir?' Analizar el título como pista inferencial es un ejercicio sofisticado que revela y potencia la habilidad lectora."
    ],
    "Excelente": [
      "Propónganle leer dos textos cortos sobre el mismo tema con perspectivas distintas. Que identifique qué información está implícita en cada uno y qué puede concluir comparando ambos. Inferir a través de múltiples fuentes es la habilidad lectora más sofisticada que existe.",
      "Propónganle leer un poema o texto con lenguaje figurado y explicar qué quiso decir el autor más allá de las palabras literales. Interpretar el lenguaje figurado es la forma más elaborada y creativa de la inferencia lectora que se puede practicar.",
      "Invítenle a escribir un párrafo que tenga un doble significado —uno literal y uno implícito— y a compartirlo con la familia. Crear texto inferencial propio demuestra el dominio más alto de esta habilidad y resulta una actividad creativa y genuinamente desafiante."
    ]
  },

  "Pensamiento Crítico": {
    "Inicial": [
      "Después de leer un cuento corto, pregunten: '¿Qué parte te gustó más? ¿Por qué?' Exijan siempre el 'porque': no basta decir 'me gustó', necesita dar una razón concreta. Opinar con argumento es el primer escalón del pensamiento crítico en lectura.",
      "Al terminar una lectura, pregunten: '¿Estás de acuerdo con lo que hizo el personaje? ¿Qué habrías hecho tú?' Evaluar decisiones ajenas con criterio propio activa la capacidad de analizar y opinar con fundamento sobre lo que se lee en casa.",
      "Conversen en familia sobre algo que hayan leído juntos: una noticia, un cuento, un artículo corto. Pídanle que dé su opinión y la defienda con un argumento. Las conversaciones cotidianas con preguntas abiertas son el mejor entrenamiento crítico disponible en el hogar."
    ],
    "En desarrollo": [
      "Lean una noticia o artículo breve. Pídanle que separe en dos columnas: 'Lo que dice el texto' y 'Lo que yo opino'. Aprender a distinguir hechos de opiniones propias es la base del pensamiento crítico y una herramienta de vida esencial.",
      "Elijan un personaje de un cuento que haya tomado una decisión importante. Pregunten: '¿Por qué crees que actuó así? ¿Estuvo bien o mal? ¿Por qué?' Evaluar decisiones con argumentos concretos desarrolla el juicio crítico de forma entretenida y completamente natural.",
      "Lean juntos un texto y busquen palabras que revelan la opinión del autor: 'desafortunadamente', 'evidentemente', 'el mejor'. Identificar lenguaje valorativo enseña a leer entre líneas y a no aceptar todo lo escrito como un hecho neutral y completamente objetivo."
    ],
    "Avanzado": [
      "Después de leer, pregunten: '¿Por qué crees que el autor escribió esto? ¿A quién va dirigido? ¿Qué quería lograr?' Analizar la intención del autor transforma a su hijo de lector pasivo en lector activo, crítico y consciente de los mensajes que recibe.",
      "Busquen dos noticias sobre el mismo hecho en fuentes distintas. Léanlas juntos y conversen: '¿En qué coinciden? ¿En qué difieren? ¿Por qué crees que es así?' Comparar perspectivas sobre un mismo hecho es la práctica más poderosa del pensamiento crítico.",
      "Lean juntos una publicidad, un cartel o un anuncio y pregunten: '¿Qué quiere que pensemos? ¿Qué no te dice? ¿Te parece honesto?' Analizar mensajes del entorno cotidiano con ojo crítico aplica el pensamiento crítico a situaciones de la vida real inmediata."
    ],
    "Excelente": [
      "Propónganle elegir un tema sobre el que haya leído y escribir un párrafo defendiendo una postura y otro párrafo defendiendo la contraria, con argumentos sólidos para cada una. Quien argumenta ambos lados ha alcanzado el dominio más alto del pensamiento crítico.",
      "Propongan leer una columna de opinión en un periódico y que evalúe la solidez de los argumentos del autor: ¿son convincentes? ¿Qué les falta? ¿Qué agregaría? Evaluar la calidad argumentativa de otros es la habilidad crítica más alta y más exigente.",
      "Conversen sobre un dilema ético relacionado con algo que hayan leído: '¿Estuvo bien? ¿Qué habrías hecho tú y por qué?' Los dilemas éticos fundamentados en textos son el ejercicio definitivo del pensamiento crítico profundo que se puede hacer en familia."
    ]
  },

  /* ======================================================
     RESOLUCIÓN DE PROBLEMAS
     ====================================================== */

  "Comprensión del Problema": {
    "Inicial": [
      "Cuando su hijo enfrente un problema matemático, léanlo juntos despacio y pídanle que lo dibuje: los datos como figuras y la pregunta como un signo de interrogación. Dibujar transforma palabras en imagen y aclara qué se pide antes de intentar calcular.",
      "Antes de calcular, practiquen subrayar con colores: amarillo para los datos y verde para la pregunta. Este sencillo hábito visual ayuda a separar 'lo que ya sé' de 'lo que busco' y reduce la confusión inicial al enfrentar los problemas.",
      "Inventen juntos problemas matemáticos sencillos sobre la vida diaria: compras, recetas, distancias. Crear problemas fáciles entrena para identificar qué son datos y qué es pregunta, habilidades que se necesitan cuando los problemas reales se vuelven más complejos y exigentes."
    ],
    "En desarrollo": [
      "Antes de resolver cualquier problema, establezcan este ritual: leerlo dos veces, subrayar los datos y encerrar en círculo la pregunta. Luego su hijo explica con sus propias palabras qué pide el problema. Solo entonces pueden empezar a calcular juntos.",
      "Pídanle que 'reescriba el problema' con sus propias palabras, como si se lo explicara a un amigo más pequeño. Si puede explicarlo con simplicidad, lo entendió de verdad. La explicación oral es la prueba más honesta de comprensión genuina del enunciado.",
      "Ante cualquier problema, practiquen estas preguntas juntos: '¿Qué información tenemos? ¿Qué nos falta? ¿Qué no necesitamos?' Separar los datos útiles de la información innecesaria es una habilidad clave que se desarrolla con práctica deliberada y constante en casa."
    ],
    "Avanzado": [
      "Antes de resolver, pídanle que represente el problema en un esquema: flechas, tablas o una recta numérica. Elegir la representación adecuada demuestra comprensión profunda del enunciado y facilita encontrar el camino correcto de solución de forma mucho más autónoma.",
      "Preséntenle problemas que incluyen datos innecesarios mezclados entre los útiles. Que identifique cuáles necesita y cuáles sobran antes de resolver. Filtrar información relevante es una habilidad avanzada que prepara para los problemas auténticos del mundo real cotidiano.",
      "Propongan un problema de contexto real: calcular el costo de una excursión familiar, organizar un horario o medir algo en casa. Los problemas auténticos exigen una comprensión más cuidadosa del enunciado que los ejercicios de libro y resultan mucho más motivadores."
    ],
    "Excelente": [
      "Invítenle a inventar problemas matemáticos de dos o más pasos: que diseñe el enunciado, los datos, la información innecesaria y la pregunta. Crear problemas complejos exige dominar profundamente su estructura y es el mayor desafío para este nivel de comprensión.",
      "Pídanle que reformule un problema de libro en un contexto real que le resulte familiar: su deporte favorito, su videojuego preferido. Trasladar la estructura de un problema a un contexto propio demuestra dominio profundo y aumenta la motivación para resolverlos.",
      "Propónganle el desafío de resolver un problema con los datos mínimos necesarios: eliminen juntos toda información extra antes de empezar. Trabajar con la esencia pura del enunciado es el ejercicio más avanzado de comprensión del problema matemático."
    ]
  },

  "Planificación Estratégica": {
    "Inicial": [
      "Cuando su hijo no sepa cómo empezar un problema, piensen juntos en voz alta: '¿Qué hacemos primero? ¿Y después?' No le den la respuesta: guíenle con preguntas. Modelar el razonamiento estratégico en voz alta es la forma más efectiva de enseñarlo.",
      "Jueguen juntos al dominó, las damas o cualquier juego sencillo que requiera pensar movimientos. Al terminar, conversen: '¿Qué estrategia usaste? ¿Funcionó? ¿Qué cambiarías?' Los juegos son laboratorios de planificación sin la presión ni el estrés de la calificación escolar.",
      "Antes de resolver cualquier problema, practiquen listar dos posibles caminos, aunque sean sencillos. El hábito de preguntarse '¿cómo podría hacerlo?' antes de actuar es el núcleo de la planificación estratégica que se construye desde temprana edad con práctica regular."
    ],
    "En desarrollo": [
      "Preséntenle dos caminos posibles para resolver un mismo problema y pregunten: '¿Cuál elegirías tú y por qué?' No importa cuál elija; lo importante es que justifique su elección con una razón clara. Elegir con razones es el corazón de la planificación consciente.",
      "Después de resolver un problema, pregunten: '¿Había otra forma de llegar al mismo resultado?' Busquen juntos ese camino alternativo. Saber que existen múltiples rutas hacia una respuesta desarrolla flexibilidad mental y autonomía matemática que perduran toda la vida.",
      "Propongan un acertijo o problema lógico semanal —pueden buscarlo en internet o inventarlo— y conversen sobre cómo atacarlo: ¿por dónde empezamos? ¿qué descartamos primero? Enfrentar problemas nuevos con regularidad amplía el repertorio de estrategias disponibles para su hijo."
    ],
    "Avanzado": [
      "Pídanle que resuelva el mismo problema por dos caminos distintos y explique cuál fue más eficiente y por qué. Comparar la efectividad de las propias estrategias desarrolla el pensamiento matemático reflexivo y la capacidad de elegir con autonomía e inteligencia.",
      "Propongan problemas que admitan estrategias visuales (dibujar, tablas), numéricas (cálculo directo) y lógicas (razonamiento por descarte). Que las pruebe todas. Un repertorio amplio de estrategias es la marca de un resolutor maduro y flexible ante problemas variados.",
      "Busquen o inventen un problema sin un procedimiento obvio y trabajen juntos para encontrar el camino. Los problemas no rutinarios exigen planificación creativa y son el entrenamiento más poderoso para la flexibilidad estratégica en el nivel avanzado."
    ],
    "Excelente": [
      "Invítenle a explicarle a un familiar más pequeño cómo resolvería un problema matemático, paso a paso y con sus propias palabras. Quien enseña bien una estrategia la domina profundamente. Enseñar consolida el conocimiento mejor que cualquier ejercicio escolar convencional.",
      "Propónganle diseñar un 'mapa de estrategias' para distintos tipos de problemas: ¿qué hace cuando hay una tabla? ¿Qué cuando hay patrones? Tener un repertorio organizado y consciente es la marca de un resolutor matemático experto y completamente autónomo.",
      "Invítenle a crear un problema difícil para que un adulto de la familia intente resolverlo, con una trampa incluida. Diseñar problemas con dificultad intencional exige conocer profundamente las estrategias y los errores comunes: un desafío de alto nivel cognitivo."
    ]
  },

  "Ejecución de Procedimientos": {
    "Inicial": [
      "Al hacer operaciones juntos, deténganse después de cada paso y verifiquen antes de continuar: '¿Está bien hasta aquí?' Trabajar despacio con revisión continua construye la exactitud procedimental que más adelante permitirá trabajar con velocidad y verdadera confianza matemática.",
      "Usen objetos concretos —monedas, frijoles, palitos— para hacer sumas, restas o multiplicaciones físicamente antes de escribirlas. Ver y manipular los números antes de anotarlos reduce los errores y consolida la comprensión de los procedimientos desde lo tangible y concreto.",
      "Practiquen las tablas de multiplicar cinco minutos al día con tarjetas, canciones o preguntas y respuestas. Automatizar los hechos matemáticos básicos libera memoria mental para concentrarse en los pasos más complejos sin cometer errores por simple distracción."
    ],
    "En desarrollo": [
      "Al resolver operaciones, pídanle que anote cada paso en papel sin saltarse ninguno. Revisen juntos cada paso antes de continuar. Hacer visible el proceso —no solo la respuesta final— reduce los errores y desarrolla el orden procedimental de manera duradera.",
      "Jueguen a la 'estimación antes de calcular': antes de operar, su hijo adivina el resultado aproximado. Luego calculan y comparan. Si la diferencia es grande, algo puede estar mal. Este hábito detecta errores graves y entrena el sentido numérico progresivamente.",
      "Preséntenle un problema ya resuelto —con errores plantados a propósito— y pídanle que encuentre el error y lo corrija. Detectar y corregir errores ajenos activa la atención procedimental con mayor intensidad que simplemente resolver ejercicios propios desde cero."
    ],
    "Avanzado": [
      "Invítenle a estimar el resultado antes de calcular y después a medir qué tan cerca estuvo su estimación. Hagan de esto un juego: quien más se acerque gana un punto. La estimación afinada revela dominio profundo del valor numérico y del procedimiento.",
      "Propongan un 'desafío de velocidad y precisión': cinco operaciones contra el reloj donde solo cuentan las que estén correctas. Combinar velocidad con exactitud es el sello del dominio procedimental avanzado y resulta altamente motivador para los estudiantes de este nivel.",
      "Jueguen a cálculo mental: operaciones de dos pasos resueltas sin papel. Desarrollar el cálculo mental no solo aumenta la velocidad sino que profundiza la comprensión de las relaciones numéricas y el funcionamiento de los procedimientos desde adentro."
    ],
    "Excelente": [
      "Pídanle que invente su propio 'manual de instrucciones' para resolver un tipo de operación: que escriba los pasos como si se los explicara a alguien que nunca los ha visto. Documentar un procedimiento con claridad es el nivel más alto del dominio matemático.",
      "Propónganle resolver una serie de problemas de distinto tipo eligiendo por sí mismo el método más eficiente para cada uno. La capacidad de seleccionar y aplicar el procedimiento óptimo según el problema es la cumbre de la ejecución matemática autónoma.",
      "Invítenle a crear un 'error frecuente' ficticio —un procedimiento con un error típico— y a explicar por qué ocurre y cómo evitarlo. Analizar y prevenir errores es el dominio más reflexivo y metacognitivo de la ejecución matemática que existe."
    ]
  },

  "Verificación de Respuestas": {
    "Inicial": [
      "Después de que su hijo resuelva un problema, instalen el hábito de la pregunta clave: '¿Tiene sentido esta respuesta?' Lean juntos el problema de nuevo y compárenlo con la respuesta obtenida. Treinta segundos de verificación evitan la mayoría de los errores por descuido.",
      "Establezcan la regla: 'Nunca terminamos sin leer dos veces.' Después de resolver, su hijo lee el problema de nuevo y verifica que su respuesta responde exactamente lo que se pedía. Un hábito simple que marca una enorme diferencia en los resultados reales.",
      "Jueguen a ser 'detectores de errores': preséntenle problemas ya resueltos —con errores incluidos— y que su hijo encuentre qué salió mal y dónde. Revisar el trabajo ajeno entrena la mirada verificadora sin la ansiedad que genera cuando el error es propio."
    ],
    "En desarrollo": [
      "Enseñen la verificación por operación inversa: si sumó para resolver, que reste para comprobar; si multiplicó, que divida. Verificar que la operación inversa regresa al dato del problema convierte la verificación en un acto concreto, lógico y verdaderamente confiable.",
      "Antes de resolver, pídanle que estime el resultado: '¿Debería ser grande o pequeño? ¿Mayor o menor que 100?' Al terminar, compare con la estimación. Si hay gran diferencia, vale la pena revisar. La estimación previa actúa como un filtro eficaz de errores.",
      "Conversen sobre las unidades de medida de la respuesta: '¿Si el problema pregunta cuántos kilómetros, tiene sentido que la respuesta sea 0.003?' Verificar que la magnitud y las unidades sean razonables es una forma poderosa de detectar errores de procedimiento."
    ],
    "Avanzado": [
      "Pídanle que verifique su respuesta por dos caminos: la operación inversa Y una estimación. Si ambos confirman el resultado, puede estar seguro. Tener múltiples formas de verificación desarrolla la confianza matemática y el pensamiento flexible ante los problemas.",
      "Propongan que antes de dar por terminado cualquier problema incluya siempre estas tres preguntas: '¿Respondí lo que pedía? ¿Las unidades son correctas? ¿El resultado es razonable?' Convertir estas preguntas en rutina es la marca de un matemático cuidadoso y preciso.",
      "Propónganle calcular una versión estimada de cada respuesta para comparar antes de entregar cualquier tarea. Verificar por estimación paralela al cálculo exacto es una forma sofisticada y eficiente de detectar errores antes de que tengan consecuencias."
    ],
    "Excelente": [
      "Invítenle a crear su propia 'lista de verificación': los pasos que él mismo revisaría siempre antes de dar por buena una respuesta matemática. Diseñar criterios de calidad propios demuestra que ha internalizado los estándares de excelencia y es señal de verdadera madurez matemática.",
      "Invítenle a cronometrar cuánto tiempo dedica a verificar sus respuestas en comparación con el tiempo de resolución. Reflexionar sobre esa proporción y ajustarla a propósito es un hábito metacognitivo que distingue a los matemáticos expertos y verdaderamente cuidadosos.",
      "Propónganle enseñarle a un familiar su proceso de verificación personal: los pasos concretos que usa para confirmar que una respuesta es correcta. Explicar el proceso de verificación a otros lo refuerza profundamente y prueba que se ha convertido en un hábito autónomo."
    ]
  }

};


/* ------------------------------------------------------------------ */
/* BLOQUE DE FORTALEZA (cuando todas las dimensiones ≥ 70)            */
/* ------------------------------------------------------------------ */
window.HOGAR_FORTALEZA = {
  mensaje:
    "Su hijo demuestra un desempeño sólido en todas las dimensiones evaluadas. " +
    "Eso es el resultado de esfuerzo, constancia y un buen acompañamiento en casa. " +
    "En este nivel, el objetivo es mantener el hábito lector, seguir explorando y " +
    "desafiarle con textos y problemas cada vez más ricos y variados.",
  enriquecimiento:
    "Esta semana, propongan leer juntos un artículo de ciencia, historia o arte que " +
    "les despierte curiosidad a los dos. Conversen sobre lo que aprendieron, lo que " +
    "les sorprendió y las preguntas que quedaron abiertas. La curiosidad compartida " +
    "es la mejor inversión en el desarrollo intelectual de su hijo."
};


/* ------------------------------------------------------------------ */
/* MAPEO: clave interna → etiqueta visible en el banco                 */
/* ------------------------------------------------------------------ */
var _HOGAR_DIM_MAP = {
  "Literal":     "Comprensión Literal",
  "Inferencial": "Comprensión Inferencial",
  "Critica":     "Pensamiento Crítico",
  "Comprender":  "Comprensión del Problema",
  "Pensar":      "Planificación Estratégica",
  "Ejecutar":    "Ejecución de Procedimientos",
  "Responder":   "Verificación de Respuestas"
};

var _HOGAR_DIM_ORDER = [
  "Literal", "Inferencial", "Critica",
  "Comprender", "Pensar", "Ejecutar", "Responder"
];


/* ------------------------------------------------------------------ */
/* LÓGICA DE SELECCIÓN                                                 */
/*                                                                     */
/* @param {Object} scores   { Literal: 33, Inferencial: 80, ... }     */
/*                          null/undefined = N/A, se ignora.           */
/* @param {Object} [niveles] Opcional; si se omite se calcula aquí.   */
/*                                                                     */
/* @returns {Object}                                                   */
/*   { tipo: "personalizado", items: Array }                           */
/*   { tipo: "fortaleza", mensaje, enriquecimiento }                   */
/*                                                                     */
/*   Cada item en el array "personalizado":                            */
/*   { dimKey, dimLabel, nivel, score, textos: string[] }              */
/* ------------------------------------------------------------------ */
window.getRecomendacionesHogar = function (scores, niveles) {
  scores  = scores  || {};
  niveles = niveles || {};

  /* Función local de nivel (reusa getLevel si ya está en ámbito) */
  function _nivel(score) {
    if (score === null || score === undefined || isNaN(score)) return null;
    if (typeof getLevel === "function") return getLevel(score);
    if (score < 40) return "Inicial";
    if (score < 70) return "En desarrollo";
    if (score < 85) return "Avanzado";
    return "Excelente";
  }

  /* Reunir dimensiones con score válido */
  var evaluadas = _HOGAR_DIM_ORDER.filter(function (key) {
    var s = scores[key];
    return s !== null && s !== undefined && !isNaN(s);
  });

  if (evaluadas.length === 0) {
    return { tipo: "fortaleza", mensaje: window.HOGAR_FORTALEZA.mensaje, enriquecimiento: window.HOGAR_FORTALEZA.enriquecimiento };
  }

  /* Verificar si todas están en Avanzado o Excelente (score ≥ 70) */
  var todasAltas = evaluadas.every(function (key) {
    return scores[key] >= 70;
  });

  if (todasAltas) {
    return {
      tipo:             "fortaleza",
      mensaje:          window.HOGAR_FORTALEZA.mensaje,
      enriquecimiento:  window.HOGAR_FORTALEZA.enriquecimiento
    };
  }

  /* Ordenar por score ascendente (más bajas primero) y tomar máx. 3 */
  var seleccionadas = evaluadas
    .slice()
    .sort(function (a, b) {
      return (scores[a] || 0) - (scores[b] || 0);
    })
    .slice(0, 3);

  var banco = window.HOGAR_RECOMENDACIONES;

  var items = seleccionadas.map(function (key) {
    var score    = scores[key];
    var nivel    = niveles[key] || _nivel(score);
    var label    = _HOGAR_DIM_MAP[key] || key;
    var bankKey  = label;
    var recs     = (banco[bankKey] && banco[bankKey][nivel]) ? banco[bankKey][nivel] : [];

    /* Cantidad de textos según nivel:
       Inicial / En desarrollo → 3 (principal + 2 secundarias)
       Avanzado               → 2 (principal + 1 secundaria)
       Excelente              → 1 (solo principal)              */
    var cantidad = 3;
    if (nivel === "Avanzado")  cantidad = 2;
    if (nivel === "Excelente") cantidad = 1;

    return {
      dimKey:   key,
      dimLabel: label,
      nivel:    nivel,
      score:    score,
      textos:   recs.slice(0, cantidad)
    };
  });

  return {
    tipo:  "personalizado",
    items: items
  };
};
