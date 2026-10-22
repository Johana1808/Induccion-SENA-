import { ApprenticeRecord } from '../data/inductionContent';

export interface SyncLog {
  id: string;
  learnerName: string;
  timestamp: string;
  status: 'exitoso' | 'pendiente' | 'error';
  details: string;
}

const WEBHOOK_STORAGE_KEY = 'sena_sheets_webhook_url';
const SYNC_LOGS_KEY = 'sena_sheets_sync_logs';
const CUSTOM_SHEET_URL_KEY = 'sena_custom_sheets_url';

export const getStoredWebhookUrl = (): string => {
  try {
    return localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setStoredWebhookUrl = (url: string): void => {
  try {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
  } catch (e) {
    console.error('Error saving webhook URL:', e);
  }
};

export const getStoredSheetUrl = (): string => {
  try {
    return localStorage.getItem(CUSTOM_SHEET_URL_KEY) || '';
  } catch {
    return '';
  }
};

export const setStoredSheetUrl = (url: string): void => {
  try {
    localStorage.setItem(CUSTOM_SHEET_URL_KEY, url.trim());
  } catch (e) {
    console.error('Error saving Sheet URL:', e);
  }
};

export const getSyncLogs = (): SyncLog[] => {
  try {
    const raw = localStorage.getItem(SYNC_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const addSyncLog = (log: Omit<SyncLog, 'id'>) => {
  try {
    const current = getSyncLogs();
    const newLog: SyncLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [newLog, ...current].slice(0, 30); // Keep last 30
    localStorage.setItem(SYNC_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving sync log:', e);
  }
};

/**
 * Sends apprentice record to the configured Google Sheets Webhook in background.
 * Uses mode 'no-cors' so Google Apps Script redirects (302) are executed cleanly
 * without browser cross-origin policy exceptions.
 */
export const sendRecordToGoogleSheet = async (
  record: ApprenticeRecord
): Promise<{ success: boolean; message: string }> => {
  const webhookUrl = getStoredWebhookUrl();

  const payload = {
    eventType: 'APPRENTICE_RECORD',
    timestamp: new Date().toISOString(),
    fullName: record.fullName,
    documentType: record.documentType,
    documentNumber: record.documentNumber,
    fichaCode: record.fichaCode,
    programName: record.programName,
    regional: record.regional,
    trainingCenter: record.trainingCenter,
    modality: record.modality,
    modulesCompleted: record.modulesCompleted,
    quizScore: record.quizScore !== null ? `${record.quizScore}%` : 'N/A',
    status: record.status,
    certificateCode: record.certificateCode,
    registrationDate: record.registrationDate,
    regulationFramework: record.regulationFramework,
  };

  if (!webhookUrl) {
    // If webhook is not yet configured, record is preserved locally
    addSyncLog({
      learnerName: record.fullName,
      timestamp: new Date().toLocaleString(),
      status: 'pendiente',
      details: 'Guardado en sistema local (Webhook de Google Sheets pendiente por configurar)',
    });
    return {
      success: true,
      message: 'Guardado localmente. Configura la URL del Webhook para sincronizar en tiempo real con Google Drive.',
    };
  }

  try {
    // Post to Google Apps Script Webhook
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    addSyncLog({
      learnerName: record.fullName,
      timestamp: new Date().toLocaleString(),
      status: 'exitoso',
      details: `Sincronizado automáticamente a Google Sheets (${record.certificateCode})`,
    });

    return {
      success: true,
      message: 'Sincronizado automáticamente con tu Hoja de Google Sheets en Google Drive.',
    };
  } catch (err: any) {
    console.warn('Background sync error:', err);
    addSyncLog({
      learnerName: record.fullName,
      timestamp: new Date().toLocaleString(),
      status: 'error',
      details: `Fallo de red al enviar: ${err?.message || 'Error desconocido'}. Guardado en memoria local.`,
    });

    return {
      success: false,
      message: 'No se pudo conectar con el Webhook. Los datos permanecen seguros en la memoria local.',
    };
  }
};

/**
 * Ready-to-copy Google Apps Script code for the instructor's Google Sheet
 */
export const GOOGLE_APPS_SCRIPT_CODE = `// SCRIPT DE SINCRONIZACIÓN AUTOMÁTICA SENA - GOOGLE SHEETS
// Pégalo en tu Google Sheet: Extensiones > Apps Script > Borra todo > Pega este código > Clic en 'Implementar' > 'Nueva implementación' > Selecciona Tipo: 'Aplicación web' > 'Quién tiene acceso': 'Cualquier usuario' (Anyone) > Implementar.

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Si la hoja está vacía, crear los encabezados oficiales
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Fecha de Registro",
        "Nombre Completo",
        "Tipo Documento",
        "Número Documento",
        "Ficha",
        "Programa de Formación",
        "Regional",
        "Centro de Formación",
        "Modalidad",
        "Módulos",
        "Puntaje (%)",
        "Estado",
        "Código Certificado",
        "Reglamento Vigente"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground("#39A900")
        .setFontColor("#FFFFFF")
        .setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.registrationDate || new Date().toLocaleString(),
      data.fullName || "",
      data.documentType || "",
      data.documentNumber || "",
      data.fichaCode || "",
      data.programName || "",
      data.regional || "",
      data.trainingCenter || "",
      data.modality || "",
      data.modulesCompleted || "",
      data.quizScore || "",
      data.status || "",
      data.certificateCode || "",
      data.regulationFramework || "Acuerdo 009 de 2024 modificado por Acuerdo 002 de 2026"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
