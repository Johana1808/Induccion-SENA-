import React from 'react';
import { Compass, Sparkles, CheckCircle2, Share2, Users, FileSpreadsheet } from 'lucide-react';
import { ApprenticeProfile } from '../data/inductionContent';
import { t } from '../utils/i18n';

interface HeroBannerProps {
  profile: ApprenticeProfile;
  userRole?: 'instructor' | 'aprendiz';
  onOpenInstructorPanel?: () => void;
  totalXp: number;
  completedModulesCount: number;
  totalModulesCount: number;
  dilemmasSolvedCount: number;
  totalDilemmasCount: number;
  quizScore: number | null;
  hasPassedQuiz: boolean;
  onStartInduction: () => void;
  onOpenEvaluation: () => void;
  onOpenCertificate: () => void;
  onOpenShareModal?: () => void;
  onOpenRecordsModal?: () => void;
  lang?: 'es' | 'en';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  profile,
  userRole = 'instructor',
  onOpenInstructorPanel,
  totalXp,
  completedModulesCount,
  totalModulesCount,
  dilemmasSolvedCount,
  totalDilemmasCount,
  quizScore,
  hasPassedQuiz,
  onStartInduction,
  onOpenEvaluation,
  onOpenCertificate,
  onOpenShareModal,
  onOpenRecordsModal,
  lang = 'es',
}) => {
  const overallProgress = Math.round(
    ((completedModulesCount / totalModulesCount) * 0.4 +
     (dilemmasSolvedCount / totalDilemmasCount) * 0.3 +
     (hasPassedQuiz ? 0.3 : (quizScore !== null ? 0.15 : 0))) * 100
  );

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 py-8 lg:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Context & Induction Value */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold tracking-wide">{t[lang].heroSenaCol}</span>
              <span aria-hidden="true">·</span>
              <span>{t[lang].subtitle}</span>
              <span aria-hidden="true">·</span>
              <span>{t[lang].heroCurrentRule}</span>
              <span aria-hidden="true">·</span>
              <span>{t[lang].heroIntegralInduction}</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
                {t[lang].heroWelcomeTitle}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {t[lang].heroWelcomeMsg1} <strong className="text-slate-900 dark:text-white font-semibold">{profile.fullName}</strong>. {t[lang].heroWelcomeMsg2} <span className="text-emerald-800 dark:text-emerald-400 font-semibold">{profile.programName}</span> ({profile.fichaCode ? `${lang === 'en' ? 'Batch' : 'Ficha'} ${profile.fichaCode}` : (lang === 'en' ? 'General Induction' : 'Inducción General')}). {t[lang].heroWelcomeMsg3}
              </p>
            </div>

            {/* Progress summary bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{t[lang].overallProgress}</span>
                <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  {overallProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block font-mono font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                    {completedModulesCount}/{totalModulesCount}
                  </span>
                  <span>{t[lang].modules}</span>
                </div>
                <div>
                  <span className="block font-mono font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                    {dilemmasSolvedCount}/{totalDilemmasCount}
                  </span>
                  <span>{t[lang].casesSolved}</span>
                </div>
                <div>
                  <span className="block font-mono font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                    {hasPassedQuiz ? t[lang].evaluationPassed : quizScore !== null ? `${quizScore}%` : t[lang].evaluationPending}
                  </span>
                  <span>{t[lang].evaluationLabel}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {userRole === 'instructor' ? (
                <>
                  {onOpenInstructorPanel && (
                    <button
                      onClick={onOpenInstructorPanel}
                      className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{t[lang].instructorManagementPanel}</span>
                    </button>
                  )}

                  {onOpenShareModal && (
                    <button
                      onClick={onOpenShareModal}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-xs"
                      title={t[lang].shareLinkToLearners}
                    >
                      <Share2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{t[lang].shareLinkToLearners}</span>
                    </button>
                  )}

                  {onOpenRecordsModal && (
                    <button
                      onClick={onOpenRecordsModal}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-xs"
                      title={t[lang].consolidatedExport}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{t[lang].consolidatedExport}</span>
                    </button>
                  )}

                  <button
                    onClick={onStartInduction}
                    className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{t[lang].viewInductionModules}</span>
                  </button>
                </>
              ) : (
                /* APPRENTICE ACTIONS ONLY */
                <>
                  <button
                    onClick={onStartInduction}
                    className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{t[lang].continueModules}</span>
                  </button>

                  <button
                    onClick={onOpenEvaluation}
                    className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t[lang].gamifiedEvaluation}</span>
                  </button>

                  {hasPassedQuiz && (
                    <button
                      onClick={onOpenCertificate}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{t[lang].downloadCertBtn}</span>
                    </button>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Right Column: Visual Hero Asset */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-16/10 lg:aspect-auto lg:h-full">
              <img
                src="/src/assets/images/sena_induction_hero_1792526463761.jpg"
                alt="Aprendices del SENA en ambiente de formación tecnológica"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  {t[lang].communityTitle}
                </p>
                <p className="text-sm font-medium text-slate-100 leading-snug mt-1">
                  {t[lang].communitySubtitle}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-300 font-mono">
                  <span>{totalXp} {t[lang].xpPoints}</span>
                  <span>·</span>
                  <span>{profile.regional}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
