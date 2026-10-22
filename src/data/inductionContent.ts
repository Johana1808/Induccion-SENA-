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
