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
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onOpenRecordsModal,
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
    const message = `Estimados aprendices SENA, les comparto el enlace para realizar la inducción interactiva al Reglamento del Aprendiz (Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026) para la Ficha ${fichaCode} - ${programName}. Al finalizar la evaluación gamificada, cada uno obtendrá su certificado oficial a su nombre:\n\n${generatedUrl}`;
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
                Generador de Enlace para Aprendices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Envía este enlace a tus estudiantes para que cada uno genere su certificado a su nombre
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
              <span>Enlace General de la Ficha (Recomendado)</span>
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
              <span>Aprendiz Específico</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60">
            {linkMode === 'group' ? (
              <>
                <strong className="text-emerald-900 dark:text-emerald-300">¿Cómo funciona?</strong> Al abrir el enlace, cada estudiante verá una pantalla de bienvenida a la Ficha {fichaCode || 'de tu curso'}. El estudiante ingresa su <strong>Nombre completo y Documento</strong>, realiza los módulos y la evaluación, y el <strong>certificado oficial se genera automáticamente con sus datos personales</strong>.
              </>
            ) : (
              <>
                <strong className="text-emerald-900 dark:text-emerald-300">Modo Individual:</strong> Los datos del aprendiz ya vendrán precargados en el enlace para que el estudiante no tenga que escribirlos manualmente.
              </>
            )}
          </p>

          {/* Form Fields to Customize the Link */}
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Número de Ficha
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
                  Modalidad
                </label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual (Zajuna)</option>
                  <option value="A Distancia">A Distancia / Mixta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Programa de Formación
              </label>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Ej. Tecnólogo en Análisis y Desarrollo de Software"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Regional SENA
                </label>
                <input
                  type="text"
                  value={regional}
                  onChange={(e) => setRegional(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Ej. Regional Distrito Capital"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Centro de Formación
                </label>
                <input
                  type="text"
                  value={trainingCenter}
                  onChange={(e) => setTrainingCenter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Ej. Centro de Electricidad y Telecomunicaciones"
                />
              </div>
            </div>

            {/* Individual student fields if selected */}
            {linkMode === 'individual' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Datos del Aprendiz a Pre-cargar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ej. Juan Andrés Mora"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Número de Documento
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
              Enlace Generado Listo para Copiar:
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
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
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
              <span>Compartir por WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrProjector(!showQrProjector)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>{showQrProjector ? 'Ocultar Código QR' : 'Ver Código QR para Proyectar'}</span>
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
                <span>Ver Consolidado y Descargar Registros (Excel / CSV)</span>
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
                Escanea con el celular para acceder directamente a la inducción de la Ficha <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{fichaCode}</span>
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
          <span>Acuerdo 009 de 2024 (Modificado por Acuerdo 002 de 2026 SENA)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
