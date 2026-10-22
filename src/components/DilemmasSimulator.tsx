import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Scale, 
  ArrowRight, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { CaseDilemma, getCaseDilemmas } from '../data/inductionContent';
import { t } from '../utils/i18n';

interface DilemmasSimulatorProps {
  solvedDilemmas: Record<string, number>; // dilemmaId -> chosenOptionIndex
  onSolveDilemma: (dilemmaId: string, optionIndex: number, points: number) => void;
  onGoToQuiz: () => void;
  lang?: 'es' | 'en';
}

export const DilemmasSimulator: React.FC<DilemmasSimulatorProps> = ({
  solvedDilemmas,
  onSolveDilemma,
  onGoToQuiz,
  lang = 'es',
}) => {
  const dilemmasList = getCaseDilemmas(lang);
  const [activeDilemmaId, setActiveDilemmaId] = useState<string>(dilemmasList[0].id);

  const activeDilemma = dilemmasList.find(d => d.id === activeDilemmaId) || dilemmasList[0];
  const chosenIndex = solvedDilemmas[activeDilemma.id] !== undefined ? solvedDilemmas[activeDilemma.id] : null;
  const isSolved = chosenIndex !== null;

  const totalSolvedCount = Object.keys(solvedDilemmas).length;
  const allSolved = totalSolvedCount === dilemmasList.length;

  const handleSelectOption = (index: number) => {
    if (isSolved) return;
    const opt = activeDilemma.options[index];
    onSolveDilemma(activeDilemma.id, index, opt.points);
  };

  const handleNextDilemma = () => {
    const currentIndex = dilemmasList.findIndex(d => d.id === activeDilemmaId);
    if (currentIndex < dilemmasList.length - 1) {
      setActiveDilemmaId(dilemmasList[currentIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t[lang].dilemmaSimulatorTag}</span>
            <span aria-hidden="true">·</span>
            <span>{t[lang].dilemmaRealCases}</span>
            <span aria-hidden="true">·</span>
            <span>{t[lang].subtitle}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t[lang].dilemmasTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {t[lang].dilemmasSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-xs text-slate-500 dark:text-slate-400">{t[lang].dilemmasSolved}</span>
            <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {totalSolvedCount} {lang === 'en' ? 'of' : 'de'} {dilemmasList.length}
            </span>
          </div>
          {allSolved && (
            <button
              onClick={onGoToQuiz}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{t[lang].goToQuizBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dilemma Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {dilemmasList.map((dilemma, idx) => {
          const isCaseSolved = solvedDilemmas[dilemma.id] !== undefined;
          const isCurrent = dilemma.id === activeDilemmaId;
          const userChoice = solvedDilemmas[dilemma.id];
          const isOptimalChoice = userChoice !== undefined ? dilemma.options[userChoice]?.isOptimal : false;

          return (
            <button
              key={dilemma.id}
              onClick={() => setActiveDilemmaId(dilemma.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-xs ring-1 ring-emerald-600 dark:ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'en' ? 'Case' : 'Caso'} 0{idx + 1}
                </span>
                {isCaseSolved ? (
                  isOptimalChoice ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )
                ) : (
                  <HelpCircle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                {dilemma.title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {dilemma.category}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dilemma Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        
        {/* Scenario Header */}
        <div className="p-6 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
              {lang === 'en' ? 'Category' : 'Eje Temático'}: {activeDilemma.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {lang === 'en' ? 'Context' : 'Contexto'}: {activeDilemma.context}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeDilemma.title}
          </h3>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800">
            {activeDilemma.scenario}
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t[lang].whatWouldYouDo}
          </h4>

          <div className="space-y-3">
            {activeDilemma.options.map((option, oIdx) => {
              const isSelected = chosenIndex === oIdx;

              let cardStyle = "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200";
              if (isSolved) {
                if (option.isOptimal) {
                  cardStyle = "bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 font-medium";
                } else if (isSelected) {
                  cardStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200";
                } else {
                  cardStyle = "bg-slate-50/40 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60";
                }
              }

              return (
                <div key={oIdx} className="space-y-2">
                  <button
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isSolved}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${cardStyle}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold border ${
                      isSelected
                        ? option.isOptimal
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">
                        {option.text}
                      </p>
                    </div>

                    {isSolved && option.isOptimal && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono shrink-0 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        +100 XP
                      </span>
                    )}
                  </button>

                  {/* Feedback on selection */}
                  {isSolved && isSelected && (
                    <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                      option.isOptimal
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    }`}>
                      <div className="flex items-center gap-2 font-bold mb-1.5">
                        {option.isOptimal ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span>{lang === 'en' ? 'Correct Decision!' : '¡Decisión Correcta!'}</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                            <span>{t[lang].decisionConsequence}:</span>
                          </>
                        )}
                      </div>
                      <p className="mb-2">{option.consequence}</p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                        <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{t[lang].legalSupport}: <strong className="text-slate-900 dark:text-white">{option.articleReference}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Card Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isSolved ? (
              <span className="font-medium text-emerald-800 dark:text-emerald-400">
                {lang === 'en' ? 'Case completed. You can move to the next dilemma.' : 'Caso completado. Puedes avanzar al siguiente dilema.'}
              </span>
            ) : (
              <span>{lang === 'en' ? 'Click on an option to respond.' : 'Haz clic en una opción para responder.'}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isSolved && (
              <button
                onClick={handleNextDilemma}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>{t[lang].nextCaseBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
