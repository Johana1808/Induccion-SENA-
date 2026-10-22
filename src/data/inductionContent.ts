/**
 * Base de conocimiento oficial y estructurada para la Inducción SENA
 * Basada en el Acuerdo 009 de 2024 (Reglamento del Aprendiz SENA)
 * modificado por el Acuerdo 002 de 2026 (Consejo Directivo Nacional).
 * Deroga los Acuerdos 07 de 2012, 02 de 2014, 06 de 2023 y 02 de 2024.
 */

export interface InductionModule {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  readingTime: string;
  xpReward: number;
  coverTopic: string;
  sections: {
    title: string;
    content: string[];
    highlights: string[];
    legalReference?: string;
  }[];
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CaseDilemma {
  id: string;
  title: string;
  context: string;
  category: 'Derechos' | 'Deberes' | 'Prohibiciones' | 'Etapa Productiva';
  scenario: string;
  options: {
    text: string;
    isOptimal: boolean;
    consequence: string;
    articleReference: string;
    points: number;
  }[];
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  article: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAtXp?: number;
}

export interface ApprenticeProfile {
  fullName: string;
  documentType: string;
  documentNumber: string;
  programName: string;
  fichaCode: string;
  regional: string;
  trainingCenter: string;
  modality: 'Presencial' | 'Virtual' | 'A Distancia';
  inductionDate: string;
}

export interface ApprenticeRecord {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  fichaCode: string;
  programName: string;
  regional: string;
  trainingCenter: string;
  modality: string;
  modulesCompleted: string;
  quizScore: number | null;
  hasPassedQuiz: boolean;
  status: 'Aprobado y Certificado' | 'En Proceso' | 'Pendiente Evaluación';
  certificateCode: string;
  registrationDate: string;
  regulationFramework: string;
}

export const DEFAULT_PROFILE: ApprenticeProfile = {
  fullName: 'Johana Marcela Alvarado Flórez',
  documentType: 'Cédula de Ciudadanía',
  documentNumber: '1098765432',
  programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  fichaCode: '2874910',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
  modality: 'Presencial',
  inductionDate: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
};

export const SEED_STUDENTS_RECORDS: ApprenticeRecord[] = [
  {
    id: 'rec-1',
    fullName: 'Johana Marcela Alvarado Flórez',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '1098765432',
    fichaCode: '2874910',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
    modality: 'Presencial',
    modulesCompleted: '5/5',
    quizScore: 100,
    hasPassedQuiz: true,
    status: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2874910-5432-2026',
    registrationDate: '2026-10-20 14:35',
    regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
  },
  {
    id: 'rec-2',
    fullName: 'Carlos Eduardo Mendoza Prada',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '1014298765',
    fichaCode: '2874910',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
    modality: 'Presencial',
    modulesCompleted: '5/5',
    quizScore: 90,
    hasPassedQuiz: true,
    status: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2874910-8765-2026',
    registrationDate: '2026-10-20 15:10',
    regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
  },
  {
    id: 'rec-3',
    fullName: 'Valentina Gómez Restrepo',
    documentType: 'Tarjeta de Identidad',
    documentNumber: '1023456789',
    fichaCode: '2874910',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
    modality: 'Presencial',
    modulesCompleted: '5/5',
    quizScore: 80,
    hasPassedQuiz: true,
    status: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2874910-6789-2026',
    registrationDate: '2026-10-20 16:22',
    regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
  },
  {
    id: 'rec-4',
    fullName: 'Kevin Andrés Barrientos Silva',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '1095847291',
    fichaCode: '2874910',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
    modality: 'Presencial',
    modulesCompleted: '4/5',
    quizScore: 60,
    hasPassedQuiz: false,
    status: 'Pendiente Evaluación',
    certificateCode: 'En trámite',
    registrationDate: '2026-10-21 08:45',
    regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
  },
  {
    id: 'rec-5',
    fullName: 'María Alejandra Ortiz Pardo',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '1032489102',
    fichaCode: '2874910',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
    modality: 'Presencial',
    modulesCompleted: '5/5',
    quizScore: 100,
    hasPassedQuiz: true,
    status: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2874910-9102-2026',
    registrationDate: '2026-10-21 09:15',
    regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
  },
];

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Identidad SENA y Bienestar al Aprendiz',
    shortDesc: 'Misión institucional, valores del Código de Integridad y los programas de apoyo integral al aprendiz.',
    readingTime: '5 min',
    xpReward: 150,
    coverTopic: 'El SENA como entidad tripartita más querida de Colombia',
    sections: [
      {
        title: 'Misión y Carácter de la Formación Profesional Integral',
        content: [
          'El Servicio Nacional de Aprendizaje (SENA) está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral.',
          'La formación en el SENA no solo busca capacitar en competencias técnicas para el trabajo, sino formar ciudadanos íntegros, solidarios y comprometidos con la transformación productiva y social del país.'
        ],
        highlights: [
          'Formación gratuita sin intermediarios',
          'Enfoque por competencias laborales y resultados de aprendizaje',
          'Valores institucionales: Honestidad, Respeto, Compromiso, Diligencia y Justicia'
        ],
        legalReference: 'Ley 119 de 1994 y Acuerdo 009 de 2024, Principios Generales'
      },
      {
        title: 'Servicios de Bienestar al Aprendiz',
        content: [
          'El Plan Nacional de Bienestar al Aprendiz es un derecho consagrado que acompaña toda la trayectoria formativa a través de múltiples dimensiones:',
          '1. Salud, prevención y primeros auxilios emocionales.',
          '2. Arte, cultura y recreación en los centros formativos.',
          '3. Liderazgo, monitorías académicas y fomento al emprendimiento.',
          '4. Apoyos de sostenimiento (regular, FIC) para aprendices en condiciones de vulnerabilidad socioeconómica.'
        ],
        highlights: [
          'Convocatorias periódicas para monitorías académicas remuneradas',
          'Atención psicosocial y fomento del bienestar integral',
          'Acompañamiento en el aprendizaje inclusivo y sin discriminación'
        ],
        legalReference: 'Acuerdo 009 de 2024, Art. 5 Numeral 6'
      }
    ],
    quickCheck: {
      question: '¿Cuál es el propósito central de la Formación Profesional Integral del SENA?',
      options: [
        'Únicamente expedir certificados rápidos sin fundamentación ética',
        'Desarrollar competencias técnicas y humanas para el trabajo productivo y la ciudadanía',
        'Reemplazar la educación formal universitaria de forma excluyente',
        'Cobrar matrículas semestrales según el estrato socioeconómico'
      ],
      correctIndex: 1,
      explanation: 'La Formación Profesional Integral del SENA combina el saber técnico con el saber ser, fortaleciendo el desarrollo humano y ciudadano de manera gratuita.'
    }
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Derechos del Aprendiz (Acuerdo 009 de 2024)',
    shortDesc: 'Conoce tus facultades, garantías de debido proceso, acceso a ambientes tecnológicos y libertad formativa.',
    readingTime: '7 min',
    xpReward: 200,
    coverTopic: 'Artículo 5: Garantías fundamentales de los aprendices SENA',
    sections: [
      {
        title: 'Derechos Académicos y de Formación',
        content: [
          'El nuevo Reglamento del Aprendiz (Acuerdo 009 de 2024) consolida tus garantías desde el proceso de inducción hasta la etapa productiva:',
          '• Recibir una inducción institucional rigurosa sobre el reglamento, la estructura curricular y la plataforma LMS institucional (Zajuna / SofíaPlus).',
          '• Acceder y utilizar libremente los ambientes de formación, laboratorios, talleres, equipos de cómputo, biblioteca física y recursos bibliográficos digitales.',
          '• Recibir oportunamente los elementos de protección personal (EPP) y bioseguridad cuando el programa de formación o taller lo requiera.',
          '• Ser evaluado de manera objetiva, formativa y con retroalimentación transparente.'
        ],
        highlights: [
          'Garantía de recibir calificación y retroalimentación dentro de los 8 días hábiles siguientes a la entrega',
          'Derecho a solicitar revisión justificada de evaluaciones ante un segundo instructor evaluador',
          'Derecho a planes de mejoramiento antes de tomar decisiones sancionatorias'
        ],
        legalReference: 'Acuerdo 009 de 2024, Art. 5 (Derechos del Aprendiz)'
      },
      {
        title: 'Derechos de Convivencia, Participación e Inclusión',
        content: [
          '• Ser tratado con dignidad, igualdad y respeto por parte de directivos, instructores, personal administrativo y compañeros de formación.',
          '• Solicitar y recibir ajustes razonables cuando el aprendiz presente alguna discapacidad o necesidad educativa particular.',
          '• Elegir y ser elegido como vocero de ficha o representante general de los aprendices ante el Centro de Formación.',
          '• Disfrutar del debido proceso constitucional en cualquier trámite disciplinario o académico, con derecho a ser escuchado, presentar pruebas y apelar decisiones.'
        ],
        highlights: [
          'Cero tolerancia al acoso, discriminación, matoneo o vulneración de derechos',
          'Canales formales de PQRS y acompañamiento del Comité de Convivencia',
          'Derecho a la libre expresión en el marco del respeto mutuo'
        ],
        legalReference: 'Acuerdo 009 de 2024, Art. 5 Numerales 8 al 16'
      }
    ],
    quickCheck: {
      question: 'Según el Acuerdo 009 de 2024, ¿cuál es el plazo máximo para que un instructor publique la evaluación y retroalimentación de una evidencia de aprendizaje?',
      options: [
        'Dentro de los 8 días hábiles siguientes a la presentación de la evidencia',
        'Hasta el final del trimestre sin aviso previo',
        '30 días calendario según la disponibilidad del centro',
        'En cualquier momento antes de graduarse'
      ],
      correctIndex: 0,
      explanation: 'El Acuerdo 009 de 2024 estipula que las evaluaciones deben registrarse y comunicarse en un plazo máximo de 8 días hábiles con su debida retroalimentación formativa.'
    }
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Deberes del Aprendiz y Responsabilidad Formativa',
    shortDesc: 'Compromisos académicos, normas de convivencia, puntualidad, porte de carné y gestión ambiental.',
    readingTime: '6 min',
    xpReward: 200,
    coverTopic: 'Artículo 6: Compromisos éticos, académicos y cívicos',
    sections: [
      {
        title: 'Deberes Académicos y Plataformas Digitales',
        content: [
          'La formación en el SENA requiere disciplina y autorregulación del aprendizaje:',
          '• Asistir puntualmente a todas las actividades programadas en el horario asignado (presencial o sincrónico virtual).',
          '• Desarrollar de manera autónoma, honesta e individual o colaborativa las evidencias de aprendizaje orientadas en las guías.',
          '• Mantener actualizada la información personal en los aplicativos institucionales (SofíaPlus, Zajuna, APE).',
          '• Justificar las inasistencias dentro de los 3 días hábiles siguientes ante el instructor o coordinación académica mediante soporte idóneo (médico, laboral o fuerza mayor).'
        ],
        highlights: [
          'Plazo de 3 días hábiles para justificar inasistencias con soporte válido',
          'Uso responsable de cuentas institucionales (@sena.edu.co o @soy.sena.edu.co)',
          'Cumplimiento estricto del cronograma y entregas de fases del proyecto'
        ],
        legalReference: 'Acuerdo 009 de 2024, Art. 6 (Deberes del Aprendiz)'
      },
      {
        title: 'Deberes Disciplinarios, Seguridad y Medio Ambiente',
        content: [
          '• Portar visiblemente el carné institucional en todo momento dentro de las instalaciones y eventos del SENA.',
          '• Vestir el uniforme o indumentaria técnica exigida con decoro y respeto por las normas de seguridad y salud en el trabajo (SST).',
          '• Cuidar las instalaciones, mobiliario, maquinaria, simuladores y recursos del Centro de Formación.',
          '• Cumplir las directrices del Plan de Gestión Ambiental del Centro (separación de residuos, ahorro de agua y energía).'
        ],
        highlights: [
          'Porte permanente y visible del carné institucional',
          'Uso obligatorio de EPP en talleres y laboratorios mecánicos, eléctricos o de alimentos',
          'Respeto y preservación de zonas verdes y bienes públicos'
        ],
        legalReference: 'Acuerdo 009 de 2024, Art. 6 Numerales 7 al 18'
      }
    ],
    quickCheck: {
      question: 'Si un aprendiz falta a formación por una calamidad o incapacidad médica, ¿cuánto tiempo tiene para radicar la justificación?',
      options: [
        'Dentro de los 3 días hábiles siguientes al hecho',
        'Hasta el final del año lectivo',
        'No es necesario justificar si avisa por WhatsApp al monitor',
        '15 días hábiles después de regresar'
      ],
      correctIndex: 0,
      explanation: 'El reglamento establece un plazo perentorio de 3 días hábiles para radicar formalmente la justificación con soporte válido ante la coordinación o instructores.'
    }
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Prohibiciones, Faltas y Medidas Formativas',
    shortDesc: 'Comportamientos no permitidos, clasificación de faltas, debido proceso y Comité de Evaluación.',
    readingTime: '7 min',
    xpReward: 250,
    coverTopic: 'Régimen disciplinario y medidas pedagógicas',
    sections: [
      {
        title: 'Prohibiciones Expresas en el SENA',
        content: [
          'Para proteger la seguridad física y la convivencia comunitaria, el reglamento prohíbe taxativamente:',
          '1. Plagiar materiales, trabajos, códigos fuente o investigaciones ajenas haciéndolas pasar como propias.',
          '2. Cometer fraude en evaluaciones o suplantar la identidad de otro aprendiz en plataformas o asistencias.',
          '3. Portar armas, ingresar o consumir sustancias psicoactivas o bebidas alcohólicas en el SENA o asistir bajo sus efectos.',
          '4. Realizar proselitismo político o religioso institucional que coaccione a la comunidad formativa.',
          '5. Cualquier conducta de acoso sexual, matoneo, violencia de género o discriminación por motivo de raza, orientación, religión u origen.'
        ],
        highlights: [
          'El plagio y fraude académico conllevan investigación inmediata ante Comité',
          'Cero tolerancia a armas, alcohol y estupefacientes en sedes SENA',
          'Prohibición de actos de intimidación cibernética o acoso'
        ],
        legalReference: 'Acuerdo 009 de 2024, Art. 7 (Prohibiciones)'
      },
      {
        title: 'Medidas Formativas, Sanciones y Debido Proceso (Art. 48 modificado por Acuerdo 002 de 2026)',
        content: [
          'El SENA prioriza el enfoque formativo y pedagógico antes de las sanciones punitivas:',
          '• Medidas Formativas: Llamado de atención verbal reflexivo, compromisos pedagógicos escritos y planes de mejoramiento concertados.',
          '• Sanciones: Llamado de atención formal con copia a la hoja de vida, condicionamiento de matrícula o cancelación de matrícula (con inhabilidad de 6 a 24 meses según la gravedad).',
          '• Garantías del Debido Proceso (Art. 48 reformado por Acuerdo 002 de 2026): Para asegurar la transparencia e imparcialidad, existen dos equipos diferenciados: uno técnico encargado de revisar, analizar y documentar minuciosamente la información, y el Comité de Evaluación y Seguimiento para deliberar.',
          '• Participación Estudiantil Reforzada: El vocero de los aprendices o el representante del Centro cuenta con participación activa en las deliberaciones del Comité para velar por los derechos del aprendiz, quien además tiene derecho a descargos, pruebas y recurso de reposición.'
        ],
        highlights: [
          'Art. 48 reformado (Acuerdo 002 de 2026): Separación de equipos técnicos de instrucción y decisión',
          'Participación protagónica del vocero o representante de aprendices en comités disciplinarios',
          'Garantía plena del derecho a la defensa, contradicción y apelación'
        ],
        legalReference: 'Acuerdo 009 de 2024 y Acuerdo 002 de 2026 (Art. 48 modificado)'
      }
    ],
    quickCheck: {
      question: '¿Qué es un Plan de Mejoramiento según el Reglamento del Aprendiz?',
      options: [
        'Una sanción económica que se descuenta del subsidio de transporte',
        'Una medida formativa pedagógica concertada para superar deficiencias en resultados de aprendizaje',
        'La expulsión automática sin derecho a presentar descargos',
        'Un examen sorpresa sin previo aviso'
      ],
      correctIndex: 1,
      explanation: 'El Plan de Mejoramiento es una medida formativa acordada entre el instructor y el aprendiz para alcanzar los resultados de aprendizaje pendientes.'
    }
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Etapa Productiva, Novedades y Graduación',
    shortDesc: 'Alternativas de etapa productiva, gestión de novedades de matrícula y requisitos para certificarse.',
    readingTime: '6 min',
    xpReward: 200,
    coverTopic: 'El puente al mundo laboral y titulación oficial',
    sections: [
      {
        title: 'Alternativas para el Desarrollo de la Etapa Productiva',
        content: [
          'La formación en el SENA comprende dos etapas: Lectiva y Productiva. Para la etapa práctica puedes optar por diversas modalidades válidas:',
          '1. Contrato de Aprendizaje: Modalidad formativa especial con cuota de sostenimiento empresarial (mínimo 75% o 100% del SMLV según desempleo) y afiliación a EPS y ARL.',
          '2. Proyecto Productivo (Fondo Emprender / SENA Emprende Rural): Creación de modelo de negocio propio.',
          '3. Vínculo Laboral o Contractual: Desempeño de funciones directamente relacionadas con el perfil ocupacional del programa.',
          '4. Pasantías (incluyendo apoyo a entidades públicas, ONGs o instituciones educativas) y Monitorías en el SENA.'
        ],
        highlights: [
          'Todas las alternativas requieren aval previo de la Coordinación Académica',
          'Seguimiento concertado con bitácoras quincenales y visitas de instructor técnico',
          'Duración máxima de 6 meses para tecnologías y técnicas laborales'
        ],
        legalReference: 'Acuerdo 009 de 2024, Régimen de Etapa Productiva'
      },
      {
        title: 'Trámites de Novedades y Requisitos de Certificación',
        content: [
          'Como aprendiz puedes gestionar novedades justificadas en SofíaPlus:',
          '• Aplazamiento de matrícula (hasta por 6 meses por motivos de fuerza mayor justificados).',
          '• Traslado de Centro o de Jornada (sujeto a disponibilidad de cupo y pertinencia).',
          '• Retiro voluntario debidamente radicado antes de incurrir en causal de deserción.',
          'Para certificarte debes tener el 100% de juicios evaluativos "Aprobado", certificación de etapa productiva a paz y salvo, y presentar pruebas de Estado si aplica (Saber Pro/TyT).'
        ],
        highlights: [
          'Evitar la deserción: Si acumulas 3 días consecutivos de inasistencia sin justificar, inicia proceso de deserción',
          'Paz y salvo integral (biblioteca, almacén, bienestar y académico)',
          'Expedición gratuita del título de Tecnólogo o Técnico Laboral'
        ],
        legalReference: 'Acuerdo 009 de 2024, Novedades y Certificación'
      }
    ],
    quickCheck: {
      question: '¿Qué ocurre si un aprendiz deja de asistir a su formación durante 3 días hábiles consecutivos sin presentar ninguna justificación válida?',
      options: [
        'Se le aprueban automáticamente las evidencias por abandono administrativo',
        'Se inicia el procedimiento reglamentario por presunta deserción formativa',
        'El sistema cancela su cédula de ciudadanía',
        'Se le transfiere automáticamente a formación virtual nocturna'
      ],
      correctIndex: 1,
      explanation: 'El reglamento estipula que la inasistencia injustificada durante 3 días consecutivos o el 10% del total de horas del trimestre activa la causal de deserción.'
    }
  }
];

