import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Send, 
  Building, 
  BookOpen, 
  Hash, 
  UserCheck, 
  Users,
  Smartphone,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { ApprenticeProfile } from '../data/inductionContent';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ApprenticeProfile;
  onOpenRecordsModal?: () => void;
  lang?: 'es' | 'en';
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onOpenRecordsModal,
  lang = 'es',
}) => {
  const [fichaCode, setFichaCode] = useState(currentProfile.fichaCode || '2874910');
  const [programName, setProgramName] = useState(currentProfile.programName || 'Tecnólogo en Análisis y Desarrollo de Software');
  const [trainingCenter, setTrainingCenter] = useState(currentProfile.trainingCenter || 'Centro de Electricidad y Telecomunicaciones');
  const [regional, setRegional] = useState(currentProfile.regional || 'Regional Distrito Capital');
  const [modality, setModality] = useState(currentProfile.modality || 'Presencial');
  
  // Optional pre-filled student
  const [linkMode, setLinkMode] = useState<'group' | 'individual'>('group');
  const [studentName, setStudentName] = useState('');
  const [studentDoc, setStudentDoc] = useState('');

  const [copied, setCopied] = useState(false);
  const [showQrProjector, setShowQrProjector] = useState(false);

  if (!isOpen) return null;

  // Build the shareable URL with parameters
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const params = new URLSearchParams();
  params.set('rol', 'aprendiz');
  params.set('invitacion', '1');
  if (fichaCode) params.set('ficha', fichaCode.trim());
  if (programName) params.set('programa', programName.trim());
  if (trainingCenter) params.set('centro', trainingCenter.trim());
  if (regional) params.set('regional', regional.trim());
  if (modality) params.set('modalidad', modality);

  if (linkMode === 'individual') {
    if (studentName) params.set('nombre', studentName.trim());
    if (studentDoc) params.set('doc', studentDoc.trim());
  }

  const generatedUrl = `${baseUrl}?${params.toString()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const message = lang === 'en'
      ? `Dear SENA learners, here is the link to complete the interactive Apprentice Rulebook induction (Agreement 009 of 2024 modified by Agreement 002 of 2026) for Batch ${fichaCode} - ${programName}. Upon completing the gamified assessment, each of you will obtain your official certificate under your own name:\n\n${generatedUrl}`
      : `Estimados aprendices SENA, les comparto el enlace para realizar la inducción interactiva al Reglamento del Aprendiz (Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026) para la Ficha ${fichaCode} - ${programName}. Al finalizar la evaluación gamificada, cada uno obtendrá su certificado oficial a su nombre:\n\n${generatedUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-semibold text-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'en' ? 'Learner Link Generator' : 'Generador de Enlace para Aprendices'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'en'
                  ? 'Send this link to your students so each can generate a certificate under their own name'
                  : 'Envía este enlace a tus estudiantes para que cada uno genere su certificado a su nombre'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Mode Switcher */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex gap-1">
            <button
              type="button"
              onClick={() => setLinkMode('group')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                linkMode === 'group'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'General Batch Link (Recommended)' : 'Enlace General de la Ficha (Recomendado)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setLinkMode('individual')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                linkMode === 'individual'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Specific Learner' : 'Aprendiz Específico'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60">
            {linkMode === 'group' ? (
              <>
                <strong className="text-emerald-900 dark:text-emerald-300">
                  {lang === 'en' ? 'How does it work?' : '¿Cómo funciona?'}
                </strong>{' '}
                {lang === 'en'
                  ? `When opening the link, each learner will see a welcome screen for Batch ${fichaCode || 'of your course'}. The student enters their Full Name and Document Number, completes the modules and assessment, and the official certificate is automatically generated with their personal credentials.`
                  : `Al abrir el enlace, cada estudiante verá una pantalla de bienvenida a la Ficha ${fichaCode || 'de tu curso'}. El estudiante ingresa su Nombre completo y Documento, realiza los módulos y la evaluación, y el certificado oficial se genera automáticamente con sus datos personales.`}
              </>
            ) : (
              <>
                <strong className="text-emerald-900 dark:text-emerald-300">
                  {lang === 'en' ? 'Individual Mode:' : 'Modo Individual:'}
                </strong>{' '}
                {lang === 'en'
                  ? 'The learner credentials will already come pre-loaded in the link so the student does not need to enter them manually.'
                  : 'Los datos del aprendiz ya vendrán precargados en el enlace para que el estudiante no tenga que escribirlos manualmente.'}
              </>
            )}
          </p>

          {/* Form Fields to Customize the Link */}
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  {lang === 'en' ? 'Batch Code (Ficha)' : 'Número de Ficha'}
                </label>
                <input
                  type="text"
                  value={fichaCode}
                  onChange={(e) => setFichaCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  placeholder="2874910"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'en' ? 'Modality' : 'Modalidad'}
                </label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="Presencial">{lang === 'en' ? 'In-person' : 'Presencial'}</option>
                  <option value="Virtual">{lang === 'en' ? 'Virtual (Zajuna)' : 'Virtual (Zajuna)'}</option>
                  <option value="A Distancia">{lang === 'en' ? 'Distance / Mixed' : 'A Distancia / Mixta'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {lang === 'en' ? 'Training Program' : 'Programa de Formación'}
              </label>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder={lang === 'en' ? 'E.g., Software Analysis and Development' : 'Ej. Tecnólogo en Análisis y Desarrollo de Software'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {lang === 'en' ? 'SENA Regional' : 'Regional SENA'}
                </label>
                <input
                  type="text"
                  value={regional}
                  onChange={(e) => setRegional(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder={lang === 'en' ? 'E.g., Capital District' : 'Ej. Regional Distrito Capital'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'en' ? 'Training Center' : 'Centro de Formación'}
                </label>
                <input
                  type="text"
                  value={trainingCenter}
                  onChange={(e) => setTrainingCenter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder={lang === 'en' ? 'E.g., Technology and Electricity Center' : 'Ej. Centro de Electricidad y Telecomunicaciones'}
                />
              </div>
            </div>

            {/* Individual student fields if selected */}
            {linkMode === 'individual' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {lang === 'en' ? 'Learner Data to Pre-fill:' : 'Datos del Aprendiz a Pre-cargar:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      {lang === 'en' ? 'Full Name' : 'Nombre Completo'}
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder={lang === 'en' ? 'E.g., John Smith' : 'Ej. Juan Andrés Mora'}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      {lang === 'en' ? 'Document Number' : 'Número de Documento'}
                    </label>
                    <input
                      type="text"
                      value={studentDoc}
                      onChange={(e) => setStudentDoc(e.target.value)}
                      placeholder="Ej. 1023456789"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Generated URL Box */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'en' ? 'Generated Link Ready to Copy:' : 'Enlace Generado Listo para Copiar:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Copied!' : '¡Copiado!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Copy' : 'Copiar'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Share Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'en' ? 'Share via WhatsApp' : 'Compartir por WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrProjector(!showQrProjector)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>{showQrProjector ? (lang === 'en' ? 'Hide QR Code' : 'Ocultar Código QR') : (lang === 'en' ? 'View QR Code to Project' : 'Ver Código QR para Proyectar')}</span>
            </button>

            {onOpenRecordsModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRecordsModal();
                }}
                className="col-span-1 sm:col-span-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{lang === 'en' ? 'View Consolidated & Download Records (Excel / CSV)' : 'Ver Consolidado y Descargar Registros (Excel / CSV)'}</span>
              </button>
            )}
          </div>

          {/* QR Code Projector Box */}
          {showQrProjector && (
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-44 h-44 mx-auto bg-white p-3 border-2 border-emerald-600/50 rounded-xl shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 fill-current">
                  <path d="M2 2h8v8H2zm2 2v4h4V4zm-2 10h8v8H2zm2 2v4h4v-4zm10-14h8v8h-8zm2 2v4h4V4zm-2 10h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm5 0h3v3h-3zm-2-2h2v2h-2zm-6-3h2v2h-2zm0 4h2v2h-2z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {lang === 'en'
                  ? `Scan with phone to directly access induction for Batch `
                  : `Escanea con el celular para acceder directamente a la inducción de la Ficha `}
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{fichaCode}</span>
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
          <span>{lang === 'en' ? 'Agreement 009 of 2024 (Modified by Agreement 002 of 2026 SENA)' : 'Acuerdo 009 de 2024 (Modificado por Acuerdo 002 de 2026 SENA)'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'Cerrar'}
          </button>
        </div>

      </div>
    </div>
  );
};
