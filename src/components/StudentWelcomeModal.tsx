import React, { useState } from 'react';
import { UserCheck, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { ApprenticeProfile } from '../data/inductionContent';

interface StudentWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ApprenticeProfile;
  onSaveProfile: (profile: ApprenticeProfile) => void;
}

export const StudentWelcomeModal: React.FC<StudentWelcomeModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState(currentProfile.documentType || 'Cédula de Ciudadanía');
  const [documentNumber, setDocumentNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !documentNumber.trim()) return;

    try {
      localStorage.setItem('sena_custom_student_registered', 'true');
    } catch (e) {
      // ignore
    }

    onSaveProfile({
      ...currentProfile,
      fullName: fullName.trim(),
      documentType,
      documentNumber: documentNumber.trim(),
      inductionDate: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Banner with SENA Green Badge */}
        <div className="p-6 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-700/80 rounded-md text-[11px] font-semibold text-emerald-100 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Inducción Oficial SENA 2024</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              ¡Bienvenido(a) a tu Formación!
            </h2>
            
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Ficha <strong className="text-white font-mono">{currentProfile.fichaCode}</strong> · {currentProfile.programName}
            </p>
          </div>

          {/* Decorative watermark */}
          <div className="absolute right-3 -bottom-6 text-emerald-700/20 font-black text-8xl select-none pointer-events-none">
            SENA
          </div>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ingresa tus datos personales
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tu nombre y documento aparecerán impresos en tu <strong>Certificado Oficial de Culminación de Inducción (Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026)</strong> una vez apruebes las actividades.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre Completo del Aprendiz
            </label>
            <input
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Ej. Andrés Camilo Rodríguez Flórez"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Documento
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía (C.C.)</option>
                <option value="Tarjeta de Identidad">Tarjeta de Identidad (T.I.)</option>
                <option value="Cédula de Extranjería">Cédula de Extranjería (C.E.)</option>
                <option value="Permiso por Protección Temporal">Permiso de Protección (PPT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de Documento
              </label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                placeholder="1098765432"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Datos protegidos para certificación</span>
            </span>

            <button
              type="submit"
              disabled={!fullName.trim() || !documentNumber.trim()}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Comenzar mi Inducción</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
