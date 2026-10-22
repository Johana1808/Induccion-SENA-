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

interface InstructorDashboardProps {
  records: ApprenticeRecord[];
  currentProfile: ApprenticeProfile;
  onUpdateProfile: (profile: ApprenticeProfile) => void;
  onSwitchToLearnerView: () => void;
  onResetRecords?: () => void;
  onOpenShareModal: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  records,
  currentProfile,
  onUpdateProfile,
  onSwitchToLearnerView,
  onResetRecords,
  onOpenShareModal,
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
    const message = `Estimados aprendices SENA, les comparto el enlace oficial para realizar la inducción interactiva al Reglamento del Aprendiz (Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026). Al completar los módulos y aprobar la evaluación, obtendrán su certificado oficial a su nombre:\n\n${studentInviteUrl}`;
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
              Perfil Exclusivo de Instructor
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ficha {currentProfile.fichaCode || '2874910'} · {currentProfile.programName}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Panel de Control y Seguimiento de Aprendices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Desde este panel privado puedes configurar la sincronización automática con Google Sheets, generar el enlace exclusivo para que tus estudiantes hagan la inducción sin acceso a la configuración, y monitorear sus calificaciones y certificados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onSwitchToLearnerView}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            title="Ver la plataforma exactamente como la ven tus estudiantes"
          >
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ver Modo Aprendiz</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir a Aprendices</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Aprendices</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Registrados en la ficha</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">Certificados Oficiales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-800 dark:text-emerald-300 mt-2">{certifiedCount}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
            {totalCount > 0 ? `${Math.round((certifiedCount / totalCount) * 100)}% de aprobación` : '0%'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800 dark:text-amber-400">En Proceso / Pendientes</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-amber-800 dark:text-amber-300 mt-2">{inProgressCount}</p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">Completando módulos</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Promedio General</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">{averageScore}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Calificación de evaluación</span>
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
                  Enlace Oficial para los Aprendices
                </h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                Rol Aprendiz Seguro
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Comparte este enlace a tus aprendices por WhatsApp, correo o Teams. Al abrirlo, <strong>solo verán la inducción, la evaluación y su propio certificado</strong>. No tendrán acceso a este panel de instructor ni a la configuración de hojas de cálculo.
            </p>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                URL generada para la Ficha {currentProfile.fichaCode || '2874910'}:
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
              <span>{copiedLink ? '¡Enlace de Aprendices Copiado!' : 'Copiar Enlace para Aprendices'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="Más opciones de personalización y código QR"
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
                  Sincronización Automática con Google Sheets
                </h2>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                webhookUrl 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}>
                {webhookUrl ? '● Sincronización Activa' : '○ Webhook Pendiente'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Conecta tu Google Sheet mediante Google Apps Script. Cada vez que un aprendiz apruebe la inducción, su fila se insertará automáticamente en tu hoja de Google Drive en segundo plano.
            </p>

            <div className="mt-3 space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  URL Webhook de tu Hoja de Google Sheets:
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
                    title="Envía una fila de prueba para comprobar que tu hoja recibe los datos"
                  >
                    {isTestingWebhook ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Probar Envío</span>
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
              <span>{showScriptGuide ? 'Ocultar Guía' : 'Ver Guía de Conexión en 1 min'}</span>
            </button>

            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Crear Hoja (sheets.new)</span>
            </a>

            {customSheetUrl && customSheetUrl.startsWith('http') && (
              <a
                href={customSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Abrir mi Hoja de Drive</span>
              </a>
            )}
          </div>

          {showScriptGuide && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                  Instrucciones en 4 pasos:
                </span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? '¡Copiado!' : 'Copiar Código de Apps Script'}</span>
                </button>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>Abre tu Google Sheet en Google Drive.</li>
                <li>Ve a <strong>Extensiones &gt; Apps Script</strong> y borra todo el contenido.</li>
                <li>Pega el código copiado con el botón de arriba.</li>
                <li>Haz clic en <strong>Implementar &gt; Nueva implementación</strong>, tipo <strong>Aplicación web</strong>, acceso: <strong>Cualquier usuario</strong>. Copia la URL generada y pégala aquí.</li>
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
              Consolidado de Aprendices en Tiempo Real
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualiza en vivo el progreso, puntajes y códigos de certificación generados por los aprendices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyForSheets}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Copiar datos tabulados para pegar directamente en cualquier Google Sheet o Excel con Ctrl+V"
            >
              {copiedTable ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedTable ? '¡Copiado para Sheets!' : 'Copiar para Sheets / Excel'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              title="Descargar archivo .CSV con formato UTF-8 compatible con Microsoft Excel y Google Drive"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? '¡Archivo Descargado!' : 'Descargar Archivo CSV'}</span>
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
                placeholder="Buscar aprendiz por nombre, documento o certificado..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="Todos">Todos los estados ({totalCount})</option>
              <option value="Aprobado y Certificado">Aprobados y Certificados ({certifiedCount})</option>
              <option value="Pendiente Evaluación">En Proceso / Pendientes ({inProgressCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <span>Mostrando <strong>{filteredRecords.length}</strong> de {records.length} aprendices</span>
            {onResetRecords && (
              <button
                onClick={onResetRecords}
                className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer datos muestra</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Aprendiz</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Ficha / Programa</th>
                <th className="px-4 py-3 text-center">Módulos</th>
                <th className="px-4 py-3 text-center">Evaluación</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Código Certificado</th>
                <th className="px-4 py-3">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                    No se encontraron aprendices con ese criterio de búsqueda.
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
                          <span>Certificado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>En Proceso</span>
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
