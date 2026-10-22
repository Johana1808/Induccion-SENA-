import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Award, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Zap, 
  Send, 
  Code, 
  HelpCircle,
  Eye,
  QrCode,
  Building,
  GraduationCap
} from 'lucide-react';
import { ApprenticeRecord, ApprenticeProfile } from '../data/inductionContent';
import { 
  getStoredWebhookUrl, 
  setStoredWebhookUrl, 
  sendRecordToGoogleSheet, 
  GOOGLE_APPS_SCRIPT_CODE,
  getStoredSheetUrl,
  setStoredSheetUrl
} from '../services/sheetSyncService';
import { t } from '../utils/i18n';

interface InstructorDashboardProps {
  records: ApprenticeRecord[];
  currentProfile: ApprenticeProfile;
  onUpdateProfile: (profile: ApprenticeProfile) => void;
  onSwitchToLearnerView: () => void;
  onResetRecords?: () => void;
  onOpenShareModal: () => void;
  lang?: 'es' | 'en';
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  records,
  currentProfile,
  onUpdateProfile,
  onSwitchToLearnerView,
  onResetRecords,
  onOpenShareModal,
  lang = 'es',
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Aprobado y Certificado' | 'Pendiente Evaluación'>('Todos');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Webhook & Sheet URL state
  const [webhookUrl, setWebhookUrl] = useState(() => getStoredWebhookUrl());
  const [customSheetUrl, setCustomSheetUrl] = useState(() => getStoredSheetUrl());
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Statistics
  const totalCount = records.length;
  const certifiedCount = records.filter(r => r.hasPassedQuiz).length;
  const inProgressCount = totalCount - certifiedCount;
  const averageScore = useMemo(() => {
    const scores = records.filter(r => r.quizScore !== null).map(r => r.quizScore as number);
    if (!scores.length) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesStatus = statusFilter === 'Todos' || r.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        r.fullName.toLowerCase().includes(q) ||
        r.documentNumber.includes(q) ||
        r.certificateCode.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, searchQuery]);

