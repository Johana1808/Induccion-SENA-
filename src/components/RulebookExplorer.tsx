import React, { useState, useMemo } from 'react';
import { Search, Scale, Bookmark, Check, Shield, AlertOctagon, HelpCircle } from 'lucide-react';

interface RuleItem {
  id: string;
  category: 'Derechos' | 'Deberes' | 'Prohibiciones' | 'Medidas y Sanciones' | 'Etapa Productiva';
  title: string;
  article: string;
  summary: string;
  details: string;
  tags: string[];
}

const REGULATION_DATABASE: RuleItem[] = [
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

export const RulebookExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Derechos', 'Deberes', 'Prohibiciones', 'Medidas y Sanciones', 'Etapa Productiva'];

  const filteredRules = useMemo(() => {
    return REGULATION_DATABASE.filter(item => {
      const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesText = 
        item.title.toLowerCase().includes(q) ||
        item.article.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesText;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-6">
      
      {/* Header and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Compendio Normativo Vigente</span>
            <span>·</span>
            <span>Acuerdo 009 de 2024 (Modificado por Acuerdo 002 de 2026)</span>
            <span>·</span>
            <span>Consulta Rápida para Aprendices</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Explorador del Reglamento del Aprendiz SENA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Busca cualquier término clave, artículo o situación para conocer el respaldo reglamentario oficial.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por palabra clave (ej. 'inasistencia', 'revisión', 'plagio', 'epp', '8 días')..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-medium"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Category Filters (Interactive buttons, allowed per frontend design constitution) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
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
          <span>Mostrando {filteredRules.length} artículos encontrados</span>
          {searchQuery && (
            <span>Filtrado por: "{searchQuery}"</span>
          )}
        </div>

        {filteredRules.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No se encontraron artículos con ese criterio.</p>
            <p className="text-xs">Prueba con palabras como "evaluación", "asistencia", "derechos" o limpia la búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => {
              let badgeColor = "text-emerald-700 dark:text-emerald-400";
              if (rule.category === 'Prohibiciones') badgeColor = "text-rose-700 dark:text-rose-400";
              if (rule.category === 'Deberes') badgeColor = "text-blue-700 dark:text-blue-400";
              if (rule.category === 'Medidas y Sanciones') badgeColor = "text-amber-700 dark:text-amber-400";

              return (
                <div
                  key={rule.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    {/* Unboxed metadata per constitution */}
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

                  {/* Clean unboxed tags */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="text-slate-500 dark:text-slate-400">Palabras clave:</span>
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
