import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Scale, 
  Clock, 
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { QuizQuestion, getAssessmentQuestions } from '../data/inductionContent';
import { t } from '../utils/i18n';

interface GamifiedAssessmentProps {
  onCompleteQuiz: (scorePercent: number, correctCount: number, xpGain: number) => void;
  onGoToCertificate: () => void;
  bestScore: number | null;
  lang?: 'es' | 'en';
}

export const GamifiedAssessment: React.FC<GamifiedAssessmentProps> = ({
  onCompleteQuiz,
  onGoToCertificate,
  bestScore,
  lang = 'es',
}) => {
  const questionsList = getAssessmentQuestions(lang);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [answersState, setAnswersState] = useState<number[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isActiveTimer, setIsActiveTimer] = useState<boolean>(true);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isActiveTimer && !isQuizFinished) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActiveTimer, isQuizFinished]);

  const currentQ: QuizQuestion = questionsList[currentQuestionIndex] || questionsList[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    const newAnswers = [...answersState, index];
    setAnswersState(newAnswers);

    if (isCorrect) {
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.8 }
        });
      } catch (e) {}
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);
    setIsActiveTimer(false);

    let correctCount = 0;
    answersState.forEach((ans, idx) => {
      if (ans === questionsList[idx]?.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / questionsList.length) * 100);
    const xpGain = correctCount * 50;

    onCompleteQuiz(percent, correctCount, xpGain);

    if (percent >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAnswersState([]);
    setIsQuizFinished(false);
    setElapsedSeconds(0);
    setIsActiveTimer(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render Finished Summary State
  if (isQuizFinished) {
    let correctCount = 0;
    answersState.forEach((ans, idx) => {
      if (ans === questionsList[idx]?.correctIndex) {
        correctCount++;
      }
    });
    const percent = Math.round((correctCount / questionsList.length) * 100);
    const passed = percent >= 70;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6 transition-colors duration-200">
        <div className="text-center space-y-3">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            passed ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
          }`}>
            {passed ? <Award className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {passed ? t[lang].quizPassedTitle : t[lang].quizFailedTitle}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            {passed ? t[lang].quizPassedMsg : t[lang].quizFailedMsg}
          </p>
        </div>

        {/* Score KPI Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">{t[lang].scoreAchieved}</span>
            <span className={`font-mono text-2xl font-bold tabular-nums ${
              passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
            }`}>
              {percent}%
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">{t[lang].correctQuestions}</span>
            <span className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {correctCount} / {questionsList.length}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">{t[lang].timeElapsed}</span>
            <span className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {lang === 'en' ? 'Answer Summary:' : 'Resumen de Respuestas:'}
          </h4>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {questionsList.map((q, idx) => {
              const userAns = answersState[idx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'Correct' : 'Acierto'}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> {lang === 'en' ? 'Incorrect' : 'Error'}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {lang === 'en' ? 'Your answer' : 'Tu respuesta'}: <span className="font-medium text-slate-700 dark:text-slate-300">{q.options[userAns]}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-emerald-800 dark:text-emerald-400 text-[11px]">
                      {lang === 'en' ? 'Correct' : 'Correcta'}: <span className="font-medium">{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleRestartQuiz}
            className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t[lang].retryQuizBtn}</span>
          </button>

          {passed ? (
            <button
              onClick={onGoToCertificate}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>{t[lang].viewCertificateBtn}</span>
            </button>
          ) : (
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{t[lang].retryQuizBtn}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Quiz View
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questionsList.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t[lang].evaluationLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{t[lang].subtitle}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'en' ? 'Passing grade: 70%' : 'Mínimo aprobatorio: 70%'}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t[lang].quizTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              <span>{t[lang].questionLabel} {currentQuestionIndex + 1} / {questionsList.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{lang === 'en' ? 'Evaluation Progress' : 'Progreso de la Evaluación'}</span>
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
        
        <div className="p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
            {currentQ.category}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        <div className="p-6 space-y-3">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = selectedAnswer === oIdx;
            const isCorrect = oIdx === currentQ.correctIndex;

            let optionStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200";
            if (isAnswered) {
              if (isCorrect) {
                optionStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 font-medium";
              } else if (isSelected) {
                optionStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200";
              } else {
                optionStyle = "bg-slate-50/40 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer text-xs sm:text-sm ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border shrink-0 ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Explanation box after answer */}
          {isAnswered && (
            <div className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
              selectedAnswer === currentQ.correctIndex
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {selectedAnswer === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>{t[lang].correctAnswer}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'Review explanation:' : 'Revisión y Fundamento:'}</span>
                  </>
                )}
              </div>
              <p className="mb-2">{currentQ.explanation}</p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{t[lang].legalSupport}: <strong className="text-slate-900 dark:text-white">{currentQ.article}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAnswered
              ? (lang === 'en' ? 'Click next to advance.' : 'Haz clic en siguiente para continuar.')
              : (lang === 'en' ? 'Select an answer to validate.' : 'Selecciona una respuesta para validar.')}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
              !isAnswered
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-xs'
            }`}
          >
            <span>
              {currentQuestionIndex < questionsList.length - 1
                ? (lang === 'en' ? 'Next Question' : 'Siguiente Pregunta')
                : t[lang].submitExam}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