export const CASE_DILEMMAS: CaseDilemma[] = [
  {
    id: 'case-1',
    title: 'El Proyecto Colaborativo y el "Copia y Pega"',
    category: 'Deberes',
    context: 'Trabajo en equipo en Fase de Ejecución curricular',
    scenario: 'Tu equipo de proyecto formativo tiene fecha límite de entrega mañana a las 11:59 p.m. Un compañero propone copiar textualmente un documento técnico de internet sin citar las fuentes para "ahorrar tiempo", asegurando que "el instructor no se dará cuenta con tanto trabajo que tiene". ¿Qué decisión tomas?',
    options: [
      {
        text: 'Aceptar la propuesta para no tener fricciones y entregar a tiempo el entregable.',
        isOptimal: false,
        consequence: 'Incurrirían en plagio tipificado como falta grave en el Acuerdo 009 de 2024. Todo el equipo podría enfrentar un Comité de Evaluación con posible condicionamiento de matrícula.',
        articleReference: 'Art. 7 Numeral 1 (Prohibición de Plagio y Fraude)',
        points: 0
      },
      {
        text: 'Negarse al plagio, citar debidamente las fuentes consultadas según normas APA/técnicas y reportar el trabajo original con aportes del equipo.',
        isOptimal: true,
        consequence: '¡Excelente decisión ética! Cumples con el deber de honestidad intelectual, garantizas la validez de tu evidencia y proteges la integridad de tu formación.',
        articleReference: 'Art. 6 (Deber de Honestidad Académica) y Art. 7 (Prohibición de Plagio)',
        points: 100
      },
      {
        text: 'Dejar que el compañero suba el trabajo con el plagio y tú no firmar la portada para desentenderte.',
        isOptimal: false,
        consequence: 'No asumes responsabilidad colaborativa ni ayudas a tu compañero a evitar una falta sancionable. Si eres parte del grupo, debes promover la ética colectiva.',
        articleReference: 'Art. 6 Numeral 2 (Responsabilidad en Actividades de Equipo)',
        points: 30
      }
    ]
  },
  {
    id: 'case-2',
    title: 'Calamidad Familiar y Plazo de Soporte',
    category: 'Deberes',
    context: 'Gestión de novedades y justificación de inasistencias',
    scenario: 'Carlos tuvo que viajar de urgencia a su pueblo por un percance médico grave de su abuela, faltando lunes, martes y miércoles a formación presencial. Regresa a clases el jueves por la mañana. ¿Cómo debe proceder según el reglamento?',
    options: [
      {
        text: 'Presentar la justificación con soporte documental ante el instructor y coordinación antes de que pasen 3 días hábiles desde el hecho.',
        isOptimal: true,
        consequence: '¡Correcto! Carlos ejerce su deber y derecho: radicar oportunamente el soporte dentro de los 3 días hábiles le permite reprogramar las evidencias sin ser reportado por deserción.',
        articleReference: 'Art. 6 (Justificación de Inasistencias en 3 días hábiles)',
        points: 100
      },
      {
        text: 'Esperar a que finalice el trimestre para contarle al instructor en la sesión de cierre de notas.',
        isOptimal: false,
        consequence: 'El plazo reglamentario habrá vencido y la inasistencia quedará registrada como injustificada, pudiendo activar un proceso por presunta deserción.',
        articleReference: 'Capítulo de Incumplimiento y Deserción',
        points: 0
      },
      {
        text: 'Decirle a un compañero que marque su asistencia en la lista mientras él no está.',
        isOptimal: false,
        consequence: 'Cometería una suplantación y falsedad en registro, lo cual constituye una falta disciplinaria muy grave tanto para Carlos como para su cómplice.',
        articleReference: 'Art. 7 (Prohibición de Suplantación y Falsedad)',
        points: 0
      }
    ]
  },
  {
    id: 'case-3',
    title: 'Discrepancia en la Evaluación de una Evidencia',
    category: 'Derechos',
    context: 'Evaluación de Aprendizajes y Debido Proceso',
    scenario: 'Laura entregó a tiempo y con todos los criterios de la rúbrica su evidencia de laboratorio. Sin embargo, recibió calificación "No Aprobado" sin comentarios constructivos y el instructor no le responde dudas en clase. Laura está convencida de que su trabajo cumple el estándar.',
    options: [
      {
        text: 'Insultar al instructor en el grupo de WhatsApp del curso y convocar a paro de actividades.',
        isOptimal: false,
        consequence: 'Incurriría en falta disciplinaria grave por irrespeto y alteración del orden, perdiendo la razón jurídica de su reclamo académico.',
        articleReference: 'Art. 6 y 7 (Convivencia y Canales Institucionales)',
        points: 0
      },
      {
        text: 'Solicitar cordialmente una retroalimentación formal por escrito y, si persiste el desacuerdo, pedir formalmente la revisión a la Coordinación con un segundo instructor.',
        isOptimal: true,
        consequence: '¡Excelente uso de tus derechos! El Acuerdo 009 garantiza el derecho a conocer la retroalimentación y a solicitar un segundo calificador imparcial cuando hay controversia técnica.',
        articleReference: 'Art. 5 Numeral 13 (Derecho a Revisión y Segundo Evaluador)',
        points: 100
      },
      {
        text: 'Resignarse y pagarle a un tercero para que le haga un nuevo trabajo.',
        isOptimal: false,
        consequence: 'Pagar por evidencias atenta contra la ética formativa del SENA y renuncia a sus derechos de debido proceso evaluativo.',
        articleReference: 'Art. 5 y 6 (Formación Integral y Honestidad)',
        points: 10
      }
    ]
  },
  {
    id: 'case-4',
    title: 'Seguridad en Ambientes de Taller y EPP',
    category: 'Prohibiciones',
    context: 'Seguridad y Salud en el Trabajo (SST)',
    scenario: 'En un taller técnico de maquinaria y soldadura, hace mucho calor y un aprendiz decide quitarse las gafas de seguridad, los guantes dieléctricos y remangarse el overol para trabajar más cómodo cerca a la fresadora industrial.',
    options: [
      {
        text: 'Dejarlo trabajar así porque cada quien es libre y responsable de su propio cuerpo.',
        isOptimal: false,
        consequence: 'Pone en inminente peligro su integridad física y la de sus compañeros. Las normas de SST en el SENA son de obligatorio cumplimiento estricto.',
        articleReference: 'Art. 6 (Deber de Uso de EPP y Autocuidado en Talleres)',
        points: 0
      },
      {
        text: 'Advertirle que el uso de EPP es obligatorio e indelegable, y si no acata, informar al instructor o delegado SST para suspender la operación por seguridad.',
        isOptimal: true,
        consequence: '¡Protección y corresponsabilidad ejemplar! En el SENA el cuidado de la vida y el cumplimiento de protocolos de seguridad salvan vidas.',
        articleReference: 'Art. 6 Numeral 10 y Art. 7 (Normas de Bioseguridad y SST)',
        points: 100
      },
      {
        text: 'Tomarle una foto y publicarla con burlas en redes sociales.',
        isOptimal: false,
        consequence: 'Viola el derecho a la intimidad y comete acoso digital, incurriendo en falta disciplinaria.',
        articleReference: 'Art. 7 (Prohibición de Hostigamiento y Acoso)',
        points: 0
      }
    ]
  },
  {
    id: 'case-5',
    title: 'Elección de Etapa Productiva y Compromiso',
    category: 'Etapa Productiva',
    context: 'Transición de Etapa Lectiva a Práctica Empresarial',
    scenario: 'Andrés está por finalizar su etapa lectiva. Una empresa le ofrece un contrato de aprendizaje con remuneración, pero él también tiene una idea innovadora de negocio tecnológico que podría postular a Fondo Emprender. ¿Qué debe saber sobre las modalidades?',
    options: [
      {
        text: 'Solo el Contrato de Aprendizaje es válido; las demás modalidades no son reconocidas por el SENA.',
        isOptimal: false,
        consequence: 'Información errónea: El SENA reconoce múltiples modalidades como Proyecto Productivo, Pasantía, Vínculo Laboral y Monitorías.',
        articleReference: 'Capítulo de Etapa Productiva, Acuerdo 009 de 2024',
        points: 10
      },
      {
        text: 'Puede asesorarse con el equipo de Relaciones Corporativas y Emprendimiento del Centro para validar cuál modalidad se alinea mejor con su plan de vida y registrarla oportunamente.',
        isOptimal: true,
        consequence: '¡Perfecto! El aprendiz tiene el derecho a elegir entre las alternativas reglamentarias con orientación institucional para garantizar su titulación.',
        articleReference: 'Capítulo Etapa Productiva (Alternativas de Selección)',
        points: 100
      },
      {
        text: 'Firmar contrato de aprendizaje y al mismo tiempo iniciar el proyecto productivo sin avisarle a nadie.',
        isOptimal: false,
        consequence: 'No se pueden cruzar dos modalidades activas simultáneas de etapa productiva para la misma ficha de formación.',
        articleReference: 'Normativa de Registro de Etapa Productiva SENA',
        points: 0
      }
    ]
  }
];