  // Clean shareable student URL with rol=aprendiz
  const studentInviteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set('rol', 'aprendiz');
    params.set('invitacion', '1');
    if (currentProfile.fichaCode) params.set('ficha', currentProfile.fichaCode.trim());
    if (currentProfile.programName) params.set('programa', currentProfile.programName.trim());
    if (currentProfile.trainingCenter) params.set('centro', currentProfile.trainingCenter.trim());
    if (currentProfile.regional) params.set('regional', currentProfile.regional.trim());
    if (currentProfile.modality) params.set('modalidad', currentProfile.modality);
    return `${baseUrl}?${params.toString()}`;
  }, [currentProfile]);

  const handleCopyStudentLink = () => {
    navigator.clipboard.writeText(studentInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const message = lang === 'en'
      ? `Dear SENA learners, here is the official link to complete the interactive Apprentice Rulebook induction (Agreement 009 of 2024 modified by Agreement 002 of 2026). Upon completing the modules and passing the assessment, you will obtain your official certificate under your name:\n\n${studentInviteUrl}`
      : `Estimados aprendices SENA, les comparto el enlace oficial para realizar la inducción interactiva al Reglamento del Aprendiz (Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026). Al completar los módulos y aprobar la evaluación, obtendrán su certificado oficial a su nombre:\n\n${studentInviteUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    setStoredWebhookUrl(url);
    if (testResult) setTestResult(null);
  };

  const handleSaveCustomSheetUrl = (url: string) => {
    setCustomSheetUrl(url);
    setStoredSheetUrl(url);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      setTestResult({
        success: false,
        message: 'Ingresa primero la URL de tu Webhook de Google Apps Script.',
      });
      return;
    }

    setIsTestingWebhook(true);
    setTestResult(null);

    const sampleRecord: ApprenticeRecord = records[0] || {
      id: `test-${Date.now()}`,
      fullName: 'Aprendiz Prueba SENA',
      documentType: 'C.C.',
      documentNumber: '1098765432',
      fichaCode: currentProfile.fichaCode || '2874910',
      programName: currentProfile.programName || 'Análisis y Desarrollo de Software',
      regional: currentProfile.regional || 'Distrito Capital',
      trainingCenter: currentProfile.trainingCenter || 'Centro de Tecnologías',
      modality: currentProfile.modality || 'Presencial',
      modulesCompleted: '6/6',
      quizScore: 100,
      hasPassedQuiz: true,
      status: 'Aprobado y Certificado',
      certificateCode: `SENA-PRUEBA-${Date.now().toString().slice(-4)}`,
      registrationDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      regulationFramework: 'Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026',
    };

    const res = await sendRecordToGoogleSheet(sampleRecord);
    setIsTestingWebhook(false);
    setTestResult(res);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nombre Completo',
      'Tipo de Documento',
      'Número de Documento',
      'Ficha de Caracterización',
      'Programa de Formación',
      'Regional',
      'Centro de Formación',
      'Modalidad',
      'Módulos Completados',
      'Puntaje Evaluación (%)',
      'Estado',
      'Código de Certificado',
      'Fecha de Registro',
      'Marco Reglamentario'
    ];

    const escapeCSV = (value: string | number | null | undefined) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredRecords.map((r, index) => [
      index + 1,
      escapeCSV(r.fullName),
      escapeCSV(r.documentType),
      escapeCSV(r.documentNumber),
      escapeCSV(r.fichaCode),
      escapeCSV(r.programName),
      escapeCSV(r.regional),
      escapeCSV(r.trainingCenter),
      escapeCSV(r.modality),
      escapeCSV(r.modulesCompleted),
      r.quizScore !== null ? r.quizScore : 'N/A',
      escapeCSV(r.status),
      escapeCSV(r.certificateCode),
      escapeCSV(r.registrationDate),
      escapeCSV(r.regulationFramework)
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Consolidado_SENA_Ficha_${currentProfile.fichaCode || 'General'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy TSV to clipboard
  const handleCopyForSheets = () => {
    const headers = [
      'Nombre Completo',
      'Tipo Documento',
      'Documento',
      'Ficha',
      'Programa',
      'Módulos',
      'Puntaje (%)',
      'Estado',
      'Código Certificado',
      'Fecha'
    ];

    const rows = filteredRecords.map(r => [
      r.fullName,
      r.documentType,
      r.documentNumber,
      r.fichaCode,
      r.programName,
      r.modulesCompleted,
      r.quizScore !== null ? `${r.quizScore}%` : 'N/A',
      r.status,
      r.certificateCode,
      r.registrationDate
    ]);

    const tsvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(tsvContent);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner: Instructor Identity & Role Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {lang === 'en' ? 'Exclusive Instructor Profile' : 'Perfil Exclusivo de Instructor'}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'en' ? 'Batch' : 'Ficha'} {currentProfile.fichaCode || '2874910'} · {currentProfile.programName}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t[lang].instructorPanelTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {lang === 'en'
              ? 'From this private dashboard you can configure automatic Google Sheets synchronization, generate an exclusive link for learners to take induction without settings access, and monitor grades and certificates.'
              : 'Desde este panel privado puedes configurar la sincronización automática con Google Sheets, generar el enlace exclusivo para que tus estudiantes hagan la inducción sin acceso a la configuración, y monitorear sus calificaciones y certificados.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onSwitchToLearnerView}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            title={lang === 'en' ? 'View platform exactly as your students see it' : 'Ver la plataforma exactamente como la ven tus estudiantes'}
          >
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t[lang].learnerView}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>{t[lang].shareToLearners}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t[lang].statTotalLearners}</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{lang === 'en' ? 'Enrolled in batch' : 'Registrados en la ficha'}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">{t[lang].statCertified}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-800 dark:text-emerald-300 mt-2">{certifiedCount}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
            {totalCount > 0 ? `${Math.round((certifiedCount / totalCount) * 100)}% ${lang === 'en' ? 'pass rate' : 'de aprobación'}` : '0%'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800 dark:text-amber-400">{t[lang].statInProgress}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-amber-800 dark:text-amber-300 mt-2">{inProgressCount}</p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">{lang === 'en' ? 'Completing modules' : 'Completando módulos'}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t[lang].statAvgScore}</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">{averageScore}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{lang === 'en' ? 'Assessment average' : 'Calificación de evaluación'}</span>
        </div>
      </div>

      {/* Two Column Grid: Link Generator Card + Google Sheets Webhook Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Student Link Generator (Left - 6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Share2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t[lang].instructorCardLinkTitle}
                </h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                {t[lang].roleSecureBadge}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t[lang].instructorCardLinkDesc}
            </p>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                {t[lang].urlGeneratedFor} {currentProfile.fichaCode || '2874910'}:
              </span>
              <p className="text-xs font-mono text-emerald-800 dark:text-emerald-400 break-all select-all py-1 bg-white dark:bg-slate-900 px-2.5 rounded border border-slate-200 dark:border-slate-700">
                {studentInviteUrl}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleCopyStudentLink}
              className="flex-1 min-w-[180px] px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? t[lang].learnerLinkCopiedBtn : t[lang].copyLearnerLinkBtn}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{t[lang].sendWhatsappBtn}</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title={lang === 'en' ? 'More customization options and QR code' : 'Más opciones de personalización y código QR'}
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Automatic Google Sheets Sync (Right - 6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t[lang].sheetsSyncCardTitle}
                </h2>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                webhookUrl 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}>
                {webhookUrl ? t[lang].syncActiveBadge : t[lang].syncPendingBadge}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t[lang].sheetsSyncCardDesc}
            </p>

            <div className="mt-3 space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t[lang].webhookInputLabel}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={webhookUrl}
                    onChange={(e) => handleSaveWebhook(e.target.value)}
                    className="flex-1 text-xs py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                  <button
                    type="button"
                    disabled={isTestingWebhook}
                    onClick={handleTestWebhook}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    title={lang === 'en' ? 'Send a test row to verify sheet connection' : 'Envía una fila de prueba para comprobar que tu hoja recibe los datos'}
                  >
                    {isTestingWebhook ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isTestingWebhook ? t[lang].testingWebhook : t[lang].testSendBtn}</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  testResult.success 
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80' 
                    : 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/80'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-800" /> : <Clock className="w-4 h-4 shrink-0" />}
                  <span className="font-medium text-[11px]">{testResult.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowScriptGuide(!showScriptGuide)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showScriptGuide ? t[lang].hideGuideBtn : t[lang].showGuideBtn}</span>
            </button>

            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t[lang].createSheetBtn}</span>
            </a>

            {customSheetUrl && customSheetUrl.startsWith('http') && (
              <a
                href={customSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t[lang].openDriveSheetBtn}</span>
              </a>
            )}
          </div>

          {showScriptGuide && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                  {t[lang].guideInstructionsTitle}
                </span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? t[lang].scriptCopiedBtn : t[lang].copyScriptCodeBtn}</span>
                </button>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>{t[lang].step1}</li>
                <li>{t[lang].step2}</li>
                <li>{t[lang].step3}</li>
                <li>{t[lang].step4}</li>
              </ol>
            </div>
          )}
        </div>

      </div>

      {/* Main Consolidated Table: Student Records & CSV/Sheets Export */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              {t[lang].liveLedgerTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t[lang].liveLedgerDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyForSheets}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title={lang === 'en' ? 'Copy tab-separated data to paste directly into Google Sheets or Excel with Ctrl+V' : 'Copiar datos tabulados para pegar directamente en cualquier Google Sheet o Excel con Ctrl+V'}
            >
              {copiedTable ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedTable ? t[lang].copiedForSheetsBtn : t[lang].copyForSheetsBtn}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              title={lang === 'en' ? 'Download .CSV file with UTF-8 format compatible with Microsoft Excel and Google Drive' : 'Descargar archivo .CSV con formato UTF-8 compatible con Microsoft Excel y Google Drive'}
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? t[lang].csvDownloadedBtn : t[lang].downloadCsvBtn}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t[lang].searchLearner}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="Todos">{t[lang].allStatusesOption} ({totalCount})</option>
              <option value="Aprobado y Certificado">{t[lang].approvedAndCertifiedOption} ({certifiedCount})</option>
              <option value="Pendiente Evaluación">{t[lang].pendingEvaluationOption} ({inProgressCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <span>{t[lang].showingCount} <strong>{filteredRecords.length}</strong> {t[lang].ofCount} {records.length} {t[lang].learnersCount}</span>
            {onResetRecords && (
              <button
                onClick={onResetRecords}
                className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t[lang].resetSampleDataBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">{t[lang].tableColNumber}</th>
                <th className="px-4 py-3">{t[lang].tableColLearner}</th>
                <th className="px-4 py-3">{t[lang].tableColDoc}</th>
                <th className="px-4 py-3">{t[lang].tableColFichaProgram}</th>
                <th className="px-4 py-3 text-center">{t[lang].tableColModules}</th>
                <th className="px-4 py-3 text-center">{t[lang].tableColQuiz}</th>
                <th className="px-4 py-3">{t[lang].tableColStatus}</th>
                <th className="px-4 py-3">{t[lang].tableColCertCode}</th>
                <th className="px-4 py-3">{t[lang].tableColRegDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                    {t[lang].noLearnersFoundText}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr 
                    key={r.id || idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.fullName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{r.documentType}</span>
                      <span className="font-mono font-medium">{r.documentNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate" title={`${r.programName} (${r.fichaCode})`}>
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{r.fichaCode}</span>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px] truncate">{r.programName}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold">
                      {r.modulesCompleted}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.quizScore !== null ? (
                        <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          r.quizScore >= 70 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {r.quizScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.hasPassedQuiz ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t[lang].statusCertifiedLabel}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t[lang].statusInProgressLabel}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {r.certificateCode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400">
                      {r.registrationDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
