import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  Zap,
  Send,
  HelpCircle,
  Code
} from 'lucide-react';
import { ApprenticeRecord } from '../data/inductionContent';
import { 
  getStoredWebhookUrl, 
  setStoredWebhookUrl, 
  sendRecordToGoogleSheet, 
  GOOGLE_APPS_SCRIPT_CODE,
  getSyncLogs
} from '../services/sheetSyncService';

interface ApprenticeRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ApprenticeRecord[];
  onAddRecord?: (record: ApprenticeRecord) => void;
  onResetRecords?: () => void;
  currentFicha: string;
  lang?: 'es' | 'en';
}

export const ApprenticeRecordsModal: React.FC<ApprenticeRecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  onResetRecords,
  currentFicha,
  lang = 'es',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Aprobado y Certificado' | 'Pendiente Evaluación'>('Todos');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [customSheetUrl, setCustomSheetUrl] = useState(() => {
    return localStorage.getItem('sena_custom_sheets_url') || '';
  });

  const handleSaveCustomUrl = (url: string) => {
    setCustomSheetUrl(url);
    localStorage.setItem('sena_custom_sheets_url', url);
  };

  const [webhookUrl, setWebhookUrl] = useState(() => getStoredWebhookUrl());
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    setStoredWebhookUrl(url);
    if (testResult) setTestResult(null);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      setTestResult({
        success: false,
        message: 'Por favor ingresa primero la URL de tu Webhook de Google Apps Script.',
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
      fichaCode: currentFicha || '2874910',
      programName: 'Análisis y Desarrollo de Software',
      regional: 'Distrito Capital',
      trainingCenter: 'Centro de Tecnologías de la Información',
      modality: 'Presencial',
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

  if (!isOpen) return null;

  // Export to CSV with UTF-8 BOM for Microsoft Excel and Google Sheets
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
    link.setAttribute('download', `Induccion_SENA_Ficha_${currentFicha || 'Consolidado'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy Tab-Separated Values (TSV) to clipboard for 1-click paste into Google Sheets / Excel
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Consolidated Learner Directory & Records' : 'Consolidado y Registro de Aprendices'}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {lang === 'en' ? 'Batch' : 'Ficha'} {currentFicha || '2874910'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'en'
                  ? 'Download report compatible with Excel and Google Drive without external login'
                  : 'Descarga el informe en archivo compatible con Excel y Google Drive sin requerir permisos externos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar & Summary Stats */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4 shrink-0 bg-white dark:bg-slate-900">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">{lang === 'en' ? 'Total Learners' : 'Total Aprendices'}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">{totalCount}</span>
            </div>
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60">
              <span className="text-emerald-700 dark:text-emerald-400 block font-medium">{lang === 'en' ? 'Passed & Certified' : 'Aprobados y Certificados'}</span>
              <span className="text-xl font-bold text-emerald-800 dark:text-emerald-300 font-mono mt-0.5 block">{certifiedCount}</span>
            </div>
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200/70 dark:border-amber-800/60">
              <span className="text-amber-700 dark:text-amber-400 block font-medium">{lang === 'en' ? 'In Progress / Pending' : 'En Proceso / Pendientes'}</span>
              <span className="text-xl font-bold text-amber-800 dark:text-amber-300 font-mono mt-0.5 block">{inProgressCount}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">{lang === 'en' ? 'Average Score' : 'Promedio Calificación'}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">{averageScore}%</span>
            </div>
          </div>

          {/* Export & Filter Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            {/* Search and Filter */}
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search by learner or document...' : 'Buscar por aprendiz o documento...'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="Todos">{lang === 'en' ? 'All statuses' : 'Todos los estados'}</option>
                <option value="Aprobado y Certificado">{lang === 'en' ? 'Passed' : 'Aprobados'}</option>
                <option value="Pendiente Evaluación">{lang === 'en' ? 'Pending' : 'Pendientes'}</option>
              </select>
            </div>

            {/* Main Export Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyForSheets}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={lang === 'en' ? 'Copy tab-separated data to paste into Google Sheets or Excel with Ctrl+V' : 'Copiar datos tabulados para pegar directamente en Google Sheets o Excel con Ctrl+V'}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400">{lang === 'en' ? 'Copied for Sheets!' : '¡Copiado para Sheets!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{lang === 'en' ? 'Copy for Sheets / Excel' : 'Copiar para Sheets / Excel'}</span>
                  </>
                )}
              </button>

              <a
                href="https://sheets.new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={lang === 'en' ? 'Opens a new Google Sheet ready to paste (Ctrl+V)' : 'Abre una nueva Hoja de Cálculo en Google Drive lista para pegar (Ctrl+V)'}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Open Google Sheets (sheets.new)' : 'Abrir Google Sheets (sheets.new)'}</span>
              </a>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                title={lang === 'en' ? 'Download .CSV file UTF-8 formatted' : 'Descargar archivo .CSV con formato UTF-8 listo para abrir en Excel o Google Drive'}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>{lang === 'en' ? 'Downloaded!' : '¡Descargado!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Download CSV File' : 'Descargar Archivo CSV'}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Sincronización Automática con Google Sheets & Enlace a Drive */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    {lang === 'en' ? 'Automatic Google Sheets Synchronization' : 'Sincronización Automática con Google Sheets'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'en'
                      ? 'Inserts each learner automatically into your Drive sheet upon certification (no login needed for students)'
                      : 'Inserta cada aprendiz automáticamente en tu hoja de Drive al certificarse (sin pedir login al estudiante)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowScriptGuide(!showScriptGuide)}
                  className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 rounded-md hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3 h-3" />
                  <span>{showScriptGuide ? (lang === 'en' ? 'Hide Guide' : 'Ocultar Guía') : (lang === 'en' ? 'View 1-min Connection Guide' : 'Ver Guía de Conexión en 1 min')}</span>
                </button>
              </div>
            </div>

            {/* Inputs grid: Webhook URL + Google Sheet Direct Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] mb-1 flex items-center justify-between">
                  <span>{lang === 'en' ? 'Sheet Webhook URL (Google Apps Script):' : 'URL Webhook de tu Hoja (Google Apps Script):'}</span>
                  {webhookUrl && (
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-normal">● {lang === 'en' ? 'Configured' : 'Configurado'}</span>
                  )}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={webhookUrl}
                    onChange={(e) => handleSaveWebhook(e.target.value)}
                    className="flex-1 text-xs py-1.5 px-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                  <button
                    type="button"
                    disabled={isTestingWebhook}
                    onClick={handleTestWebhook}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-md font-semibold text-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    title={lang === 'en' ? 'Send a test row to your Google Sheet to verify' : 'Envía una fila de prueba a tu Google Sheet para comprobar que responde'}
                  >
                    {isTestingWebhook ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>{isTestingWebhook ? (lang === 'en' ? 'Testing...' : 'Probando...') : (lang === 'en' ? 'Test Send' : 'Probar Envío')}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] mb-1">
                  {lang === 'en' ? 'Link to Open your Sheet in Google Drive:' : 'Enlace para Abrir tu Hoja en Google Drive:'}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={customSheetUrl}
                    onChange={(e) => handleSaveCustomUrl(e.target.value)}
                    className="flex-1 text-xs py-1.5 px-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                  {customSheetUrl && customSheetUrl.startsWith('http') && (
                    <a
                      href={customSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-semibold flex items-center gap-1 text-xs transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{lang === 'en' ? 'Open Sheet' : 'Abrir Hoja'}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Test result message if present */}
            {testResult && (
              <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80' 
                  : 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/80'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-800 dark:text-emerald-400" /> : <Clock className="w-4 h-4 shrink-0" />}
                <span className="font-medium">{testResult.message}</span>
              </div>
            )}

            {/* Expandable Step-by-step connection guide */}
            {showScriptGuide && (
              <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                    {lang === 'en' ? 'Easy steps to connect your Google Sheet in 1 minute:' : 'Pasos sencillos para conectar tu Google Sheet en 1 minuto:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded font-semibold text-[11px] flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? (lang === 'en' ? 'Code Copied!' : '¡Código Copiado!') : (lang === 'en' ? 'Copy Google Apps Script Code' : 'Copiar Código de Google Apps Script')}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  <li>{lang === 'en' ? 'Open your Google Sheet (or create one using sheets.new).' : 'Abre tu Google Sheet (o crea uno nuevo con sheets.new).'}</li>
                  <li>{lang === 'en' ? 'In the top menu, go to Extensions > Apps Script.' : 'En el menú superior de Google Sheets, ve a Extensiones > Apps Script.'}</li>
                  <li>{lang === 'en' ? 'Clear existing content and paste the code copied above.' : 'Borra lo que haya y pega el código copiado con el botón de arriba.'}</li>
                  <li>{lang === 'en' ? 'Click Deploy > New deployment.' : 'Haz clic en el botón azul superior Implementar > Nueva implementación.'}</li>
                  <li>{lang === 'en' ? 'Select Web app, and set Who has access to Anyone.' : 'Selecciona el tipo: Aplicación web. En Quién tiene acceso, elige: Cualquier usuario (Anyone).'}</li>
                  <li>{lang === 'en' ? 'Click Deploy, copy the web app URL and paste it into the Webhook URL field above.' : 'Haz clic en Implementar, copia la URL de la aplicación web que te entrega Google y pégala en el campo URL Webhook aquí arriba.'}</li>
                </ol>
              </div>
            )}

          </div>

          {/* Informational Guidance Badge */}
          <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-2">
            <span>
              💾 <strong>{lang === 'en' ? 'Dual Active Backup:' : 'Doble Respaldo Activo:'}</strong>{' '}
              {lang === 'en'
                ? 'Data is stored in local storage and sent to your Google Sheets webhook when set up. You can also download the CSV anytime.'
                : 'Los datos se guardan tanto en la memoria interna del sistema como en tu Webhook de Google Sheets si está configurado. También puedes descargar el archivo CSV en cualquier momento.'}
            </span>
            {onResetRecords && (
              <button
                onClick={onResetRecords}
                className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === 'en' ? 'Reset sample list' : 'Restablecer lista de muestra'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Table of Records */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">{lang === 'en' ? 'Learner' : 'Aprendiz'}</th>
                    <th className="px-4 py-3">{lang === 'en' ? 'ID Document' : 'Identificación'}</th>
                    <th className="px-4 py-3">{lang === 'en' ? 'Batch / Program' : 'Ficha / Programa'}</th>
                    <th className="px-4 py-3 text-center">{lang === 'en' ? 'Modules' : 'Módulos'}</th>
                    <th className="px-4 py-3 text-center">{lang === 'en' ? 'Assessment' : 'Evaluación'}</th>
                    <th className="px-4 py-3">{lang === 'en' ? 'Status' : 'Estado'}</th>
                    <th className="px-4 py-3">{lang === 'en' ? 'Certificate Code' : 'Código Certificado'}</th>
                    <th className="px-4 py-3">{lang === 'en' ? 'Date' : 'Fecha'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                        {lang === 'en' ? 'No learners found matching this search criteria.' : 'No se encontraron aprendices con el criterio de búsqueda.'}
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
                        <td className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate" title={`${r.programName} (${r.fichaCode})`}>
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
                              <span>{lang === 'en' ? 'Certified' : 'Certificado'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{lang === 'en' ? 'In Progress' : 'En Proceso'}</span>
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

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <span>{lang === 'en' ? `Showing ${filteredRecords.length} of ${records.length} registered learners` : `Mostrando ${filteredRecords.length} de ${records.length} aprendices registrados`}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'Cerrar'}
          </button>
        </div>

      </div>
    </div>
  );
};