export const ASSESSMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Normatividad General',
    question: '¿Cuál es el marco reglamentario vigente que rige los derechos, deberes y debido proceso del aprendiz SENA?',
    options: [
      'Acuerdo 009 de 2024 con su modificación vigente por el Acuerdo 002 de 2026',
      'Acuerdo 007 de 2012 (sin modificaciones)',
      'Resolución 100 de 1990',
      'Código de Policía Nacional únicamente'
    ],
    correctIndex: 0,
    explanation: 'El marco normativo vigente está conformado por el Acuerdo 009 de 2024 y su última modificación expedida mediante el Acuerdo 002 de 2026 por el Consejo Directivo Nacional del SENA.',
    article: 'Acuerdo 009 de 2024 y Acuerdo 002 de 2026'
  },
  {
    id: 2,
    category: 'Derechos del Aprendiz',
    question: 'En caso de no estar de acuerdo con una calificación asignada en una evidencia de aprendizaje, ¿cuál es el derecho que asiste al aprendiz?',
    options: [
      'Bloquear el acceso al centro de formación',
      'Solicitar revisión explicada al instructor y, si subsiste inconformidad, la asignación de un segundo evaluador',
      'Exigir que la dirección destituya inmediatamente al instructor',
      'Modificar la nota directamente en la base de datos de SofíaPlus'
    ],
    correctIndex: 1,
    explanation: 'El artículo 5 garantiza el derecho a la revisión objetiva de evaluaciones y a un segundo calificador si persiste el desacuerdo motivado.',
    article: 'Art. 5, Derechos del Aprendiz'
  },
  {
    id: 3,
    category: 'Deberes del Aprendiz',
    question: '¿Cuál es el plazo estipulado para presentar la justificación con soporte documental ante una inasistencia por fuerza mayor o salud?',
    options: [
      'Dentro de los 3 días hábiles siguientes al regreso o hecho',
      'Hasta 30 días calendario después',
      'Al momento de la ceremonia de graduación',
      'No hay plazo límite establecido'
    ],
    correctIndex: 0,
    explanation: 'El plazo perentorio es de 3 días hábiles para radicar formalmente las incapacidades o justificaciones válidas.',
    article: 'Art. 6, Numeral de Asistencia y Justificaciones'
  },
  {
    id: 4,
    category: 'Prohibiciones',
    question: '¿Cuál de los siguientes comportamientos está expresamente PROHIBIDO dentro de los ambientes del SENA según el Acuerdo 009?',
    options: [
      'Participar en semilleros de investigación Sennova',
      'Realizar acciones de proselitismo político o religioso y actos de discriminación o acoso',
      'Solicitar préstamo de libros técnicos en la biblioteca',
      'Postularse como vocero de la ficha de formación'
    ],
    correctIndex: 1,
    explanation: 'El Acuerdo 009 prohíbe el proselitismo político o religioso institucional y sanciona drásticamente cualquier forma de discriminación o acoso.',
    article: 'Art. 7, Prohibiciones Expresas'
  },
  {
    id: 5,
    category: 'Medidas Formativas',
    question: '¿Cuál es la diferencia fundamental entre una Medida Formativa y una Sanción Disciplinaria?',
    options: [
      'No existe ninguna diferencia; son términos idénticos',
      'Las medidas formativas son pedagógicas y buscan mejorar el desempeño; las sanciones son medidas correctivas tras debido proceso en Comité',
      'Las sanciones las pagan los padres de familia con dinero',
      'Las medidas formativas implican cárcel preventiva'
    ],
    correctIndex: 1,
    explanation: 'Las medidas formativas (llamados verbales, planes de mejoramiento) tienen carácter formativo pedagógico; las sanciones se aplican tras Comité de Evaluación con debido proceso.',
    article: 'Capítulo de Medidas Formativas y Sanciones'
  },
  {
    id: 6,
    category: 'Derechos del Aprendiz',
    question: '¿Qué garantía tienen los aprendices en condición de discapacidad o necesidades específicas según el nuevo reglamento?',
    options: [
      'No pueden ingresar a formación técnica',
      'Derecho a solicitar y recibir ajustes razonables en metodologías, recursos e infraestructura',
      'Deben contratar a su propio instructor particular',
      'Solo pueden cursar programas de 2 semanas'
    ],
    correctIndex: 1,
    explanation: 'El Acuerdo 009 fortalece la inclusión reconociendo expresamente el derecho a ajustes razonables para asegurar equidad de oportunidades.',
    article: 'Art. 5, Inclusión y Ajustes Razonables'
  },
  {
    id: 7,
    category: 'Etapa Productiva',
    question: '¿Cuál de las siguientes NO es una modalidad válida reconocida por el SENA para la Etapa Productiva?',
    options: [
      'Contrato de Aprendizaje',
      'Proyecto Productivo o iniciativa Fondo Emprender',
      'Pasantía o Vínculo Laboral formal en el área de estudio',
      'Trabajo informal sin relación con el programa ni aval de coordinación'
    ],
    correctIndex: 3,
    explanation: 'Toda modalidad de etapa productiva debe estar vinculada directamente con las competencias del programa y contar con aval y seguimiento institucional.',
    article: 'Capítulo de Etapa Productiva'
  },
  {
    id: 8,
    category: 'Convivencia y Símbolos',
    question: '¿Qué deber tiene el aprendiz respecto al carné y la identidad institucional dentro del Centro de Formación?',
    options: [
      'Portarlo de manera visible en todo momento para control de seguridad y convivencia',
      'Prestarlo a amigos ajenos a la institución para que ingresen',
      'Dejarlo guardado en casa para que no se deteriore',
      'Modificar la fotografía con filtros digitales antes de mostrarlo'
    ],
    correctIndex: 0,
    explanation: 'El porte visible del carné institucional es un deber reglamentario que vela por la seguridad comunitaria en todas las sedes del SENA.',
    article: 'Art. 6, Deberes Institucionales'
  },
  {
    id: 9,
    category: 'Comité de Evaluación y Debido Proceso',
    question: 'Según el Artículo 48 modificado por el Acuerdo 002 de 2026, ¿cómo se garantiza el debido proceso ante el Comité de Evaluación y Seguimiento?',
    options: [
      'A través de dos equipos técnicos de revisión e instrucción, y la participación activa del vocero o representante estudiantil',
      'Mediante sanciones automáticas sin escuchar descargos ni revisar pruebas',
      'Delegando la decisión en una empresa privada de seguridad',
      'Expulsando al aprendiz antes de iniciar la reunión'
    ],
    correctIndex: 0,
    explanation: 'El Acuerdo 002 de 2026 reformó el Artículo 48 del reglamento instituyendo dos equipos técnicos para documentar con objetividad e imparcialidad los casos, asegurando la representación de los aprendices y el debido proceso.',
    article: 'Art. 48 modificado por Acuerdo 002 de 2026'
  },
  {
    id: 10,
    category: 'Certificación',
    question: 'Para obtener la certificación oficial y título en el SENA se requiere:',
    options: [
      'Aprobar el 100% de los resultados de aprendizaje de la etapa lectiva y productiva, y estar a paz y salvo institucional',
      'Únicamente asistir al 50% de las clases teóricas',
      'Pagar una tarifa de graduación en la secretaría del centro',
      'Haber ganado todas las trivias de videojuegos del centro'
    ],
    correctIndex: 0,
    explanation: 'El título o certificado es gratuito y se expide al cumplir la totalidad de resultados de aprendizaje de ambas etapas y encontrarse a paz y salvo integral.',
    article: 'Capítulo de Certificación y Grados'
  }
];

