import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  BookOpen, 
  User, 
  FileText, 
  Award,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { ApprenticeProfile } from '../data/inductionContent';

const SENA_LOGO_SRC = "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e";

interface RoleSelectionLandingProps {
  currentProfile: ApprenticeProfile;
  initialRole?: 'instructor' | 'aprendiz';
  onLoginAsInstructor: () => void;
  onLoginAsLearner: (profile: ApprenticeProfile) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  currentProfile,
  initialRole = 'aprendiz',
  onLoginAsInstructor,
  onLoginAsLearner,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [selectedRole, setSelectedRole] = useState<'instructor' | 'aprendiz'>(initialRole);
  
  // Instructor Password State
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Apprentice Profile Form State
  const [fullName, setFullName] = useState(currentProfile.fullName || '');
  const [documentType, setDocumentType] = useState(currentProfile.documentType || 'C.C.');
  const [documentNumber, setDocumentNumber] = useState(currentProfile.documentNumber || '');
  const [fichaCode, setFichaCode] = useState(currentProfile.fichaCode || '2874910');
  const [programName, setProgramName] = useState(currentProfile.programName || 'Tecnólogo en Análisis y Desarrollo de Software');
  const [trainingCenter, setTrainingCenter] = useState(currentProfile.trainingCenter || 'Centro de Electricidad y Telecomunicaciones');
  const [regional, setRegional] = useState(currentProfile.regional || 'Distrito Capital');
  const [modality, setModality] = useState(currentProfile.modality || 'Presencial');
  const [learnerFormError, setLearnerFormError] = useState('');

  // Handle Instructor Submission
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instructorPassword === 'Tomas0816') {
      setPasswordError('');
      onLoginAsInstructor();
    } else {
      setPasswordError('Clave incorrecta. Por favor ingresa la clave asignada para el rol de instructor.');
    }
  };

  // Handle Apprentice Submission
  const handleLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setLearnerFormError('Por favor ingresa tu nombre completo para emitir tu certificado.');
      return;
    }
    if (!documentNumber.trim()) {
      setLearnerFormError('Por favor ingresa tu número de documento de identidad.');
      return;
    }

    setLearnerFormError('');
    const updated: ApprenticeProfile = {
      ...currentProfile,
      fullName: fullName.trim(),
      documentType,
      documentNumber: documentNumber.trim(),
      fichaCode: fichaCode.trim() || '2874910',
      programName: programName.trim() || 'Formación Profesional SENA',
      trainingCenter: trainingCenter.trim() || 'Centro de Formación',
      regional: regional.trim() || 'Regional SENA',
      modality,
    };

    onLoginAsLearner(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src={SENA_LOGO_SRC} alt="Logo Oficial SENA" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight block leading-tight">
                Servicio Nacional de Aprendizaje SENA
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Portal de Inducción y Reglamento del Aprendiz
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span>Acuerdo 009 de 2024 · Modificado 2026</span>
            </div>

            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Hero Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center">
        
        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plataforma Oficial de Inducción Interactiva</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Selecciona tu perfil de acceso
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Ingresa según tu rol para acceder a tus módulos de formación o al panel de seguimiento y configuración.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="w-full max-w-xl bg-slate-200/80 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-300/80 dark:border-slate-800 grid grid-cols-2 gap-1 mb-8 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('aprendiz');
              setPasswordError('');
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedRole === 'aprendiz'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Soy Aprendiz</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('instructor');
              setLearnerFormError('');
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedRole === 'instructor'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Soy Instructor</span>
          </button>
        </div>

        {/* Dynamic Card based on Selected Role */}
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* APPRENTICE ACCESS FORM (NO PASSWORD REQUIRED) */}
          {selectedRole === 'aprendiz' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Registro de Caracterización del Aprendiz
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    <strong>No necesitas contraseña.</strong> Diligencia tus datos personales exactamente como figuran en tu documento para generar tu certificado oficial al aprobar la inducción.
                  </p>
                </div>
              </div>

              {learnerFormError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{learnerFormError}</span>
                </div>
              )}

              <form onSubmit={handleLearnerSubmit} className="space-y-4 text-xs">
                
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Completo del Aprendiz *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Laura Sofía Gómez Rodríguez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* Document Type & Number Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo Doc. *
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-medium cursor-pointer"
                    >
                      <option value="C.C.">C.C. - Cédula</option>
                      <option value="T.I.">T.I. - Tarjeta</option>
                      <option value="C.E.">C.E. - Extranjería</option>
                      <option value="PEP">PEP</option>
                      <option value="PPT">PPT</option>
                    </select>
                  </div>

                  <div className="sm:col-span-8">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 1098765432"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-xs sm:text-sm font-mono font-medium"
                    />
                  </div>
                </div>

                {/* Ficha & Program Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ficha de Caracterización
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 2874910"
                      value={fichaCode}
                      onChange={(e) => setFichaCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-mono font-medium"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Modalidad
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-medium cursor-pointer"
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                      <option value="A distancia">A distancia / Mixta</option>
                    </select>
                  </div>
                </div>

                {/* Program Name */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Programa de Formación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Tecnólogo en Análisis y Desarrollo de Software"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm mt-2"
                >
                  <span>Ingresar a mi Inducción SENA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
                  Al ingresar aceptas conocer el Reglamento del Aprendiz bajo el Acuerdo 009 de 2024 / Acuerdo 002 de 2026.
                </p>

              </form>
            </div>
          )}

          {/* INSTRUCTOR ACCESS FORM (PASSWORD REQUIRED) */}
          {selectedRole === 'instructor' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Acceso Exclusivo para Instructores
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Ingresa con tu clave de instructor para acceder al panel de control, sincronización con Google Sheets, y seguimiento de aprendices.
                  </p>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleInstructorSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contraseña de Instructor
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      placeholder="Ingresa la clave de acceso"
                      value={instructorPassword}
                      onChange={(e) => {
                        setInstructorPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      className="w-full pl-3.5 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Privilegios de Instructor:</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                      Permite configurar Webhooks de Google Sheets, descargar consolidados en Excel y monitorear notas en tiempo real.
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ingresar al Panel de Gestión</span>
                </button>

              </form>

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 text-center bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <p>Servicio Nacional de Aprendizaje SENA · Dirección de Formación Profesional</p>
          <p className="text-[11px] text-slate-400 mt-1">Marco Reglamentario: Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026</p>
        </div>
      </footer>

    </div>
  );
};
