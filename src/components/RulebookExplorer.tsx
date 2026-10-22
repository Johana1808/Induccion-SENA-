import React, { useState, useMemo } from 'react';
import { Search, Scale, Bookmark, Check, Shield, AlertOctagon, HelpCircle } from 'lucide-react';
import { t } from '../utils/i18n';

interface RuleItem {
  id: string;
  category: 'Derechos' | 'Deberes' | 'Prohibiciones' | 'Medidas y Sanciones' | 'Etapa Productiva' | 'Rights' | 'Duties' | 'Prohibitions' | 'Measures & Sanctions' | 'Productive Stage';
  title: string;
  article: string;
  summary: string;
  details: string;
  tags: string[];
}

const REGULATION_DATABASE_ES: RuleItem[] = [
  {
    id: 'reg-1',
    category: 'Derechos',
    title: 'Inducción Integral y Oportuna',
    article: 'Artículo 5, Numeral 1',
    summary: 'Derecho a recibir una inducción completa al inicio del programa de formación.',
    details: 'Todo aprendiz tiene derecho a ser informado con claridad sobre el reglamento del aprendiz, la misión institucional del SENA, el diseño curricular del programa, el uso de las plataformas virtuales de aprendizaje (Zajuna) y los servicios de bienestar al aprendiz.',
    tags: ['inducción', 'inicio', 'zajuna', 'bienestar']
  },
  {
    id: 'reg-2',
    category: 'Derechos',
    title: 'Evaluación Objetiva y Retroalimentación en 8 Días',
    article: 'Artículo 5, Numeral 12',
    summary: 'Conocer las valoraciones y comentarios formativos en un plazo máximo de 8 días hábiles.',
    details: 'El aprendiz tiene el derecho a que sus evidencias sean valoradas con criterios pedagógicos claros y a recibir la retroalimentación cualitativa dentro de los ocho (8) días hábiles siguientes a la entrega.',
    tags: ['evaluación', 'calificación', 'plazo', '8 días', 'notas']
  },
  {
    id: 'reg-3',
    category: 'Derechos',
    title: 'Derecho a Revisión y Segundo Calificador',
    article: 'Artículo 5, Numeral 13',
    summary: 'Garantía de pedir revisión justificada si existe desacuerdo con una calificación.',
    details: 'Si el aprendiz no está conforme con la evaluación recibida, tiene derecho a solicitar por escrito la revisión argumentada. Si persiste la controversia, la Coordinación Académica designará un segundo instructor calificador imparcial.',
    tags: ['revisión', 'segundo evaluador', 'debido proceso', 'calificación']
  },
  {
    id: 'reg-4',
    category: 'Derechos',
    title: 'Ajustes Razonables e Inclusión',
    article: 'Artículo 5, Numeral 8',
    summary: 'Derecho a adecuaciones metodológicas y accesibilidad para aprendices con discapacidad.',
    details: 'Los aprendices en condición de discapacidad o con barreras de aprendizaje tienen derecho a que el SENA implemente ajustes razonables en entornos físicos, plataformas digitales y estrategias pedagógicas.',
    tags: ['inclusión', 'discapacidad', 'ajustes razonables', 'accesibilidad']
  },
  {
    id: 'reg-5',
    category: 'Derechos',
    title: 'Acceso a Ambientes y Recursos de Formación',
    article: 'Artículo 5, Numeral 4',
    summary: 'Uso de talleres, maquinaria, simuladores, bibliotecas físicas y digitales.',
    details: 'El aprendiz goza del derecho a disponer oportunamente de la infraestructura técnica y tecnológica disponible en el Centro de Formación para el desarrollo de sus competencias.',
    tags: ['ambientes', 'talleres', 'laboratorios', 'biblioteca']
  },
  {
    id: 'reg-6',
    category: 'Deberes',
    title: 'Justificación de Inasistencias en 3 Días Hábiles',
    article: 'Artículo 6, Numeral 5',
    summary: 'Presentar soporte de incapacidad médica o fuerza mayor oportunamente.',
    details: 'En caso de no poder asistir a actividades presenciales o virtuales, el aprendiz debe radicar formalmente ante el instructor y coordinación el soporte idóneo dentro de los tres (3) días hábiles siguientes.',
    tags: ['asistencia', 'inasistencia', '3 días', 'justificación', 'médico']
  },
  {
    id: 'reg-7',
    category: 'Deberes',
    title: 'Porte Permanente y Visible del Carné',
    article: 'Artículo 6, Numeral 9',
    summary: 'Identificación obligatoria para la seguridad institucional.',
    details: 'Portar el carné institucional visible durante la permanencia en las sedes del SENA o en actividades formativas externas, y no permitir su uso indebido o préstamo a terceros.',
    tags: ['carné', 'identificación', 'seguridad', 'acceso']
  },
  {
    id: 'reg-8',
    category: 'Deberes',
    title: 'Uso de EPP y Protocolos de Seguridad (SST)',
    article: 'Artículo 6, Numeral 10',
    summary: 'Cumplir estrictamente con normas de seguridad y salud en el trabajo.',
    details: 'Utilizar los elementos de protección personal (gafas, botas, overol, guantes) en talleres y laboratorios, y acatar las órdenes de seguridad industrial para prevenir accidentes.',
    tags: ['epp', 'seguridad', 'salud', 'talleres', 'laboratorios']
  },
  {
    id: 'reg-9',
    category: 'Deberes',
    title: 'Cuidado del Medio Ambiente y Gestión de Residuos',
    article: 'Artículo 6, Numeral 14',
    summary: 'Acatar el Plan de Gestión Ambiental del Centro.',
    details: 'Hacer uso responsable del agua y energía eléctrica, realizar la correcta separación de residuos sólidos en los puntos ecológicos y respetar las áreas verdes de los centros de formación.',
    tags: ['ambiente', 'reciclaje', 'ecología', 'residuos']
  },
  {
    id: 'reg-10',
    category: 'Prohibiciones',
    title: 'Prohibición de Plagio y Fraude Académico',
    article: 'Artículo 7, Numeral 1 y 2',
    summary: 'Tolerancia cero con la copia indebida y la alteración de evidencias.',
    details: 'Se prohíbe copiar total o parcialmente trabajos, códigos fuente, informes o proyectos ajenos sin la debida citación técnica, así como cometer fraude en cuestionarios o evaluaciones.',
    tags: ['plagio', 'fraude', 'copia', 'honestidad']
  },
  {
    id: 'reg-11',
    category: 'Prohibiciones',
    title: 'Prohibición de Acoso, Discriminación y Matoneo',
    article: 'Artículo 7, Numeral 6',
    summary: 'Protección absoluta de la dignidad y la diversidad comunitaria.',
    details: 'Está terminantemente prohibido incurrir en actos de hostigamiento, acoso sexual, matoneo físico o virtual (ciberacoso) o discriminación por razones de etnia, género, religión u orientación sexual.',
    tags: ['acoso', 'discriminación', 'matoneo', 'respeto', 'género']
  },
  {
    id: 'reg-12',
    category: 'Prohibiciones',
    title: 'Sustancias Psicoactivas, Alcohol y Armas',
    article: 'Artículo 7, Numeral 4 y 5',
    summary: 'Vetado el ingreso, porte o consumo de armas y estupefacientes.',
    details: 'Ingresar, comercializar, portar o consumir bebidas alcohólicas, sustancias psicoactivas o armas de cualquier tipo dentro del SENA o asistir bajo sus efectos está tipificado como falta gravísima.',
    tags: ['alcohol', 'drogas', 'armas', 'seguridad', 'falta gravísima']
  },
  {
    id: 'reg-13',
    category: 'Medidas y Sanciones',
    title: 'Plan de Mejoramiento Pedagógico',
    article: 'Capítulo de Medidas Formativas',
    summary: 'Estrategia pedagógica concertada para nivelar aprendizajes.',
    details: 'Medida formativa que acuerda el instructor con el aprendiz para superar dificultades académicas o actitudinales antes de elevar el caso a instancia sancionatoria.',
    tags: ['plan de mejoramiento', 'pedagógico', 'medida formativa', 'nivelación']
  },
  {
    id: 'reg-14',
    category: 'Medidas y Sanciones',
    title: 'Comité de Evaluación y Debido Proceso',
    article: 'Capítulo de Régimen Disciplinario',
    summary: 'Órgano colegiado que analiza faltas garantizando el derecho a la defensa.',
    details: 'El comité evalúa los casos reportados, escucha los descargos del aprendiz con presencia del vocero, analiza pruebas y recomienda al Subdirector de Centro las medidas o sanciones pertinentes.',
    tags: ['comité', 'debido proceso', 'descargos', 'defensa', 'vocero']
  },
  {
    id: 'reg-15',
    category: 'Etapa Productiva',
    title: 'Modalidades de Etapa Productiva Reconocidas',
    article: 'Capítulo de Etapa Productiva',
    summary: 'Alternativas formales para aplicar conocimientos en el entorno real.',
    details: 'Comprende: Contrato de Aprendizaje, Proyecto Productivo (Fondo Emprender), Vínculo Laboral o Contractual, Pasantías y Monitorías en el SENA.',
    tags: ['etapa productiva', 'contrato de aprendizaje', 'pasantía', 'proyecto productivo']
  },
  {
    id: 'reg-16',
    category: 'Medidas y Sanciones',
    title: 'Artículo 48: Debido Proceso y Comités (Modificado por Acuerdo 002 de 2026)',
    article: 'Artículo 48 (Modificado por Acuerdo 002 de 2026)',
    summary: 'Dos equipos técnicos para instruir casos y mayor participación activa de los aprendices en el Comité.',
    details: 'El Acuerdo 002 de 2026 reformó el Artículo 48 del reglamento del aprendiz estableciendo que, para garantizar plenamente el debido proceso, existirán dos equipos técnicos encargados de revisar, analizar y documentar objetivamente los casos, fortaleciendo el asiento y voz del vocero o representante estudiantil en las sesiones de deliberación del Comité.',
    tags: ['artículo 48', 'acuerdo 002 de 2026', 'debido proceso', 'comité', 'defensa', 'vocero', 'equipos técnicos', '2026']
  }
];

