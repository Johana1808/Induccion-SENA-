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
}

export const ApprenticeRecordsModal: React.FC<ApprenticeRecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  onResetRecords,
  currentFicha,
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
                  Consolidado y Registro de Aprendices
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Ficha {currentFicha || '2874910'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Descarga el informe en archivo compatible con Excel y Google Drive sin requerir permisos externos
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
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Total Aprendices</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">{totalCount}</span>
            </div>
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60">
              <span className="text-emerald-700 dark:text-emerald-400 block font-medium">Aprobados y Certificados</span>
              <span className="text-xl font-bold text-emerald-800 dark:text-emerald-300 font-mono mt-0.5 block">{certifiedCount}</span>
            </div>
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200/70 dark:border-amber-800/60">
              <span className="text-amber-700 dark:text-amber-400 block font-medium">En Proceso / Pendientes</span>
              <span className="text-xl font-bold text-amber-800 dark:text-amber-300 font-mono mt-0.5 block">{inProgressCount}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Promedio Calificación</span>
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
                  placeholder="Buscar por aprendiz o documento..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Aprobado y Certificado">Aprobados</option>
                <option value="Pendiente Evaluación">Pendientes</option>
              </select>
            </div>

            {/* Main Export Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyForSheets}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Copiar datos tabulados para pegar directamente en Google Sheets o Excel con Ctrl+V"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400">¡Copiado para Sheets!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Copiar para Sheets / Excel</span>
                  </>
                )}
              </button>

              <a
                href="https://sheets.new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Abre una nueva Hoja de Cálculo en Google Drive lista para pegar (Ctrl+V)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Google Sheets (sheets.new)</span>
              </a>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                title="Descargar archivo .CSV con formato UTF-8 listo para abrir en Excel o Google Drive"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>¡Descargado!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descargar Archivo CSV</span>
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
                    Sincronización Automática con Google Sheets
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inserta cada aprendiz automáticamente en tu hoja de Drive al certificarse (sin pedir login al estudiante)
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
                  <span>{showScriptGuide ? 'Ocultar Guía' : 'Ver Guía de Conexión en 1 min'}</span>
                </button>
              </div>
            </div>

            {/* Inputs grid: Webhook URL + Google Sheet Direct Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] mb-1 flex items-center justify-between">
                  <span>URL Webhook de tu Hoja (Google Apps Script):</span>
                  {webhookUrl && (
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-normal">● Configurado</span>
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
                    title="Envía una fila de prueba a tu Google Sheet para comprobar que responde"
                  >
                    {isTestingWebhook ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>Probar Envío</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] mb-1">
                  Enlace para Abrir tu Hoja en Google Drive:
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
                      <span>Abrir Hoja</span>
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
                    Pasos sencillos para conectar tu Google Sheet en 1 minuto:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded font-semibold text-[11px] flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? '¡Código Copiado!' : 'Copiar Código de Google Apps Script'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  <li>Abre tu Google Sheet (o crea uno nuevo con <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline font-semibold">sheets.new</a>).</li>
                  <li>En el menú superior de Google Sheets, ve a <strong>Extensiones &gt; Apps Script</strong>.</li>
                  <li>Borra lo que haya y pega el código copiado con el botón de arriba.</li>
                  <li>Haz clic en el botón azul superior <strong>Implementar &gt; Nueva implementación</strong>.</li>
                  <li>Selecciona el tipo: <strong>Aplicación web</strong>. En <em>Quién tiene acceso</em>, elige: <strong>Cualquier usuario (Anyone)</strong>.</li>
                  <li>Haz clic en <strong>Implementar</strong>, copia la <strong>URL de la aplicación web</strong> que te entrega Google y pégala en el campo <em>URL Webhook</em> aquí arriba. ¡Listo! A partir de ese momento cada estudiante que responda se registrará automáticamente sin que tú hagas nada más.</li>
                </ol>
              </div>
            )}

          </div>

          {/* Informational Guidance Badge */}
          <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-2">
            <span>
              💾 <strong>Doble Respaldo Activo:</strong> Los datos se guardan tanto en la memoria interna del sistema como en tu Webhook de Google Sheets si está configurado. También puedes descargar el archivo CSV o abrir con <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-semibold underline">sheets.new</a> en cualquier momento.
            </span>
            {onResetRecords && (
              <button
                onClick={onResetRecords}
                className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer lista de muestra</span>
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
                    <th className="px-4 py-3">Aprendiz</th>
                    <th className="px-4 py-3">Identificación</th>
                    <th className="px-4 py-3">Ficha / Programa</th>
                    <th className="px-4 py-3 text-center">Módulos</th>
                    <th className="px-4 py-3 text-center">Evaluación</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Código Certificado</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                        No se encontraron aprendices con el criterio de búsqueda.
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

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <span>Mostrando {filteredRecords.length} de {records.length} aprendices registrados</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
