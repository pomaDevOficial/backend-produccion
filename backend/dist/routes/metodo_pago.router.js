"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metodo_pago_controller_1 = require("../controllers/metodo_pago.controller");
const MetodoPagoRouter = (0, express_1.Router)();
MetodoPagoRouter.post('/', metodo_pago_controller_1.createMetodoPago); // Crear un nuevo método de pago
MetodoPagoRouter.get('/', metodo_pago_controller_1.getMetodosPago); // Obtener todos los métodos de pago
MetodoPagoRouter.get('/registrados', metodo_pago_controller_1.getMetodosPagoRegistrados); // Obtener métodos de pago registrados/actualizados
MetodoPagoRouter.get('/eliminados', metodo_pago_controller_1.getMetodosPagoEliminados); // Obtener métodos de pago eliminados
MetodoPagoRouter.get('/verificar-nombre/:nombre', metodo_pago_controller_1.verificarNombreMetodoPago); // Verificar si existe un método de pago con el nombre
MetodoPagoRouter.get('/:id', metodo_pago_controller_1.getMetodoPagoById); // Obtener un método de pago por ID
MetodoPagoRouter.put('/:id', metodo_pago_controller_1.updateMetodoPago); // Actualizar un método de pago por ID
MetodoPagoRouter.patch('/:id/eliminar', metodo_pago_controller_1.deleteMetodoPago); // Eliminar lógicamente un método de pago (cambiar estado a eliminado)
MetodoPagoRouter.patch('/:id/restaurar', metodo_pago_controller_1.restaurarMetodoPago); // Restaurar un método de pago eliminado
exports.default = MetodoPagoRouter;
