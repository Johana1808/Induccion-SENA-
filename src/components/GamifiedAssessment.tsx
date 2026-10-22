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
import { ASSESSMENT_QUESTIONS, QuizQuestion } from '../data/inductionContent';

interface GamifiedAssessmentProps {
  onCompleteQuiz: (scorePercent: number, correctCount: number, xpGain: number) => void;
  onGoToCertificate: () => void;
  bestScore: number | null;
}

export const GamifiedAssessment: React.FC<GamifiedAssessmentProps> = ({
  onCompleteQuiz,
  onGoToCertificate,
  bestScore,
}) => {
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

  const currentQ: QuizQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    const newAnswers = [...answersState, index];
    setAnswersState(newAnswers);

    if (isCorrect) {
      // mini micro-confetti
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.8 }
        });
      } catch (e) {
        // ignore if blocked
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
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
      if (ans === ASSESSMENT_QUESTIONS[idx].correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);
    const xpGain = correctCount * 50;

    onCompleteQuiz(percent, correctCount, xpGain);

    if (percent >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
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
      if (ans === ASSESSMENT_QUESTIONS[idx].correctIndex) {
        correctCount++;
      }
    });
    const percent = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);
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
            {passed ? '¡Felicitaciones! Has Aprobado la Evaluación' : 'Evaluación Completada'}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            {passed
              ? 'Has demostrado un sólido conocimiento de tus derechos, deberes y el régimen normativo del SENA según el Acuerdo 009 de 2024. Tu certificado de inducción está disponible.'
              : 'Obtuviste un puntaje inferior al 70%. Recuerda que puedes repasar los módulos y presentar nuevamente la evaluación para desbloquear tu certificado.'}
          </p>
        </div>

        {/* Score KPI Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Puntaje Obtenido</span>
            <span className={`font-mono text-2xl font-bold tabular-nums ${
              passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
            }`}>
              {percent}%
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Respuestas Correctas</span>
            <span className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {correctCount} / {ASSESSMENT_QUESTIONS.length}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Tiempo Empleado</span>
            <span className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Resumen de Respuestas:
          </h4>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {ASSESSMENT_QUESTIONS.map((q, idx) => {
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
                        <CheckCircle2 className="w-3.5 h-3.5" /> Acierto
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Error
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Tu respuesta: <span className="font-medium text-slate-700 dark:text-slate-300">{q.options[userAns]}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-emerald-800 dark:text-emerald-400 text-[11px]">
                      Correcta: <span className="font-medium">{q.options[q.correctIndex]}</span>
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
            <span>Presentar Nuevamente</span>
          </button>

          {passed ? (
            <button
              onClick={onGoToCertificate}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>Ver y Descargar Certificado Oficial</span>
            </button>
          ) : (
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Reintentar para Aprobar</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs max-w-3xl mx-auto transition-colors duration-200">
      
      {/* Quiz Progress & Timer Header */}
      <div className="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">Evaluación de Inducción</span>
            <span>·</span>
            <span>Pregunta {currentQuestionIndex + 1} de {ASSESSMENT_QUESTIONS.length}</span>
          </div>
          <div className="flex items-center gap-2 font-mono tabular-nums text-slate-600 dark:text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Body */}
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Categoría: {currentQ.category}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let optionStyle = "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200";
            if (isAnswered) {
              if (isCorrect) {
                optionStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 font-medium";
              } else if (isSelected) {
                optionStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200";
              } else {
                optionStyle = "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold border ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Explanation */}
        {isAnswered && (
          <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
            selectedAnswer === currentQ.correctIndex
              ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}>
            <p className="font-semibold mb-1">
              {selectedAnswer === currentQ.correctIndex
                ? '¡Correcto! Excelente comprensión.'
                : 'Respuesta incorrecta. Fundamento normativo:'}
            </p>
            <p className="mb-2">{currentQ.explanation}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/50 dark:border-slate-700">
              <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Base legal: <strong className="text-slate-800 dark:text-slate-100">{currentQ.article}</strong></span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Pregunta {currentQuestionIndex + 1} de {ASSESSMENT_QUESTIONS.length}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            !isAnswered
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-xs'
          }`}
        >
          <span>
            {currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1
              ? 'Siguiente Pregunta'
              : 'Finalizar y Ver Resultados'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
