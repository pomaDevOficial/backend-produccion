"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/wsp.ts
const express_1 = require("express");
const wsp_controller_1 = require("../controllers/wsp.controller");
const routerWsp = (0, express_1.Router)();
// ============== RUTAS PRINCIPALES ==============
/**
 * @route POST /api/v1/wsp/enviar-mensaje
 * @desc Enviar mensaje simple por WhatsApp
 * @body { phone: string, message: string }
 */
routerWsp.post('/enviar-mensaje', wsp_controller_1.enviarMensaje);
/**
 * @route POST /api/v1/wsp/enviar-comprobante
 * @desc Enviar comprobante por WhatsApp (primera vez)
 * @body { idComprobante: number }
 */
routerWsp.post('/enviar-comprobante', wsp_controller_1.enviarComprobante);
/**
 * @route POST /api/v1/wsp/reenviar-comprobante
 * @desc Reenviar comprobante por WhatsApp
 * @body { idComprobante: number }
 */
routerWsp.post('/reenviar-comprobante', wsp_controller_1.reenviarComprobante);
/**
 * @route POST /api/v1/wsp/enviar-archivo
 * @desc Enviar archivo genérico por WhatsApp
 * @body { phone: string, filename: string }
 */
routerWsp.post('/enviar-archivo', wsp_controller_1.enviarArchivo);
/**
 * @route GET /api/v1/wsp/estado-servicio
 * @desc Obtener estado del servicio WhatsApp (GreenAPI)
 */
routerWsp.get('/estado-servicio', wsp_controller_1.obtenerEstadoServicio);
// ============== RUTAS LEGACY (Compatibilidad) ==============
// Mantener las rutas anteriores para no romper integraciones existentes
routerWsp.post('/send-message', wsp_controller_1.sendWhatsAppMessage);
routerWsp.post('/send-file', wsp_controller_1.sendFileWhatsApp);
// Alias alternativos
routerWsp.post('/mensaje', wsp_controller_1.enviarMensaje);
routerWsp.post('/archivo', wsp_controller_1.enviarArchivo);
routerWsp.post('/comprobante', wsp_controller_1.enviarComprobante);
routerWsp.post('/reenvio-comprobante', wsp_controller_1.reenviarComprobante);
exports.default = routerWsp;