export const BADGES_LIST: Badge[] = [
  {
    id: 'badge-1',
    name: 'Identidad SENA',
    description: 'Completaste el Módulo 1 sobre Misión, Valores y Bienestar Integral.',
    iconName: 'Award',
    unlockedAtXp: 150
  },
  {
    id: 'badge-2',
    name: 'Defensor de Derechos',
    description: 'Comprendes las garantías y derechos consagrados en el Art. 5 del Acuerdo 009.',
    iconName: 'ShieldCheck',
    unlockedAtXp: 350
  },
  {
    id: 'badge-3',
    name: 'Ciudadano Ejemplar',
    description: 'Asimilaste los deberes éticos, la puntualidad y la responsabilidad formativa.',
    iconName: 'HeartHandshake',
    unlockedAtXp: 550
  },
  {
    id: 'badge-4',
    name: 'Líder de Convivencia',
    description: 'Conoces las prohibiciones, el debido proceso y la cultura de paz institucional.',
    iconName: 'Users',
    unlockedAtXp: 800
  },
  {
    id: 'badge-5',
    name: 'Rumbo a la Productiva',
    description: 'Dominas las modalidades de etapa práctica y requisitos de titulación.',
    iconName: 'Briefcase',
    unlockedAtXp: 1000
  },
  {
    id: 'badge-6',
    name: 'Estratega Ético',
    description: 'Resolviste los 5 dilemas reales del aprendiz aplicando la normatividad.',
    iconName: 'Compass',
    unlockedAtXp: 1300
  },
  {
    id: 'badge-7',
    name: 'Maestro del Reglamento',
    description: 'Aprobaste la evaluación final con honores (más de 80%). Certificado emitido.',
    iconName: 'GraduationCap',
    unlockedAtXp: 1600
  }
];

