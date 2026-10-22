import React from 'react';
import { User, CheckCircle2, Moon, Sun, Share2, FileSpreadsheet, ShieldCheck, Eye, LogOut } from 'lucide-react';
import { ApprenticeProfile } from '../data/inductionContent';

interface HeaderProps {
  activeTab: 'modules' | 'dilemmas' | 'quiz' | 'rulebook' | 'certificate' | 'instructor';
  setActiveTab: (tab: 'modules' | 'dilemmas' | 'quiz' | 'rulebook' | 'certificate' | 'instructor') => void;
  profile: ApprenticeProfile;
  userRole: 'instructor' | 'aprendiz';
  onSwitchRole: (role: 'instructor' | 'aprendiz') => void;
  onOpenProfileModal: () => void;
  onOpenShareModal: () => void;
  onOpenRecordsModal: () => void;
  hasPassedQuiz: boolean;
  totalXp: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  lang: 'es' | 'en';
  onToggleLang: () => void;
}

const SENA_LOGO_SRC = "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e";

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  userRole,
  onSwitchRole,
  onOpenProfileModal,
  onOpenShareModal,
  onOpenRecordsModal,
  hasPassedQuiz,
  totalXp,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <img
              src={SENA_LOGO_SRC}
              alt="Logo Oficial SENA"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            onClick={() => setActiveTab(userRole === 'instructor' ? 'instructor' : 'modules')}
            className="text-left group cursor-pointer focus:outline-none min-w-0 truncate"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                Inducción SENA
              </span>
              <span className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${
                userRole === 'instructor' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {userRole === 'instructor' ? 'Instructor' : 'Aprendiz'}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium block truncate">
              Acuerdo 009 de 2024 · 2026
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          {/* Instructor-only Tab: Panel de Control & Seguimiento */}
          {userRole === 'instructor' && (
            <button
              onClick={() => setActiveTab('instructor')}
              className={`whitespace-nowrap transition-colors cursor-pointer py-1 flex items-center gap-1.5 font-bold ${
                activeTab === 'instructor'
                  ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Panel Instructor</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('modules')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'modules'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Módulos
          </button>
          <button
            onClick={() => setActiveTab('dilemmas')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'dilemmas'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dilemas Reales
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'quiz'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Evaluación
          </button>
          <button
            onClick={() => setActiveTab('rulebook')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'rulebook'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reglamento
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              activeTab === 'certificate'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{userRole === 'instructor' ? 'Certificados' : 'Mi Certificado'}</span>
            {hasPassedQuiz && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions, Profile & Dark Mode Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* XP only for students or informative */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{totalXp} XP</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="truncate max-w-[110px]">{profile.fichaCode ? `Ficha ${profile.fichaCode}` : 'SENA'}</span>
          </div>

          {/* INSTRUCTOR ONLY BUTTONS */}
          {userRole === 'instructor' ? (
            <>
              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                title="Generar enlace oficial para enviar a los aprendices"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="hidden sm:inline">Compartir a Aprendices</span>
              </button>

              <button
                onClick={onOpenRecordsModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                title="Consolidado de aprendices y exportación Excel/Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="hidden md:inline">Consolidado</span>
              </button>

              <button
                onClick={() => onSwitchRole('aprendiz')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Probar la vista exactamente como la verá el estudiante"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Vista Aprendiz</span>
              </button>
            </>
          ) : (
            /* APPRENDIZ VIEW - Restricted actions */
            <>
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                title="Editar mis datos personales para el certificado"
              >
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {profile.fullName ? profile.fullName.split(' ')[0] : 'Mis Datos'}
                </span>
                <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">· Mi Perfil</span>
              </button>

              {/* Switch to Landing Page for Instructor Access */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-[11px] text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors px-1 py-1 cursor-pointer"
                  title="¿Eres instructor? Ir al portal de acceso con clave"
                >
                  ¿Instructor?
                </button>
              )}
            </>
          )}

          {/* Logout / Cambiar Rol Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-950/40 dark:hover:text-red-300 dark:hover:border-red-800/60 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              title="Cerrar sesión y volver al portal de acceso"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Salir</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
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

          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="px-2.5 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs font-mono font-bold text-xs"
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <span>{lang === 'es' ? 'EN' : 'ES'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
