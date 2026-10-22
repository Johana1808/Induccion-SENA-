import React, { useState } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  Download, 
  QrCode,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';
import { ApprenticeProfile } from '../data/inductionContent';
import { t } from '../utils/i18n';

interface CertificateViewProps {
  profile: ApprenticeProfile;
  hasPassedQuiz: boolean;
  quizScore: number | null;
  onOpenProfileModal: () => void;
  onGoToQuiz: () => void;
  lang?: 'es' | 'en';
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  hasPassedQuiz,
  quizScore,
  onOpenProfileModal,
  onGoToQuiz,
  lang = 'es',
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate deterministic verification code based on document and ficha
  const cleanDoc = profile.documentNumber.replace(/\D/g, '') || '1098765432';
  const cleanFicha = profile.fichaCode.replace(/\D/g, '') || '2874910';
  const verificationHash = `SENA-IND-${cleanFicha}-${cleanDoc.slice(-4)}-2026`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationHash);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // If learner hasn't passed quiz yet, show motivational unlock card
  if (!hasPassedQuiz) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-xs transition-colors duration-200">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t[lang].certNotYetUnlocked}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {t[lang].certUnlockNotice}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          <span>{t[lang].currentQuizScore} </span>
          <strong className="text-slate-900 dark:text-white font-mono">
            {quizScore !== null ? `${quizScore}% (${lang === 'en' ? 'Minimum required: 70%' : 'Mínimo requerido: 70%'})` : (lang === 'en' ? 'Not submitted yet' : 'Sin presentar')}
          </strong>
        </div>

        <div className="pt-2">
          <button
            onClick={onGoToQuiz}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t[lang].takeInductionQuiz}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t[lang].certSuccessTag}</span>
            <span>·</span>
            <span>{t[lang].certVerifiableDoc}</span>
            <span>·</span>
            <span>{t[lang].certHours}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {t[lang].certUnlockedTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenProfileModal}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Edit Details' : 'Editar Datos'}
          </button>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t[lang].certCopyCodeBtn}
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{t[lang].certCopiedSuccess}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'Copy Hash' : 'Copiar Hash'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t[lang].certPrintBtn}</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div
        id="printable-certificate"
        className="bg-white border-8 border-slate-900/10 rounded-2xl p-8 sm:p-12 shadow-lg max-w-4xl mx-auto relative overflow-hidden text-slate-900"
      >
        <div className="border-2 border-emerald-700/30 p-6 sm:p-8 rounded-xl relative bg-[radial-gradient(#04785708_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Header Institutional Bar */}
          <div className="text-center space-y-2 border-b-2 border-emerald-700/20 pb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                SENA
              </div>
              <div className="text-left">
                <p className="text-xs font-bold tracking-widest text-emerald-900 uppercase">
                  {lang === 'en' ? 'National Learning Service (SENA)' : 'Servicio Nacional de Aprendizaje'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                  {t[lang].certMinWork}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase block">
                {t[lang].certNationalDirector}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {lang === 'en' ? 'INDUCTION COMPLETION CERTIFICATE' : 'CERTIFICADO DE CULMINACIÓN DE INDUCCIÓN'}
              </h1>
              <p className="text-xs text-emerald-800 font-semibold tracking-wide mt-0.5">
                {t[lang].certAccordLegal}
              </p>
            </div>
          </div>

          {/* Certificate Body Text */}
          <div className="py-8 text-center space-y-6">
            <p className="text-xs sm:text-sm text-slate-600 italic">
              {lang === 'en' ? 'The Training Center hereby certifies that:' : 'El Centro de Formación certifica que:'}
            </p>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif uppercase underline decoration-emerald-600/40 underline-offset-8">
                {profile.fullName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-mono">
                {lang === 'en' ? 'Identified with' : 'Identificado(a) con'} {profile.documentType} N°: <strong className="text-slate-900">{profile.documentNumber}</strong>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto">
              {lang === 'en'
                ? 'Has actively participated and satisfactorily passed the Comprehensive Vocational Training Induction process, accrediting knowledge, comprehension, and ethical commitment to the Rights, Duties, Prohibitions, and Procedures of the SENA Apprentice Rulebook (Agreement 009 of 2024 modified by Agreement 002 of 2026).'
                : 'Ha participado activamente y aprobado satisfactoriamente el proceso de Inducción a la Formación Profesional Integral, acreditando el conocimiento, comprensión y compromiso ético con los Derechos, Deberes, Prohibiciones y Trámites del Reglamento del Aprendiz SENA (Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026).'}
            </p>

            {/* Academic Program Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl text-left text-xs">
              <div>
                <span className="text-slate-500 block">{lang === 'en' ? 'Training Program:' : 'Programa de Formación:'}</span>
                <span className="font-semibold text-slate-900 text-sm">{profile.programName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t[lang].certFichaNum}</span>
                <span className="font-semibold text-slate-900 font-mono text-sm">{profile.fichaCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t[lang].certRegionalLab} & {t[lang].certCenterLab}</span>
                <span className="font-medium text-slate-800">{profile.regional}</span>
                <span className="block text-slate-600 text-[11px] truncate">{profile.trainingCenter}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'en' ? 'Modality & Intensity:' : 'Modalidad e Intensidad:'}</span>
                <span className="font-medium text-slate-800">{profile.modality} · {t[lang].certHours}</span>
              </div>
            </div>

            {/* Score & Completion Note */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
              <span>{lang === 'en' ? 'Assessment Score:' : 'Calificación en Evaluación:'} <strong className="text-emerald-700 font-mono">{quizScore || 100}%</strong></span>
              <span>·</span>
              <span>{t[lang].certDateLab} <strong className="text-slate-800">{profile.inductionDate}</strong></span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">{lang === 'en' ? 'Status: PASSED' : 'Estado: APROBADO'}</span>
            </div>

          </div>

          {/* Signatures & Seal Section */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="w-36 mx-auto border-b border-slate-400 pb-1 font-serif text-sm italic text-slate-700">
                Luz Marina Osorio
              </div>
              <p className="text-xs font-bold text-slate-900">{t[lang].certCenterSubdirector}</p>
              <p className="text-[10px] text-slate-500">SENA · {lang === 'en' ? 'Vocational Training' : 'Formación Profesional'}</p>
            </div>

            {/* Center: Official Seal Image */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 relative">
                <img
                  src="/src/assets/images/sena_badge_seal_1792526463889.jpg"
                  alt="Sello Oficial de Certificación SENA"
                  className="w-full h-full object-contain drop-shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                {lang === 'en' ? 'Validated Certificate' : 'Certificación Validada'}
              </span>
            </div>

            {/* Signature 2: Aprendiz Acceptance */}
            <div className="space-y-1">
              <div className="w-36 mx-auto border-b border-slate-400 pb-1 font-serif text-sm italic text-slate-700">
                {profile.fullName.split(' ')[0]} {profile.fullName.split(' ')[1] || ''}
              </div>
              <p className="text-xs font-bold text-slate-900">{lang === 'en' ? 'Apprentice Signature' : 'Firma del Aprendiz'}</p>
              <p className="text-[10px] text-slate-500">{lang === 'en' ? 'Digital Terms Acceptance' : 'Aceptación Digital de Términos'}</p>
            </div>

          </div>

          {/* Verification Bar & QR Code */}
          <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-1 border border-slate-300 rounded shadow-2xs shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 fill-current">
                  <path d="M2 2h8v8H2zm2 2v4h4V4zm-2 10h8v8H2zm2 2v4h4v-4zm10-14h8v8h-8zm2 2v4h4V4zm-2 10h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm5 0h3v3h-3zm-2-2h2v2h-2zm-6-3h2v2h-2zm0 4h2v2h-2z" />
                </svg>
              </div>
              <div className="text-left font-mono leading-tight">
                <span className="block text-slate-800 font-semibold">{lang === 'en' ? 'UNIQUE VERIFICATION CODE:' : 'CÓDIGO DE VERIFICACIÓN ÚNICO:'}</span>
                <span className="text-emerald-700">{verificationHash}</span>
                <span className="block text-[10px] text-slate-400">{lang === 'en' ? 'Verifiable in Training Center registry system' : 'Verificable en el sistema de gestión del Centro'}</span>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-400">
              <span>{lang === 'en' ? 'High Quality Institutional Accreditation Resolution' : 'Resolución de Acreditación Institucional de Alta Calidad'}</span>
              <span className="block">{lang === 'en' ? 'Supervised by MinEducation / MinLabor' : 'Vigilado MinEducación / MinTrabajo'}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