export const INDUCTION_MODULES_EN: InductionModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'SENA Identity and Apprentice Welfare',
    shortDesc: 'Institutional mission, Integrity Code values, and comprehensive apprentice support programs.',
    readingTime: '5 min',
    xpReward: 150,
    coverTopic: 'SENA as Colombia’s most cherished tripartite entity',
    sections: [
      {
        title: 'Mission and Nature of Comprehensive Vocational Training',
        content: [
          'The National Learning Service (SENA) is tasked with fulfilling the State’s responsibility to invest in the technical and social development of Colombian workers, delivering comprehensive vocational training.',
          'Training at SENA aims not only to teach technical skills, but to educate well-rounded, ethical citizens dedicated to the country\'s social and economic transformation.'
        ],
        highlights: [
          'Tuition-free training without intermediaries',
          'Competency-based training and learning outcome focus',
          'Core values: Honesty, Respect, Commitment, Diligence, and Justice'
        ],
        legalReference: 'Law 119 of 1994 and Agreement 009 of 2024, General Principles'
      },
      {
        title: 'Apprentice Welfare Services',
        content: [
          'The National Apprentice Welfare Plan is a guaranteed right supporting learners throughout their educational journey across various dimensions:',
          '1. Healthcare, prevention, and emotional wellbeing.',
          '2. Arts, sports, culture, and recreation in training centers.',
          '3. Leadership, academic tutoring, and entrepreneurship support.',
          '4. Financial support stipends (Regular, FIC) for learners facing socioeconomic challenges.'
        ],
        highlights: [
          'Open calls for paid academic peer-tutoring',
          'Psychosocial support promoting well-being',
          'Inclusive education with zero discrimination'
        ],
        legalReference: 'Agreement 009 of 2024, Art. 5 Item 6'
      }
    ],
    quickCheck: {
      question: 'What is the core purpose of Comprehensive Vocational Training at SENA?',
      options: [
        'Only issuing fast certificates without ethical fundamentals',
        'Developing technical and human competencies for productive work and citizenship',
        'Replacing university education in an exclusionary manner',
        'Charging tuition fees based on socioeconomic stratum'
      ],
      correctIndex: 1,
      explanation: 'SENA Comprehensive Vocational Training blends technical know-how with human values, strengthening personal and civic growth tuition-free.'
    }
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Apprentice Rights (Agreement 009 of 2024)',
    shortDesc: 'Know your rights, due process guarantees, access to technological environments, and training freedom.',
    readingTime: '7 min',
    xpReward: 200,
    coverTopic: 'Article 5: Fundamental guarantees for SENA apprentices',
    sections: [
      {
        title: 'Academic and Educational Rights',
        content: [
          'The Apprentice Rulebook (Agreement 009 of 2024) protects your guarantees from induction through the productive stage:',
          '• Receive a thorough institutional induction on the rulebook, curriculum, and LMS platform (Zajuna / SofíaPlus).',
          '• Freely access and utilize training environments, labs, workshops, computers, and library resources.',
          '• Timely receive personal protective equipment (PPE) and biosafety gear when required.',
          '• Be evaluated objectively with transparent, formative feedback.'
        ],
        highlights: [
          'Evaluation and feedback within 8 working days following delivery',
          'Right to request an appeal before an impartial second instructor',
          'Right to pedagogical improvement plans before disciplinary actions'
        ],
        legalReference: 'Agreement 009 of 2024, Art. 5 (Apprentice Rights)'
      },
      {
        title: 'Rights to Coexistence, Participation and Inclusion',
        content: [
          '• Be treated with dignity, equality, and respect by directors, instructors, administrative staff, and peers.',
          '• Request and receive reasonable accommodations for disability or specific educational needs.',
          '• Elect and be elected as batch spokesperson or center apprentice representative.',
          '• Due process in any disciplinary procedure, including the right to be heard and appeal decisions.'
        ],
        highlights: [
          'Zero tolerance for harassment, discrimination, or bullying',
          'Formal grievance channels and Coexistence Committee support',
          'Freedom of expression grounded in mutual respect'
        ],
        legalReference: 'Agreement 009 of 2024, Art. 5 Items 8 to 16'
      }
    ],
    quickCheck: {
      question: 'According to Agreement 009 of 2024, what is the deadline for an instructor to publish learning evidence feedback?',
      options: [
        'Within 8 working days following evidence submission',
        'Until the end of the quarter without notice',
        '30 calendar days depending on center workload',
        'Anytime before graduation'
      ],
      correctIndex: 0,
      explanation: 'Agreement 009 of 2024 mandates that evaluations must be recorded and shared within 8 working days with formative feedback.'
    }
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Apprentice Duties and Training Responsibility',
    shortDesc: 'Academic commitments, conduct standards, punctuality, ID badge wearing, and environmental stewardship.',
    readingTime: '6 min',
    xpReward: 200,
    coverTopic: 'Article 6: Ethical, academic, and civic commitments',
    sections: [
      {
        title: 'Academic Duties and Digital Environments',
        content: [
          'Training at SENA demands dedication and self-directed learning:',
          '• Attend all scheduled activities promptly on time (in-person or virtual).',
          '• Develop learning evidence autonomously, honestly, individually or collaboratively as guided.',
          '• Keep personal data updated in institutional systems (SofíaPlus, Zajuna, APE).',
          '• Justify absences within 3 working days with valid documentary evidence (medical, work, or force majeure).'
        ],
        highlights: [
          'Strict 3-working-day window to justify absences with valid documentation',
          'Responsible use of institutional accounts (@sena.edu.co)',
          'Strict adherence to schedule and project milestones'
        ],
        legalReference: 'Agreement 009 of 2024, Art. 6 (Apprentice Duties)'
      },
      {
        title: 'Disciplinary Duties, Safety, and Environment',
        content: [
          '• Visibly wear the institutional ID badge at all times in SENA facilities and official events.',
          '• Wear the required technical uniform with decorum and respect for Occupational Health and Safety (OHS) standards.',
          '• Take care of machinery, simulators, furniture, and training center infrastructure.',
          '• Comply with the Center Environmental Management Plan (waste sorting, water and energy saving).'
        ],
        highlights: [
          'Mandatory visible wearing of institutional ID badge',
          'Compulsory PPE in workshops and labs',
          'Protection and respect for green areas and public resources'
        ],
        legalReference: 'Agreement 009 of 2024, Art. 6 Items 7 to 18'
      }
    ],
    quickCheck: {
      question: 'If an apprentice misses classes due to a medical emergency, how long do they have to submit proof?',
      options: [
        'Within 3 working days following the event',
        'Until the end of the school year',
        'No need to justify if notified via chat to a classmate',
        '15 working days after returning'
      ],
      correctIndex: 0,
      explanation: 'The rulebook establishes a 3-working-day deadline to formally file an absence justification with valid support.'
    }
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Prohibitions, Infractions and Formative Measures',
    shortDesc: 'Forbidden conduct, classification of infractions, due process, and Evaluation Committee.',
    readingTime: '7 min',
    xpReward: 250,
    coverTopic: 'Disciplinary regime and pedagogical measures',
    sections: [
      {
        title: 'Express Prohibitions at SENA',
        content: [
          'To ensure physical safety and harmonious coexistence, the rulebook strictly prohibits:',
          '1. Plagiarizing materials, homework, code, or third-party research claiming it as one’s own.',
          '2. Exam fraud or impersonating another apprentice in classes or attendance registers.',
          '3. Carrying weapons, entering with or consuming drugs or alcohol at SENA facilities.',
          '4. Engaging in institutional political or religious proselytism that coerces the training community.',
          '5. Any behavior involving sexual harassment, cyberbullying, gender violence, or discrimination.'
        ],
        highlights: [
          'Plagiarism and academic fraud result in immediate Committee investigation',
          'Zero tolerance for weapons, alcohol, and drugs at SENA facilities',
          'Strict prohibition against intimidation and harassment'
        ],
        legalReference: 'Agreement 009 of 2024, Art. 7 (Prohibitions)'
      },
      {
        title: 'Formative Measures, Sanctions and Due Process (Art. 48 modified by Agreement 002 of 2026)',
        content: [
          'SENA prioritizes formative and pedagogical solutions before punitive measures:',
          '• Formative Measures: Reflective verbal reprimands, written pedagogical commitments, and agreed improvement plans.',
          '• Sanctions: Written formal warnings in personal file, conditional enrollment, or enrollment cancellation (with 6 to 24 months suspension).',
          '• Due Process Guarantees (Art. 48 reformed by Agreement 002 of 2026): Two distinct teams operate to guarantee impartiality: a technical team to investigate and document evidence, and the Evaluation and Monitoring Committee to deliberate.',
          '• Active Student Representation: The apprentice batch spokesperson or center representative actively participates in Committee deliberations to advocate for learner rights.'
        ],
        highlights: [
          'Reformed Art. 48 (Agreement 002 of 2026): Separation of technical investigation from decision bodies',
          'Key participation of student representatives in disciplinary committees',
          'Full guarantee of the right to defense, evidence rebuttal, and appeal'
        ],
        legalReference: 'Agreement 009 of 2024 and Agreement 002 of 2026 (Modified Art. 48)'
      }
    ],
    quickCheck: {
      question: 'What is an Improvement Plan according to the Apprentice Rulebook?',
      options: [
        'A financial fine deducted from transportation subsidies',
        'A pedagogical formative measure agreed to overcome learning deficiencies',
        'Automatic expulsion without hearing',
        'A surprise pop quiz'
      ],
      correctIndex: 1,
      explanation: 'An Improvement Plan is a pedagogical agreement between the instructor and apprentice to achieve pending learning outcomes.'
    }
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Productive Stage, Enrollment Changes and Graduation',
    shortDesc: 'Productive stage alternatives, managing enrollment status, and certification requirements.',
    readingTime: '6 min',
    xpReward: 200,
    coverTopic: 'Bridge to the labor market and official credentialing',
    sections: [
      {
        title: 'Options for Completing the Productive Stage',
        content: [
          'Training at SENA consists of two phases: Schooling and Productive. For practical experience, apprentices may choose several recognized pathways:',
          '1. Apprenticeship Contract (Contrato de Aprendizaje): Special training contract with monthly company stipend and health/work hazard insurance.',
          '2. Productive Project (Fondo Emprender / SENA Emprende Rural): Developing one\'s own business model.',
          '3. Employment Contract: Working in job functions directly related to the study program profile.',
          '4. Internships (Pasantías) in public entities, NGOs, or academic tutoring at SENA.'
        ],
        highlights: [
          'All alternatives require prior approval from the Academic Coordination',
          'Regular monitoring with biweekly logs and instructor visits',
          'Maximum duration of 6 months for technician and technologist programs'
        ],
        legalReference: 'Agreement 009 of 2024, Productive Stage Regime'
      },
      {
        title: 'Enrollment Status Changes and Certification Requirements',
        content: [
          'Apprentices can formally request enrollment changes in SofíaPlus:',
          '• Postponement of enrollment (up to 6 months for justified reasons).',
          '• Transfer of Center or shift schedule (subject to slot availability).',
          '• Voluntary withdrawal properly filed before incurring in dropout status.',
          'To graduate, you must achieve 100% "Approved" competency judgments, complete the productive stage, clear all institutional debts, and take national state exams (Saber TyT/Pro) if applicable.'
        ],
        highlights: [
          'Preventing dropout: 3 consecutive unexcused absence days triggers dropout proceedings',
          'Comprehensive clearance (library, equipment inventory, welfare, academics)',
          'Free issuance of Technologist or Labor Technician degree certificate'
        ],
        legalReference: 'Agreement 009 of 2024, Enrollment Changes and Certification'
      }
    ],
    quickCheck: {
      question: 'What occurs if an apprentice misses training for 3 consecutive working days without submitting any valid excuse?',
      options: [
        'All evidence is automatically passed',
        'The regulatory procedure for presumed dropout is initiated',
        'The national ID card is revoked',
        'The student is automatically switched to night virtual classes'
      ],
      correctIndex: 1,
      explanation: 'The rulebook specifies that 3 consecutive unexcused absence days or 10% of total term hours triggers dropout proceedings.'
    }
  }
];

