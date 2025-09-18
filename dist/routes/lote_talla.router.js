"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lote_talla_controller_1 = require("../controllers/lote_talla.controller");
const LoteTallaRouter = (0, express_1.Router)();
LoteTallaRouter.post('/', lote_talla_controller_1.createLoteTalla); // Crear un nuevo lote_talla
LoteTallaRouter.get('/', lote_talla_controller_1.getLotesTalla); // Obtener la lista de todos los lotes_talla
LoteTallaRouter.get('/disponibles', lote_talla_controller_1.getLotesTallaDisponibles); // Obtener solo lotes_talla disponibles
LoteTallaRouter.get('/filtro-productos', lote_talla_controller_1.getProductosFormatoService); // Obtener solo lotes_talla disponibles
LoteTallaRouter.get('/eliminados', lote_talla_controller_1.getLotesTallaEliminados); // Obtener solo lotes_talla eliminados
LoteTallaRouter.get('/lote/:idlote', lote_talla_controller_1.getLotesTallaByLote); // Obtener lotes_talla por lote
LoteTallaRouter.get('/catalogo/talla', lote_talla_controller_1.getProductosDisponiblesPorTalla); // Obtener productos disponibles por talla (para catálogo)
// CATÁLOGO Y INVENTARIO
LoteTallaRouter.get('/catalogo', lote_talla_controller_1.getProductosDisponibles); // Catálogo con filtros
LoteTallaRouter.get('/tallas', lote_talla_controller_1.getTallasDisponibles); // Tallas por producto
LoteTallaRouter.get('/stock', lote_talla_controller_1.verificarStock); // Verificación de stock
LoteTallaRouter.put('/multiple', lote_talla_controller_1.updateOrCreateMultipleLoteTalla);
LoteTallaRouter.patch('/agregar-stock', lote_talla_controller_1.agregarStockPorLoteTalla); // Agregar stock a un lote_talla específico
// ✅ NUEVA RUTA PARA RESUMEN DE STOCK CRÍTICO
LoteTallaRouter.get('/resumen/stock-critico', lote_talla_controller_1.getResumenStockCritico);
LoteTallaRouter.get('/:id', lote_talla_controller_1.getLoteTallaById); // Obtener un lote_talla por ID
LoteTallaRouter.put('/:id', lote_talla_controller_1.updateLoteTalla); // Actualizar un lote_talla por ID
LoteTallaRouter.patch('/:id/estado', lote_talla_controller_1.cambiarEstadoLoteTalla); // Cambiar estado del lote_talla (disponible/agotado)
LoteTallaRouter.patch('/:id/eliminar', lote_talla_controller_1.deleteLoteTalla); // Eliminar lógicamente un lote_talla (cambiar estado a eliminado)
LoteTallaRouter.patch('/:id/restaurar', lote_talla_controller_1.restaurarLoteTalla); // Restaurar un lote_talla eliminado
// En tu archivo de rutas
// NUEVA RUTA PARA AGREGAR STOCK
exports.default = LoteTallaRouter;
