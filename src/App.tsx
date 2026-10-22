import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_PROFILE, 
  ApprenticeProfile, 
  INDUCTION_MODULES, 
  CASE_DILEMMAS,
  BADGES_LIST,
  ApprenticeRecord,
  SEED_STUDENTS_RECORDS 
} from './data/inductionContent';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ModuleViewer } from './components/ModuleViewer';
import { DilemmasSimulator } from './components/DilemmasSimulator';
import { GamifiedAssessment } from './components/GamifiedAssessment';
import { RulebookExplorer } from './components/RulebookExplorer';
import { CertificateView } from './components/CertificateView';
import { LearnerProfileModal } from './components/LearnerProfileModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { StudentWelcomeModal } from './components/StudentWelcomeModal';
import { ApprenticeRecordsModal } from './components/ApprenticeRecordsModal';
import { ApprenticeBadgesHUD } from './components/ApprenticeBadgesHUD';
import { InstructorDashboard } from './components/InstructorDashboard';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { sendRecordToGoogleSheet } from './services/sheetSyncService';
import { 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Search, 
  Award, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Load profile from localStorage if available
  const [profile, setProfile] = useState<ApprenticeProfile>(() => {
    try {
      const saved = localStorage.getItem('sena_apprentice_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  // User Role Management: Instructor has full control & Sheets config; Aprendiz has student induction
  const [userRole, setUserRole] = useState<'instructor' | 'aprendiz'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedSession = sessionStorage.getItem('sena_session_role') || localStorage.getItem('sena_session_role');
        if (savedSession === 'instructor' || savedSession === 'aprendiz') {
          return savedSession;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const roleParam = urlParams.get('rol');
        if (roleParam === 'aprendiz' || urlParams.get('invitacion') === '1') {
          return 'aprendiz';
        }
        if (roleParam === 'instructor') {
          return 'instructor';
        }
      }
    } catch (e) {
      // ignore
    }
    return 'instructor';
  });

  // Session Authentication: null shows the dedicated RoleSelectionLanding page
  const [sessionRole, setSessionRole] = useState<'instructor' | 'aprendiz' | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        // If invitation link is clicked, always present the apprentice characterization portal
        if (urlParams.get('invitacion') === '1') {
          return null;
        }
        const savedSession = sessionStorage.getItem('sena_session_role') || localStorage.getItem('sena_session_role');
        if (savedSession === 'instructor' || savedSession === 'aprendiz') {
          return savedSession;
        }
      }
    } catch (e) {
      // ignore
    }
    return null; // By default show landing page for clean role selection
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'modules' | 'dilemmas' | 'quiz' | 'rulebook' | 'certificate' | 'instructor'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('rol') === 'aprendiz' || urlParams.get('invitacion') === '1') {
          return 'modules';
        }
      }
    } catch (e) {}
    return 'instructor';
  });

  // Persist user role
  useEffect(() => {
    try {
      localStorage.setItem('sena_user_role', userRole);
    } catch (e) {}
  }, [userRole]);

  const handleLoginAsInstructor = () => {
    setSessionRole('instructor');
    setUserRole('instructor');
    setActiveTab('instructor');
    try {
      sessionStorage.setItem('sena_session_role', 'instructor');
      localStorage.setItem('sena_session_role', 'instructor');
      localStorage.setItem('sena_user_role', 'instructor');
    } catch (e) {}
  };

  const handleLoginAsLearner = (updatedProfile: ApprenticeProfile) => {
    setProfile(updatedProfile);
    setSessionRole('aprendiz');
    setUserRole('aprendiz');
    setActiveTab('modules');
    try {
      localStorage.setItem('sena_apprentice_profile', JSON.stringify(updatedProfile));
      sessionStorage.setItem('sena_session_role', 'aprendiz');
      localStorage.setItem('sena_session_role', 'aprendiz');
      localStorage.setItem('sena_user_role', 'aprendiz');
    } catch (e) {}
  };

  const handleLogout = () => {
    setSessionRole(null);
    try {
      sessionStorage.removeItem('sena_session_role');
      localStorage.removeItem('sena_session_role');
    } catch (e) {}
  };

  const [studentsRecords, setStudentsRecords] = useState<ApprenticeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sena_students_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return SEED_STUDENTS_RECORDS;
  });

  // Detect URL query parameters from shared link
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const urlParams = new URLSearchParams(window.location.search);
      const isInvitation = urlParams.get('invitacion') === '1';
      const paramFicha = urlParams.get('ficha');
      const paramPrograma = urlParams.get('programa');
      const paramCentro = urlParams.get('centro');
      const paramRegional = urlParams.get('regional');
      const paramModalidad = urlParams.get('modalidad');
      const paramNombre = urlParams.get('nombre');
      const paramDoc = urlParams.get('doc');
      const paramDocTipo = urlParams.get('docTipo');

      const roleParam = urlParams.get('rol');
      if (roleParam === 'aprendiz' || isInvitation) {
        setUserRole('aprendiz');
        setActiveTab(prev => prev === 'instructor' ? 'modules' : prev);
      } else if (roleParam === 'instructor') {
        setUserRole('instructor');
      }

      if (isInvitation || paramFicha || paramPrograma) {
        setProfile(prev => ({
          ...prev,
          fichaCode: paramFicha || prev.fichaCode,
          programName: paramPrograma || prev.programName,
          trainingCenter: paramCentro || prev.trainingCenter,
          regional: paramRegional || prev.regional,
          modality: (paramModalidad as any) || prev.modality,
          fullName: paramNombre || prev.fullName,
          documentNumber: paramDoc || prev.documentNumber,
          documentType: paramDocTipo || prev.documentType,
        }));

        // If it's a student opening an invitation link without pre-filled name, prompt them
        if (!paramNombre) {
          const registered = localStorage.getItem('sena_custom_student_registered');
          if (!registered) {
            setIsWelcomeModalOpen(true);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Gamification progress states
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sena_completed_modules');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return ['mod-1']; // starts with module 1 completed as initial welcoming momentum
  });

  const [solvedDilemmas, setSolvedDilemmas] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sena_solved_dilemmas');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {};
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sena_total_xp');
      if (saved) return Number(saved);
    } catch (e) {
      // ignore
    }
    return 150; // starts with 150 XP for initial module 1
  });

  const [quizScore, setQuizScore] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('sena_quiz_score');
      if (saved) return Number(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [hasPassedQuiz, setHasPassedQuiz] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sena_has_passed_quiz');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return false;
  });

  // Dark mode state with persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sena_dark_mode');
      if (saved !== null) return saved === 'true';
    } catch (e) {
      // ignore
    }
    return false;
  });

  const [isBlurActive, setIsBlurActive] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sync dark class with document element
  useEffect(() => {
    try {
      localStorage.setItem('sena_dark_mode', String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // ignore
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    // Trigger screen blur effect requested by user
    setIsBlurActive(true);
    setTimeout(() => {
      setIsBlurActive(false);
    }, 700);
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sena_apprentice_profile', JSON.stringify(profile));
      localStorage.setItem('sena_completed_modules', JSON.stringify(completedModules));
      localStorage.setItem('sena_solved_dilemmas', JSON.stringify(solvedDilemmas));
      localStorage.setItem('sena_total_xp', String(totalXp));
      localStorage.setItem('sena_quiz_score', quizScore !== null ? String(quizScore) : '');
      localStorage.setItem('sena_has_passed_quiz', JSON.stringify(hasPassedQuiz));
    } catch (e) {
      // ignore
    }
  }, [profile, completedModules, solvedDilemmas, totalXp, quizScore, hasPassedQuiz]);

  // Save student records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sena_students_records', JSON.stringify(studentsRecords));
    } catch (e) {
      // ignore
    }
  }, [studentsRecords]);

  // Keep ledger updated with current session's apprentice progress
  useEffect(() => {
    if (!profile.fullName) return;

    setStudentsRecords(prev => {
      const cleanDoc = profile.documentNumber.replace(/\D/g, '') || '1098765432';
      const cleanFicha = profile.fichaCode.replace(/\D/g, '') || '2874910';
      const certCode = hasPassedQuiz 
        ? `SENA-IND-${cleanFicha}-${cleanDoc.slice(-4)}-2026` 
        : 'En trámite';
      const currentStatus = hasPassedQuiz 
        ? 'Aprobado y Certificado' 
        : (quizScore !== null ? 'Pendiente Evaluación' : 'En Proceso');

      const existingIndex = prev.findIndex(r => r.documentNumber === profile.documentNumber);
      const updatedRecord: ApprenticeRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `rec-${Date.now()}`,
        fullName: profile.fullName,
        documentType: profile.documentType,
        documentNumber: profile.documentNumber,
        fichaCode: profile.fichaCode,
        programName: profile.programName,
        regional: profile.regional,
        trainingCenter: profile.trainingCenter,
        modality: profile.modality,
        modulesCompleted: `${completedModules.length}/${INDUCTION_MODULES.length}`,
        quizScore: quizScore,
        hasPassedQuiz: hasPassedQuiz,
        status: currentStatus,
        certificateCode: certCode,
        registrationDate: prev[existingIndex]?.registrationDate || new Date().toISOString().slice(0, 16).replace('T', ' '),
        regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
      };

      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = updatedRecord;
        return next;
      } else {
        return [updatedRecord, ...prev];
      }
    });
  }, [profile, completedModules.length, quizScore, hasPassedQuiz]);

  const handleSaveProfile = (newProfile: ApprenticeProfile) => {
    setProfile(newProfile);
  };

  const handleCompleteModule = (moduleId: string, xpGain: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
      setTotalXp(prev => prev + xpGain);
    }
  };

  const handleSolveDilemma = (dilemmaId: string, optionIndex: number, points: number) => {
    setSolvedDilemmas(prev => ({
      ...prev,
      [dilemmaId]: optionIndex
    }));
    if (points > 0) {
      setTotalXp(prev => prev + points);
    }
  };

  const handleCompleteQuiz = (scorePercent: number, correctCount: number, xpGain: number) => {
    setQuizScore(scorePercent);
    setTotalXp(prev => prev + xpGain);
    const passed = scorePercent >= 70;
    if (passed) {
      setHasPassedQuiz(true);
    }

    // Auto-sync record directly to Google Sheets / instructor ledger in background
    const cleanDoc = profile.documentNumber.replace(/\D/g, '') || '1098765432';
    const cleanFicha = profile.fichaCode.replace(/\D/g, '') || '2874910';
    const certCode = passed ? `SENA-IND-${cleanFicha}-${cleanDoc.slice(-4)}-2026` : 'En trámite';
    const currentRecord: ApprenticeRecord = {
      id: `rec-${profile.documentNumber}-${Date.now()}`,
      fullName: profile.fullName || 'Aprendiz SENA',
      documentType: profile.documentType || 'C.C.',
      documentNumber: profile.documentNumber || '1098765432',
      fichaCode: profile.fichaCode || '2874910',
      programName: profile.programName || 'Formación SENA',
      regional: profile.regional || 'Distrito Capital',
      trainingCenter: profile.trainingCenter || 'Centro de Formación',
      modality: profile.modality || 'Presencial',
      modulesCompleted: `${completedModules.length}/${INDUCTION_MODULES.length}`,
      quizScore: scorePercent,
      hasPassedQuiz: passed,
      status: passed ? 'Aprobado y Certificado' : 'Pendiente Evaluación',
      certificateCode: certCode,
      registrationDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
    };

    sendRecordToGoogleSheet(currentRecord).then(res => {
      setSyncToast(res.message);
      setTimeout(() => setSyncToast(null), 5000);
    });
  };

  // Dedicated Landing Page for Role Selection & Characterization Form
  if (!sessionRole) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialRoleParam = urlParams?.get('rol') === 'instructor' ? 'instructor' : 'aprendiz';

    return (
      <RoleSelectionLanding
        currentProfile={profile}
        initialRole={initialRoleParam}
        onLoginAsInstructor={handleLoginAsInstructor}
        onLoginAsLearner={handleLoginAsLearner}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-600 selection:text-white transition-colors duration-200 relative">
      
      {/* Screen Blur Overlay effect when dark mode applies */}
      {isBlurActive && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none animate-dark-blur backdrop-blur-md" 
          aria-hidden="true" 
        />
      )}

      {/* Ambient background glow & depth when dark mode is active */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Top Bar Contract compliant Header with Dark Mode Toggle & Role Logout */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        userRole={userRole}
        onSwitchRole={(newRole) => {
          if (newRole === 'aprendiz') {
            setUserRole('aprendiz');
            setActiveTab('modules');
          } else {
            if (sessionRole === 'instructor') {
              setUserRole('instructor');
              setActiveTab('instructor');
            } else {
              handleLogout();
            }
          }
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenRecordsModal={() => setIsRecordsModalOpen(true)}
        hasPassedQuiz={hasPassedQuiz}
        totalXp={totalXp}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={handleLogout}
      />

      {/* Modo Aprendiz Active Banner for Testing Instructors */}
      {userRole === 'aprendiz' && (
        <div className="bg-emerald-900 text-white text-xs px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-emerald-100">
              Modo Aprendiz Activo: Pantalla exclusiva de inducción y certificación del estudiante.
            </span>
          </div>
          <button
            onClick={() => {
              if (sessionRole === 'instructor') {
                setUserRole('instructor');
                setActiveTab('instructor');
              } else {
                handleLogout();
              }
            }}
            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Cambiar perfil o volver al portal de acceso con clave"
          >
            <span>{sessionRole === 'instructor' ? 'Volver al Panel del Instructor' : 'Cambiar Rol / Salir'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* If Instructor Mode and Instructor Tab is Active: Render the Full Instructor Dashboard */}
        {userRole === 'instructor' && activeTab === 'instructor' ? (
          <InstructorDashboard
            records={studentsRecords}
            currentProfile={profile}
            onUpdateProfile={setProfile}
            onSwitchToLearnerView={() => {
              setUserRole('aprendiz');
              setActiveTab('modules');
            }}
            onResetRecords={() => setStudentsRecords(SEED_STUDENTS_RECORDS)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        ) : (
          /* Standard Induction Journey for Students (and instructor previewing modules) */
          <>
            {/* Hero Section */}
            <HeroBanner
              profile={profile}
              userRole={userRole}
              onOpenInstructorPanel={() => setActiveTab('instructor')}
              totalXp={totalXp}
              completedModulesCount={completedModules.length}
              totalModulesCount={INDUCTION_MODULES.length}
              dilemmasSolvedCount={Object.keys(solvedDilemmas).length}
              totalDilemmasCount={CASE_DILEMMAS.length}
              quizScore={quizScore}
              hasPassedQuiz={hasPassedQuiz}
              onStartInduction={() => setActiveTab('modules')}
              onOpenEvaluation={() => setActiveTab('quiz')}
              onOpenCertificate={() => setActiveTab('certificate')}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenRecordsModal={() => setIsRecordsModalOpen(true)}
            />

            {/* Workspace Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Sub-navigation Segmented Control */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-slate-200/70 dark:bg-slate-900 rounded-xl border border-slate-300/80 dark:border-slate-800 transition-colors duration-200">
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'modules'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>1. Módulos del Reglamento</span>
              </button>

              <button
                onClick={() => setActiveTab('dilemmas')}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'dilemmas'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>2. Dilemas Prácticos</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>3. Evaluación Gamificada</span>
              </button>

              <button
                onClick={() => setActiveTab('rulebook')}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'rulebook'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Search className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>4. Buscador Normativo</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'certificate'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : hasPassedQuiz
                  ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200/80 dark:hover:bg-emerald-900/60'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>5. Certificado Oficial</span>
              {hasPassedQuiz && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-0.5" />
              )}
            </button>
          </div>

          {/* Active View */}
          {activeTab === 'modules' && (
            <ModuleViewer
              completedModules={completedModules}
              onCompleteModule={handleCompleteModule}
              onGoToDilemmas={() => setActiveTab('dilemmas')}
            />
          )}

          {activeTab === 'dilemmas' && (
            <DilemmasSimulator
              solvedDilemmas={solvedDilemmas}
              onSolveDilemma={handleSolveDilemma}
              onGoToQuiz={() => setActiveTab('quiz')}
            />
          )}

          {activeTab === 'quiz' && (
            <GamifiedAssessment
              onCompleteQuiz={handleCompleteQuiz}
              onGoToCertificate={() => setActiveTab('certificate')}
              bestScore={quizScore}
            />
          )}

          {activeTab === 'rulebook' && (
            <RulebookExplorer />
          )}

          {activeTab === 'certificate' && (
            <CertificateView
              profile={profile}
              hasPassedQuiz={hasPassedQuiz}
              quizScore={quizScore}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
              onGoToQuiz={() => setActiveTab('quiz')}
            />
          )}

          {/* Gamification Medals & Badges HUD */}
          <ApprenticeBadgesHUD totalXp={totalXp} />

          {/* Institutional Rest & Campus Showcase Section */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Infraestructura y Convivencia</span>
                    <span>·</span>
                    <span>Centros de Formación</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Tu Centro de Formación: Espacio de Innovación y Cuidado Mutuo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Los ambientes de formación, laboratorios de robótica, aulas especializadas y zonas verdes son patrimonio de todos los colombianos. Conocer y aplicar el Reglamento del Aprendiz (Acuerdo 009 de 2024) garantiza una convivencia armónica y el mejor aprovechamiento de las oportunidades que el SENA te brinda.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>33 Regionales a Nivel Nacional</span>
                  <span>118 Centros de Formación</span>
                </div>
              </div>

              <div className="lg:col-span-7 relative min-h-[220px]">
                <img
                  src="/src/assets/images/sena_campus_lab_1792526464539.jpg"
                  alt="Centro de Formación e Innovación SENA"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </section>

        </div>
          </>
        )}

      </main>

      {/* Profile Editing Modal */}
      <LearnerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Share Link Modal for Instructors */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentProfile={profile}
        onOpenRecordsModal={() => setIsRecordsModalOpen(true)}
      />

      {/* Student Welcome Onboarding for Individual Certification */}
      <StudentWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Instructor Apprentice Records & CSV/Excel Export Modal */}
      <ApprenticeRecordsModal
        isOpen={isRecordsModalOpen}
        onClose={() => setIsRecordsModalOpen(false)}
        records={studentsRecords}
        onResetRecords={() => setStudentsRecords(SEED_STUDENTS_RECORDS)}
        currentFicha={profile.fichaCode}
      />

      {/* Anti-slop Restrained Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">
              SENA
            </div>
            <span>Servicio Nacional de Aprendizaje SENA · Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026</span>
          </div>

          <div className="flex items-center gap-5 text-slate-600 dark:text-slate-400">
            <a
              href="https://oferta.senasofiaplus.edu.co"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>SofíaPlus</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://zajuna.sena.edu.co"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>Zajuna LMS</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://ape.sena.edu.co"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>Agencia Pública de Empleo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {userRole === 'aprendiz' && (
              <button
                onClick={() => {
                  if (sessionRole === 'instructor') {
                    setUserRole('instructor');
                    setActiveTab('instructor');
                  } else {
                    handleLogout();
                  }
                }}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 font-medium"
                title="Acceso para instructores con contraseña"
              >
                Acceso Instructor
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Synchronization Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 dark:bg-black/95 text-white p-3.5 rounded-xl shadow-2xl border border-emerald-500/40 backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-bold text-emerald-300 block mb-0.5">Sincronización Automática</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">{syncToast}</p>
          </div>
        </div>
      )}

    </div>
  );
}