export const CASE_DILEMMAS_EN: CaseDilemma[] = [
  {
    id: 'case-1',
    title: 'The Collaborative Project and "Copy-Paste"',
    category: 'Deberes',
    context: 'Teamwork in Curricular Execution Phase',
    scenario: 'Your project team has a submission deadline tomorrow at 11:59 p.m. A teammate suggests copying a technical document from the internet without citing sources to "save time", claiming "the instructor has too much work to notice". What decision do you make?',
    options: [
      {
        text: 'Accept the suggestion to avoid friction and submit on time.',
        isOptimal: false,
        consequence: 'You would commit plagiarism, classified as a serious offense under Agreement 009 of 2024. The whole team could face an Evaluation Committee with potential conditional enrollment.',
        articleReference: 'Art. 7 Item 1 (Prohibition of Plagiarism and Fraud)',
        points: 0
      },
      {
        text: 'Refuse to plagiarize, properly cite consulted sources following standards, and submit original team work.',
        isOptimal: true,
        consequence: 'Excellent ethical choice! You uphold intellectual honesty, ensure the validity of your evidence, and protect the integrity of your training.',
        articleReference: 'Art. 6 (Academic Honesty Duty) and Art. 7 (Plagiarism Ban)',
        points: 100
      },
      {
        text: 'Let the teammate upload the plagiarized work and omit your name from the cover to distance yourself.',
        isOptimal: false,
        consequence: 'You evade collaborative responsibility and fail to help your peer avoid a sanctionable breach. As a team member, you must foster collective ethics.',
        articleReference: 'Art. 6 Item 2 (Responsibility in Team Activities)',
        points: 30
      }
    ]
  },
  {
    id: 'case-2',
    title: 'Family Emergency and Documentation Deadline',
    category: 'Deberes',
    context: 'Absence justification and notification management',
    scenario: 'Carlos had to travel urgently due to a severe medical emergency with his grandmother, missing Monday, Tuesday, and Wednesday of in-person training. He returns on Thursday morning. How should he proceed according to the rulebook?',
    options: [
      {
        text: 'Submit the justification with medical documentation to the instructor and coordination before 3 working days elapse.',
        isOptimal: true,
        consequence: 'Correct! Filing proof promptly within 3 working days allows Carlos to reschedule learning evidence without being reported for dropout.',
        articleReference: 'Art. 6 (Absence Justification within 3 working days)',
        points: 100
      },
      {
        text: 'Wait until the end of the term to mention it to the instructor during final grading.',
        isOptimal: false,
        consequence: 'The regulatory deadline will have expired and the absence will be marked as unexcused, which may trigger a dropout process.',
        articleReference: 'Chapter on Non-attendance and Dropout',
        points: 0
      },
      {
        text: 'Ask a friend to sign the attendance roll on his behalf while he is away.',
        isOptimal: false,
        consequence: 'This constitutes identity fraud and false records, which is a very serious disciplinary offense for both Carlos and his accomplice.',
        articleReference: 'Art. 7 (Prohibition of Impersonation and Falsification)',
        points: 0
      }
    ]
  },
  {
    id: 'case-3',
    title: 'Discrepancy in Grading of Learning Evidence',
    category: 'Derechos',
    context: 'Learning Assessment and Due Process',
    scenario: 'Laura delivered her lab assignment on time meeting all rubric criteria. However, she received an "Unapproved" grade without feedback and the instructor does not answer questions. Laura is confident her work meets requirements.',
    options: [
      {
        text: 'Insult the instructor in the course WhatsApp group and call for a strike.',
        isOptimal: false,
        consequence: 'This constitutes a serious disciplinary offense for disrespect and disruption, losing the legal validity of the academic claim.',
        articleReference: 'Art. 6 & 7 (Coexistence and Institutional Channels)',
        points: 0
      },
      {
        text: 'Politely request written formal feedback and, if disagreement persists, formally ask Coordination for review by a second instructor.',
        isOptimal: true,
        consequence: 'Excellent exercise of your rights! Agreement 009 guarantees the right to clear feedback and to request an impartial second evaluator when technical controversy exists.',
        articleReference: 'Art. 5 Item 13 (Right to Review and Second Evaluator)',
        points: 100
      },
      {
        text: 'Give up and pay someone else to make a new assignment.',
        isOptimal: false,
        consequence: 'Paying for academic assignments violates SENA ethics and abandons your rights to evaluation due process.',
        articleReference: 'Art. 5 & 6 (Comprehensive Training and Honesty)',
        points: 10
      }
    ]
  },
  {
    id: 'case-4',
    title: 'Workshop Safety and Mandatory PPE',
    category: 'Prohibiciones',
    context: 'Occupational Health and Safety (OHS)',
    scenario: 'In a mechanical workshop, it is very hot and an apprentice decides to take off safety glasses and gloves and roll up his sleeves near an industrial milling machine to feel cooler.',
    options: [
      {
        text: 'Let him work like that because everyone is free and responsible for their own body.',
        isOptimal: false,
        consequence: 'Puts physical safety at grave risk. OHS regulations at SENA are strictly mandatory.',
        articleReference: 'Art. 6 (Duty of PPE Usage and Self-care in Workshops)',
        points: 0
      },
      {
        text: 'Warn him that wearing PPE is mandatory and non-negotiable, and if unheeded, report to instructor or OHS delegate to stop work for safety.',
        isOptimal: true,
        consequence: 'Exemplary care and co-responsibility! At SENA, protecting life and following safety protocols saves lives.',
        articleReference: 'Art. 6 Item 10 & Art. 7 (Biosafety and OHS Rules)',
        points: 100
      },
      {
        text: 'Take a picture of him and post it on social media with mocking captions.',
        isOptimal: false,
        consequence: 'Violates the right to privacy and commits cyber harassment, constituting a disciplinary infraction.',
        articleReference: 'Art. 7 (Prohibition of Harassment and Bullying)',
        points: 0
      }
    ]
  },
  {
    id: 'case-5',
    title: 'Choosing a Productive Stage Pathway',
    category: 'Etapa Productiva',
    context: 'Transition from Schooling Stage to Practical Experience',
    scenario: 'Andrés is finishing his schooling phase. A company offers him a paid apprenticeship contract, but he also has an innovative tech startup idea that could apply for Fondo Emprender. What should he know?',
    options: [
      {
        text: 'Only Apprenticeship Contracts are valid; other modalities are not recognized by SENA.',
        isOptimal: false,
        consequence: 'Incorrect info: SENA recognizes multiple modalities including Productive Projects, Internships, Employment, and Tutoring.',
        articleReference: 'Productive Stage Chapter, Agreement 009 of 2024',
        points: 10
      },
      {
        text: 'He can consult with the Center\'s Corporate Relations and Entrepreneurship team to evaluate which option fits his life plan and register it properly.',
        isOptimal: true,
        consequence: 'Perfect! Apprentices have the right to choose among approved regulatory pathways with institutional guidance to guarantee graduation.',
        articleReference: 'Productive Stage Chapter (Selection Alternatives)',
        points: 100
      },
      {
        text: 'Sign the apprenticeship contract and simultaneously start the startup project without telling anyone.',
        isOptimal: false,
        consequence: 'Two simultaneous active productive stage modalities cannot be registered for the same program batch.',
        articleReference: 'SENA Productive Stage Registration Rules',
        points: 0
      }
    ]
  }
];