const REGULATION_DATABASE_EN: RuleItem[] = [
  {
    id: 'reg-1',
    category: 'Rights',
    title: 'Comprehensive and Timely Induction',
    article: 'Article 5, Item 1',
    summary: 'Right to receive a complete induction at the beginning of the program.',
    details: 'Every apprentice has the right to be clearly informed about the rulebook, SENA’s mission, program curricular design, virtual learning platforms (Zajuna), and apprentice welfare services.',
    tags: ['induction', 'orientation', 'zajuna', 'welfare']
  },
  {
    id: 'reg-2',
    category: 'Rights',
    title: 'Objective Evaluation & Feedback within 8 Days',
    article: 'Article 5, Item 12',
    summary: 'Receive grades and constructive feedback within 8 working days.',
    details: 'Apprentices have the right to have their evidence evaluated with clear pedagogical criteria and to receive qualitative feedback within eight (8) working days following submission.',
    tags: ['evaluation', 'grades', 'deadline', '8 days', 'feedback']
  },
  {
    id: 'reg-3',
    category: 'Rights',
    title: 'Right to Review and Impartial Second Evaluator',
    article: 'Article 5, Item 13',
    summary: 'Guarantee to request a review if there is disagreement with an evaluation.',
    details: 'If dissatisfied with an assessment, the learner can file a written request for review. If controversy persists, the Academic Coordination will appoint an impartial second evaluator.',
    tags: ['review', 'second evaluator', 'due process', 'appeal']
  },
  {
    id: 'reg-4',
    category: 'Rights',
    title: 'Reasonable Accommodations and Inclusion',
    article: 'Article 5, Item 8',
    summary: 'Right to pedagogical adjustments and accessibility for learners with disabilities.',
    details: 'Learners with disabilities or learning barriers are entitled to reasonable accommodations across facilities, digital platforms, and teaching methods.',
    tags: ['inclusion', 'disability', 'reasonable accommodations', 'accessibility']
  },
  {
    id: 'reg-5',
    category: 'Rights',
    title: 'Access to Training Environments and Resources',
    article: 'Article 5, Item 4',
    summary: 'Use of workshops, machinery, simulators, and libraries.',
    details: 'Apprentices have the right to timely utilize technical and technological infrastructure available at the Training Center to build competencies.',
    tags: ['environments', 'workshops', 'laboratories', 'library']
  },
  {
    id: 'reg-6',
    category: 'Duties',
    title: 'Absence Justification within 3 Working Days',
    article: 'Article 6, Item 5',
    summary: 'Submit proof of medical illness or force majeure promptly.',
    details: 'If unable to attend in-person or virtual training, apprentices must submit formal documentation within three (3) working days to the instructor and coordination.',
    tags: ['attendance', 'absence', '3 days', 'justification', 'medical']
  },
  {
    id: 'reg-7',
    category: 'Duties',
    title: 'Permanent and Visible Wearing of ID Badge',
    article: 'Article 6, Item 9',
    summary: 'Mandatory identification for institutional security.',
    details: 'Visibly wear the institutional ID badge throughout your stay at SENA facilities or during official external activities, without lending it to third parties.',
    tags: ['id badge', 'identification', 'security', 'access']
  },
  {
    id: 'reg-8',
    category: 'Duties',
    title: 'Use of PPE and Safety Protocols (OHS)',
    article: 'Article 6, Item 10',
    summary: 'Strictly follow occupational health and safety standards.',
    details: 'Wear required personal protective equipment (safety glasses, boots, overalls, gloves) in technical workshops and follow industrial safety directives.',
    tags: ['ppe', 'safety', 'health', 'workshops', 'labs']
  },
  {
    id: 'reg-9',
    category: 'Duties',
    title: 'Environmental Care and Waste Management',
    article: 'Article 6, Item 14',
    summary: 'Comply with the Center’s Environmental Management Plan.',
    details: 'Responsible use of water and electricity, proper waste sorting in designated ecological bins, and respect for green areas across training centers.',
    tags: ['environment', 'recycling', 'ecology', 'waste']
  },
  {
    id: 'reg-10',
    category: 'Prohibitions',
    title: 'Prohibition of Plagiarism and Academic Fraud',
    article: 'Article 7, Items 1 & 2',
    summary: 'Zero tolerance for improper copying or evidence alteration.',
    details: 'Total or partial copying of outside code, reports, or research without proper technical citation, or cheating on exams, is strictly prohibited.',
    tags: ['plagiarism', 'fraud', 'copying', 'honesty']
  },
  {
    id: 'reg-11',
    category: 'Prohibitions',
    title: 'Prohibition of Harassment, Bullying, Discrimination',
    article: 'Article 7, Item 6',
    summary: 'Absolute protection of dignity and community diversity.',
    details: 'Strictly prohibited to commit acts of harassment, sexual harassment, physical or cyberbullying, or discrimination based on race, gender, religion, or sexual orientation.',
    tags: ['harassment', 'discrimination', 'bullying', 'respect']
  },
  {
    id: 'reg-12',
    category: 'Prohibitions',
    title: 'Narcotics, Alcohol and Weapons Prohibited',
    article: 'Article 7, Items 4 & 5',
    summary: 'Ban on entering, carrying, or consuming weapons or drugs.',
    details: 'Entering, trading, carrying, or using alcoholic beverages, drugs, or weapons inside SENA, or attending under their influence, is classified as a very grave infraction.',
    tags: ['alcohol', 'drugs', 'weapons', 'safety', 'grave infraction']
  },
  {
    id: 'reg-13',
    category: 'Measures & Sanctions',
    title: 'Pedagogical Improvement Plan',
    article: 'Chapter on Formative Measures',
    summary: 'Agreed pedagogical strategy to level up learning outcomes.',
    details: 'A formative plan agreed between instructor and apprentice to overcome academic or behavioral hurdles before escalating to disciplinary committees.',
    tags: ['improvement plan', 'pedagogical', 'formative measure', 'support']
  },
  {
    id: 'reg-14',
    category: 'Measures & Sanctions',
    title: 'Evaluation Committee and Due Process',
    article: 'Chapter on Disciplinary Regime',
    summary: 'Collegial body analyzing infractions while guaranteeing the right to defense.',
    details: 'The committee evaluates reported cases, hears student defense in the presence of the batch spokesperson, reviews evidence, and advises the Center Subdirector.',
    tags: ['committee', 'due process', 'defense', 'hearing', 'spokesperson']
  },
  {
    id: 'reg-15',
    category: 'Productive Stage',
    title: 'Recognized Productive Stage Modalities',
    article: 'Chapter on Productive Stage',
    summary: 'Formal pathways to apply competencies in real work environments.',
    details: 'Includes: Apprenticeship Contract, Productive Project (Fondo Emprender), Employment Contract, Internships, and Peer-tutoring at SENA.',
    tags: ['productive stage', 'apprenticeship contract', 'internship', 'project']
  },
  {
    id: 'reg-16',
    category: 'Measures & Sanctions',
    title: 'Article 48: Due Process & Committees (Modified 2026)',
    article: 'Article 48 (Modified by Agreement 002 of 2026)',
    summary: 'Two technical teams to investigate cases and strengthened student representation.',
    details: 'Agreement 002 of 2026 reformed Article 48, establishing two distinct technical teams to review, analyze, and objectively document cases, strengthening the active voice of student spokespersons in committee hearings.',
    tags: ['article 48', 'agreement 002 of 2026', 'due process', 'committee', 'defense', 'technical teams', '2026']
  }
];

