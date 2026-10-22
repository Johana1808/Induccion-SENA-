import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Award, 
  Scale, 
  Clock, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { InductionModule, getInductionModules } from '../data/inductionContent';
import { t } from '../utils/i18n';

interface ModuleViewerProps {
  completedModules: string[];
  onCompleteModule: (moduleId: string, xpGain: number) => void;
  onGoToDilemmas: () => void;
  lang?: 'es' | 'en';
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  completedModules,
  onCompleteModule,
  onGoToDilemmas,
  lang = 'es',
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [selectedQuickAnswer, setSelectedQuickAnswer] = useState<number | null>(null);
  const [quickCheckAnswered, setQuickCheckAnswered] = useState<boolean>(false);

  const modulesList = getInductionModules(lang);
  const currentModule: InductionModule = modulesList[activeModuleIndex] || modulesList[0];
  const isModuleCompleted = completedModules.includes(currentModule.id);

  const handleSelectAnswer = (index: number) => {
    if (quickCheckAnswered) return;
    setSelectedQuickAnswer(index);
    setQuickCheckAnswered(true);

    if (index === currentModule.quickCheck.correctIndex && !isModuleCompleted) {
      onCompleteModule(currentModule.id, currentModule.xpReward);
    }
  };

  const handleNextModule = () => {
    if (activeModuleIndex < modulesList.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
      setSelectedQuickAnswer(null);
      setQuickCheckAnswered(false);
    } else {
      onGoToDilemmas();
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(prev => prev - 1);
      setSelectedQuickAnswer(null);
      setQuickCheckAnswered(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Selector Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 px-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t[lang].trainingRoute}
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {completedModules.length} {lang === 'en' ? 'of' : 'de'} {modulesList.length} {t[lang].approvedOf}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {modulesList.map((mod, idx) => {
            const isCompleted = completedModules.includes(mod.id);
            const isActive = idx === activeModuleIndex;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModuleIndex(idx);
                  setSelectedQuickAnswer(null);
                  setQuickCheckAnswered(false);
                }}
                className={`p-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-xs'
                    : isCompleted
                    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold">{t[lang].moduleNumber} 0{mod.number}</span>
                  {isCompleted ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                </div>
                <div className="text-xs font-medium line-clamp-1 text-slate-700 dark:text-slate-300">
                  {mod.title.split(' ')[0]} {mod.title.split(' ')[1] || ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        
        {/* Module Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">{t[lang].moduleNumber} 0{currentModule.number}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentModule.readingTime}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                +{currentModule.xpReward} XP
              </span>
            </div>

            {isModuleCompleted && (
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {t[lang].completed}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {currentModule.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {currentModule.shortDesc}
          </p>
        </div>

        {/* Module Content Sections */}
        <div className="p-6 space-y-8">
          {currentModule.sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  {sIdx + 1}
                </div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  {sec.title}
                </h4>
              </div>

              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Highlights & Key Takeaways */}
              {sec.highlights && sec.highlights.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    {t[lang].highlightsLabel}:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {sec.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal Reference */}
              {sec.legalReference && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                  <Scale className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{t[lang].legalReferenceLabel}: <strong className="text-slate-700 dark:text-slate-200">{sec.legalReference}</strong></span>
                </div>
              )}
            </div>
          ))}

          {/* Quick Interactive Checkpoint for XP */}
          <div className="p-5 sm:p-6 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
                <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h4 className="text-sm font-bold">
                  {t[lang].quickCheckTitle}
                </h4>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-400">
                +{currentModule.xpReward} XP
              </span>
            </div>

            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {currentModule.quickCheck.question}
            </p>

            <div className="space-y-2">
              {currentModule.quickCheck.options.map((opt, oIdx) => {
                const isSelected = selectedQuickAnswer === oIdx;
                const isCorrect = oIdx === currentModule.quickCheck.correctIndex;

                let stateClasses = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600";
                if (quickCheckAnswered) {
                  if (isCorrect) {
                    stateClasses = "bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 font-medium";
                  } else if (isSelected) {
                    stateClasses = "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200";
                  } else {
                    stateClasses = "bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(oIdx)}
                    disabled={quickCheckAnswered}
                    className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${stateClasses}`}
                  >
                    <span>{opt}</span>
                    {quickCheckAnswered && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quickCheckAnswered && (
              <div className={`p-3.5 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                selectedQuickAnswer === currentModule.quickCheck.correctIndex
                  ? 'bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
              }`}>
                <p className="font-semibold mb-1">
                  {selectedQuickAnswer === currentModule.quickCheck.correctIndex
                    ? `${t[lang].correctAnswer} ${lang === 'en' ? 'You completed this module.' : 'Has acreditado este módulo.'}`
                    : (lang === 'en' ? 'Review the correct answer:' : 'Revisa la respuesta correcta:')}
                </p>
                <p>{currentModule.quickCheck.explanation}</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevModule}
            disabled={activeModuleIndex === 0}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              activeModuleIndex === 0
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t[lang].prevModule}
          </button>

          <button
            onClick={handleNextModule}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>
              {activeModuleIndex < modulesList.length - 1
                ? t[lang].nextModule
                : t[lang].goToDilemmas}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