export const ASSESSMENT_QUESTIONS_EN: QuizQuestion[] = [
  {
    id: 1,
    category: 'General Regulations',
    question: 'What is the current regulatory framework governing apprentice rights, duties, and due process at SENA?',
    options: [
      'Agreement 009 of 2024 with amendments by Agreement 002 of 2026',
      'Agreement 007 of 2012 (unmodified)',
      'Resolution 100 of 1990',
      'National Police Code only'
    ],
    correctIndex: 0,
    explanation: 'The current regulatory framework consists of Agreement 009 of 2024 and its latest modification issued under Agreement 002 of 2026 by the SENA National Governing Board.',
    article: 'Agreement 009 of 2024 & Agreement 002 of 2026'
  },
  {
    id: 2,
    category: 'Apprentice Rights',
    question: 'If you disagree with an evaluation grade given on a learning evidence, what right assists you?',
    options: [
      'Blocking access to the training center',
      'Requesting written review from the instructor and, if controversy persists, appointment of an impartial second evaluator',
      'Demanding immediate dismissal of the instructor',
      'Editing the grade directly in the database'
    ],
    correctIndex: 1,
    explanation: 'Article 5 guarantees the right to objective evaluation review and an impartial second evaluator if justified controversy persists.',
    article: 'Art. 5, Apprentice Rights'
  },
  {
    id: 3,
    category: 'Apprentice Duties',
    question: 'What is the stipulated deadline to submit medical or force majeure proof for an absence?',
    options: [
      'Within 3 working days following return or event',
      'Up to 30 calendar days later',
      'At the graduation ceremony',
      'There is no deadline'
    ],
    correctIndex: 0,
    explanation: 'The mandatory deadline is 3 working days to formally file medical leaves or valid justifications.',
    article: 'Art. 6, Attendance and Justifications'
  },
  {
    id: 4,
    category: 'Prohibitions',
    question: 'Which of the following behaviors is expressly FORBIDDEN within SENA environments under Agreement 009?',
    options: [
      'Participating in Sennova research incubators',
      'Political or religious proselytism and acts of discrimination or harassment',
      'Borrowing technical books in the library',
      'Running for batch spokesperson'
    ],
    correctIndex: 1,
    explanation: 'Agreement 009 strictly prohibits political or religious proselytism and severely sanctions any form of discrimination or harassment.',
    article: 'Art. 7, Express Prohibitions'
  },
  {
    id: 5,
    category: 'Formative Measures',
    question: 'What is the fundamental difference between a Formative Measure and a Disciplinary Sanction?',
    options: [
      'There is no difference; they are identical terms',
      'Formative measures are pedagogical and seek performance improvement; sanctions are corrective measures after Committee due process',
      'Sanctions are paid by parents in cash',
      'Formative measures involve preventative detention'
    ],
    correctIndex: 1,
    explanation: 'Formative measures (verbal advice, improvement plans) are pedagogical; sanctions are formal corrective decisions decided by Committee.',
    article: 'Chapter on Formative Measures and Sanctions'
  },
  {
    id: 6,
    category: 'Apprentice Rights',
    question: 'What guarantee do apprentices with disabilities or special needs have under the new rulebook?',
    options: [
      'They cannot enroll in technical training',
      'The right to request and receive reasonable accommodations in methodology, resources, and accessibility',
      'They must hire their own private tutor',
      'They can only take 2-week programs'
    ],
    correctIndex: 1,
    explanation: 'Agreement 009 strengthens inclusion by expressly recognizing the right to reasonable accommodations to ensure equal opportunities.',
    article: 'Art. 5, Inclusion and Reasonable Accommodations'
  },
  {
    id: 7,
    category: 'Productive Stage',
    question: 'Which of the following is NOT a valid modality recognized by SENA for the Productive Stage?',
    options: [
      'Apprenticeship Contract (Contrato de Aprendizaje)',
      'Productive Project or Fondo Emprender business',
      'Internship or formal Employment related to the field of study',
      'Informal unrelated labor without academic coordination approval'
    ],
    correctIndex: 3,
    explanation: 'All productive stage modalities must be directly related to program competencies and have institutional endorsement and monitoring.',
    article: 'Chapter on Productive Stage'
  },
  {
    id: 8,
    category: 'Coexistence and Symbols',
    question: 'What duty does an apprentice have regarding their ID badge and institutional identity within the Center?',
    options: [
      'Wear it visibly at all times for security and community coexistence',
      'Lend it to outside friends to let them enter',
      'Leave it at home so it does not wear out',
      'Modify the photo with digital filters before showing it'
    ],
    correctIndex: 0,
    explanation: 'Visible wearing of the institutional ID badge is a regulatory duty protecting community safety across all SENA facilities.',
    article: 'Art. 6, Institutional Duties'
  },
  {
    id: 9,
    category: 'Evaluation Committee and Due Process',
    question: 'Under Article 48 modified by Agreement 002 of 2026, how is due process guaranteed before the Evaluation Committee?',
    options: [
      'Through two separate technical teams for review and investigation, plus active student representative participation',
      'Through automatic sanctions without hearing defense or reviewing evidence',
      'By delegating decisions to a private security firm',
      'By expelling the learner before the hearing starts'
    ],
    correctIndex: 0,
    explanation: 'Agreement 002 of 2026 reformed Article 48, establishing two distinct technical teams to document cases objectively, ensuring apprentice representation and due process.',
    article: 'Art. 48 modified by Agreement 002 of 2026'
  },
  {
    id: 10,
    category: 'Certification',
    question: 'To obtain official certification and your vocational degree at SENA, what is required?',
    options: [
      'Passing 100% of learning outcomes in schooling and productive stages, plus institutional clearance',
      'Attending only 50% of theoretical classes',
      'Paying a graduation fee at the administrative office',
      'Winning all video game tournaments at the center'
    ],
    correctIndex: 0,
    explanation: 'Degree certificates are free and awarded upon completing 100% of learning competencies for both stages and clearing all institutional obligations.',
    article: 'Chapter on Certification and Degrees'
  }
];