interface RulebookExplorerProps {
  lang?: 'es' | 'en';
}

export const RulebookExplorer: React.FC<RulebookExplorerProps> = ({
  lang = 'es',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = lang === 'en'
    ? ['All', 'Rights', 'Duties', 'Prohibitions', 'Measures & Sanctions', 'Productive Stage']
    : ['Todos', 'Derechos', 'Deberes', 'Prohibiciones', 'Medidas y Sanciones', 'Etapa Productiva'];

  const database = lang === 'en' ? REGULATION_DATABASE_EN : REGULATION_DATABASE_ES;

  const filteredRules = useMemo(() => {
    return database.filter(item => {
      const isAll = activeCategory === 'Todos' || activeCategory === 'All';
      const matchesCategory = isAll || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesText = 
        item.title.toLowerCase().includes(q) ||
        item.article.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.tags.some(tg => tg.toLowerCase().includes(q));

      return matchesCategory && matchesText;
    });
  }, [searchQuery, activeCategory, database]);

  return (
    <div className="space-y-6">
      
      {/* Header and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{lang === 'en' ? 'Current Regulatory Digest' : 'Compendio Normativo Vigente'}</span>
            <span>·</span>
            <span>{t[lang].subtitle}</span>
            <span>·</span>
            <span>{lang === 'en' ? 'Quick Reference for Apprentices' : 'Consulta Rápida para Aprendices'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {lang === 'en' ? 'SENA Apprentice Rulebook Explorer' : 'Explorador del Reglamento del Aprendiz SENA'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {lang === 'en' ? 'Search any keyword, article, or situation to discover official regulatory backing.' : 'Busca cualquier término clave, artículo o situación para conocer el respaldo reglamentario oficial.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t[lang].rulebookSearchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-medium"
            >
              {lang === 'en' ? 'Clear' : 'Limpiar'}
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat || (activeCategory === 'All' && cat === 'Todos') || (activeCategory === 'Todos' && cat === 'All')
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count and List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-mono">
          <span>{lang === 'en' ? `Showing ${filteredRules.length} articles found` : `Mostrando ${filteredRules.length} artículos encontrados`}</span>
          {searchQuery && (
            <span>{lang === 'en' ? `Filtered by: "${searchQuery}"` : `Filtrado por: "${searchQuery}"`}</span>
          )}
        </div>

        {filteredRules.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {lang === 'en' ? 'No articles matched that query.' : 'No se encontraron artículos con ese criterio.'}
            </p>
            <p className="text-xs">
              {lang === 'en' ? 'Try searching for "evaluation", "attendance", "rights", or clear search.' : 'Prueba con palabras como "evaluación", "asistencia", "derechos" o limpia la búsqueda.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => {
              let badgeColor = "text-emerald-700 dark:text-emerald-400";
              if (rule.category === 'Prohibiciones' || rule.category === 'Prohibitions') badgeColor = "text-rose-700 dark:text-rose-400";
              if (rule.category === 'Deberes' || rule.category === 'Duties') badgeColor = "text-blue-700 dark:text-blue-400";
              if (rule.category === 'Medidas y Sanciones' || rule.category === 'Measures & Sanctions') badgeColor = "text-amber-700 dark:text-amber-400";

              return (
                <div
                  key={rule.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className={`font-semibold ${badgeColor}`}>{rule.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">{rule.article}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {rule.title}
                    </h3>

                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {rule.summary}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                      {rule.details}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="text-slate-500 dark:text-slate-400">{t[lang].relatedTags}:</span>
                    {rule.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-slate-600 dark:text-slate-400">
                        #{tag}{tIdx < rule.tags.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
