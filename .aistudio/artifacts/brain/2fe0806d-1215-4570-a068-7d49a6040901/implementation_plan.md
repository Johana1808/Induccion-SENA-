# Plan de Sincronización Automática con Google Sheets y Consolidado SENA

Plan estructurado para lograr que cada estudiante que complete la inducción y el examen bajo el **Acuerdo 009 de 2024 / Acuerdo 002 de 2026** sincronice sus datos de forma 100% automática en una hoja de cálculo, sin que el instructor deba intervenir manualmente en cada sesión ni los aprendices deban autenticarse en Google Drive.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisión Clave de Arquitectura para Cero Fricción**:
> Cuando se usa OAuth directo de Google Drive, cada aprendiz necesitaría permisos para escribir en el Drive del instructor (lo cual genera bloqueos o rechazos en las cuentas institucionales o personales). 
> **Enfoque Propuesto (Recomendado)**: Conexión mediante **Webhook HTTP Automático a Google Sheets (Google Apps Script)** y respaldo en tiempo real. Cada vez que un aprendiz completa un módulo o aprueba el examen con su certificado, el sistema envía una petición silenciosa en segundo plano que inserta la fila directamente en la Hoja de Google Sheets del instructor.

- **Confirmado**: Marco normativo actualizado al Acuerdo 009 de 2024 modificado por el Acuerdo 002 de 2026.
- **Decisión a Aprobar**: Habilitar el conector Webhook automático para que la sincronización con Google Sheets ocurra en segundo plano con cero clics manuales del instructor.

---

## 1. Overview & Core Concept

- **Qué hace**: Permite al instructor compartir un único enlace a sus aprendices. A medida que ellos realizan la inducción y aprueban la evaluación, el sistema registra instantáneamente:
  1. Nombre completo e identificación.
  2. Ficha de caracterización y programa de formación.
  3. Módulos completados y calificación porcentual.
  4. Estado (*Aprobado y Certificado*).
  5. Código oficial de certificado con fecha y hora.
- **Beneficio Principal**: Cero trabajo operativo para el instructor. La hoja de cálculo se actualiza sola en vivo conforme los aprendices terminan su proceso formativo.

---

## 2. User Experience & Visual Design

- **Flujo del Aprendiz**:
  - Abre el enlace de la ficha (ej. `?ficha=2874910&programa=ADSO`).
  - Diligencia su nombre y documento una sola vez en el modal de bienvenida.
  - Estudia los módulos, resuelve los dilemas pedagógicos del debido proceso (Art. 48) y presenta la evaluación.
  - Al aprobar, recibe su certificado oficial descargable. En ese instante exacto, la plataforma envía la fila a la hoja de Google Sheets en segundo plano con un indicador sutil: `Sincronizado con la hoja del instructor`.
- **Flujo del Instructor**:
  - Abre el panel **"Consolidado y Registros"**.
  - Visualiza el estado de la conexión en vivo: `Sincronización Automática Activa`.
  - Dispone de un botón directo para abrir su Google Sheet en Drive en cualquier dispositivo, además de los botones de descarga de respaldo.

---

## 3. Arquitectura y Métodos de Conexión

```
┌────────────────────────────────────────────────────────┐
│             Aprendiz (Enlace de Inducción)             │
│  - Ingreso de datos (Nombre, Documento, Ficha)         │
│  - Módulos + Evaluación (Acuerdo 009/2024 y 002/2026)  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Evento: Certificación / Progreso
                           ▼
┌────────────────────────────────────────────────────────┐
│             Servicio de Sincronización                 │
│  - Valida estructura de datos del aprendiz             │
│  - Guarda en almacenamiento local persistente          │
│  - Despacha Webhook HTTP en segundo plano              │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ POST (JSON Payload)
                           ▼
┌────────────────────────────────────────────────────────┐
│         Google Apps Script Webhook (Automático)        │
│  - Recibe el registro sin pedir login al estudiante    │
│  - Inserta nueva fila en Google Sheets en Google Drive │
└────────────────────────────────────────────────────────┘
```

### Componentes Clave a Implementar:

1. **`src/services/sheetSyncService.ts`**:
   - Manejador de sincronización en segundo plano con reintentos automáticos si falla la conexión a internet.
   - Encola registros y los despacha al finalizar la evaluación o registrarse.

2. **Panel de Configuración de Sincronización en `ApprenticeRecordsModal.tsx`**:
   - Selector de estado: Automático vs. Manual.
   - Indicador visual del último registro sincronizado.
   - Código de plantilla listo de Google Apps Script (solo copiar y pegar en Extensiones > Apps Script de su Google Sheet).

3. **Garantía de Persistencia Local**:
   - Incluso si la red del estudiante parpadea, los datos nunca se pierden: se almacenan en `localStorage` y se reintentan en segundo plano.

---

## 4. Plan de Ejecución Paso a Paso

1. **Paso 1**: Crear el servicio cliente `sheetSyncService.ts` para gestionar el envío asíncrono y transparente de registros.
2. **Paso 2**: Integrar el disparador automático en `App.tsx` al momento en que el estudiante finaliza la prueba de inducción y genera su código de certificación.
3. **Paso 3**: Proporcionar en el modal de registros la URL del Webhook preconfigurado junto con las instrucciones claras de 1 minuto para asociar cualquier hoja de Google Drive.
4. **Paso 4**: Validar compilación, linter y realizar prueba de envío de datos simulada y en vivo.