export const BADGES_LIST_EN: Badge[] = [
  {
    id: 'badge-1',
    name: 'SENA Identity',
    description: 'Completed Module 1 on Mission, Values, and Apprentice Welfare.',
    iconName: 'Award',
    unlockedAtXp: 150
  },
  {
    id: 'badge-2',
    name: 'Rights Defender',
    description: 'Understood guarantees and rights under Article 5 of Agreement 009.',
    iconName: 'ShieldCheck',
    unlockedAtXp: 350
  },
  {
    id: 'badge-3',
    name: 'Exemplary Citizen',
    description: 'Mastered ethical duties, punctuality, and educational responsibility.',
    iconName: 'HeartHandshake',
    unlockedAtXp: 550
  },
  {
    id: 'badge-4',
    name: 'Coexistence Leader',
    description: 'Learned prohibitions, due process, and institutional culture of peace.',
    iconName: 'Users',
    unlockedAtXp: 800
  },
  {
    id: 'badge-5',
    name: 'Heading to Practice',
    description: 'Mastered practical stage modalities and graduation requirements.',
    iconName: 'Briefcase',
    unlockedAtXp: 1000
  },
  {
    id: 'badge-6',
    name: 'Ethical Strategist',
    description: 'Solved the 5 real apprentice dilemmas applying official regulations.',
    iconName: 'Compass',
    unlockedAtXp: 1300
  },
  {
    id: 'badge-7',
    name: 'Rulebook Master',
    description: 'Passed the final assessment with honors (80%+). Certificate issued.',
    iconName: 'GraduationCap',
    unlockedAtXp: 1600
  }
];

export const getInductionModules = (lang: 'es' | 'en' = 'es'): InductionModule[] => {
  return lang === 'en' ? INDUCTION_MODULES_EN : INDUCTION_MODULES;
};

export const getCaseDilemmas = (lang: 'es' | 'en' = 'es'): CaseDilemma[] => {
  return lang === 'en' ? CASE_DILEMMAS_EN : CASE_DILEMMAS;
};

export const getAssessmentQuestions = (lang: 'es' | 'en' = 'es'): QuizQuestion[] => {
  return lang === 'en' ? ASSESSMENT_QUESTIONS_EN : ASSESSMENT_QUESTIONS;
};

export const getBadgesList = (lang: 'es' | 'en' = 'es'): Badge[] => {
  return lang === 'en' ? BADGES_LIST_EN : BADGES_LIST;
};
