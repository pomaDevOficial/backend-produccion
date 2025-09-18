"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_comprobante_controller_1 = require("../controllers/tipo_comprobante.controller");
const TipoComprobanteRouter = (0, express_1.Router)();
TipoComprobanteRouter.post('/', tipo_comprobante_controller_1.createTipoComprobante); // Crear un nuevo tipo de comprobante
TipoComprobanteRouter.get('/', tipo_comprobante_controller_1.getTiposComprobante); // Obtener la lista de todos los tipos de comprobante
TipoComprobanteRouter.get('/registrados', tipo_comprobante_controller_1.getTiposComprobanteRegistrados); // Obtener solo tipos de comprobante registrados/actualizados
TipoComprobanteRouter.get('/eliminados', tipo_comprobante_controller_1.getTiposComprobanteEliminados); // Obtener solo tipos de comprobante eliminados
TipoComprobanteRouter.get('/verificar-nombre/:nombre', tipo_comprobante_controller_1.verificarNombreTipoComprobante); // Verificar si existe un tipo de comprobante con el nombre
TipoComprobanteRouter.get('/:id', tipo_comprobante_controller_1.getTipoComprobanteById); // Obtener un tipo de comprobante por ID
TipoComprobanteRouter.put('/:id', tipo_comprobante_controller_1.updateTipoComprobante); // Actualizar un tipo de comprobante por ID
TipoComprobanteRouter.patch('/:id/eliminar', tipo_comprobante_controller_1.deleteTipoComprobante); // Eliminar lógicamente un tipo de comprobante
TipoComprobanteRouter.patch('/:id/restaurar', tipo_comprobante_controller_1.restaurarTipoComprobante); // Restaurar un tipo de comprobante eliminado
exports.default = TipoComprobanteRouter;
