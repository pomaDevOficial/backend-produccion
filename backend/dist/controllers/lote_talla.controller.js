"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumenStockCritico = exports.updateOrCreateMultipleLoteTalla = exports.getProductosFormatoService = exports.agregarStockPorLoteTalla = exports.verificarStock = exports.getTallasDisponibles = exports.getProductosDisponibles = exports.getProductosDisponiblesPorTalla = exports.restaurarLoteTalla = exports.getLotesTallaEliminados = exports.deleteLoteTalla = exports.cambiarEstadoLoteTalla = exports.getLotesTallaByLote = exports.getLoteTallaById = exports.getLotesTallaDisponibles = exports.getLotesTalla = exports.updateLoteTalla = exports.createLoteTalla = void 0;
const lote_talla_model_1 = __importDefault(require("../models/lote_talla.model"));
const lote_model_1 = __importDefault(require("../models/lote.model"));
const talla_model_1 = __importDefault(require("../models/talla.model"));
const estado_model_1 = __importDefault(require("../models/estado.model"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
const categoria_model_1 = __importDefault(require("../models/categoria.model"));
const marca_model_1 = __importDefault(require("../models/marca.model"));
const estados_constans_1 = require("../estadosTablas/estados.constans");
const sequelize_1 = require("sequelize");
const movimiento_lote_model_1 = __importDefault(require("../models/movimiento_lote.model"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const connection_db_1 = __importDefault(require("../db/connection.db"));
// CREATE - Insertar nuevo lote_talla
const createLoteTalla = async (req, res) => {
    const { idlote, idtalla, stock, esGenero, preciocosto, precioventa } = req.body;
    try {
        // Validaciones
        if (!idlote || !idtalla || stock === undefined || esGenero === undefined) {
            res.status(400).json({
                msg: 'Los campos idlote, idtalla, stock y esGenero son obligatorios'
            });
            return;
        }
        // Verificar si existe el lote
        const lote = await lote_model_1.default.findByPk(idlote);
        if (!lote) {
            res.status(400).json({ msg: 'El lote no existe' });
            return;
        }
        // Verificar si existe la talla
        const talla = await talla_model_1.default.findByPk(idtalla);
        if (!talla) {
            res.status(400).json({ msg: 'La talla no existe' });
            return;
        }
        // Verificar si ya existe un registro con el mismo idlote, idtalla y esGenero
        const loteTallaExistente = await lote_talla_model_1.default.findOne({
            where: {
                idlote,
                idtalla,
                esGenero,
                idestado: { [sequelize_1.Op.ne]: estados_constans_1.LoteEstado.ELIMINADO }
            }
        });
        if (loteTallaExistente) {
            res.status(400).json({
                msg: 'Ya existe un registro con la misma talla y género para este lote'
            });
            return;
        }
        // Crear nuevo lote_talla
        const nuevoLoteTalla = await lote_talla_model_1.default.create({
            idlote,
            idtalla,
            stock,
            esGenero,
            preciocosto: preciocosto || 0,
            precioventa: precioventa || 0,
            idestado: estados_constans_1.LoteEstado.DISPONIBLE
        });
        // Obtener el lote_talla creado con sus relaciones
        const loteTallaCreado = await lote_talla_model_1.default.findByPk(nuevoLoteTalla.id, {
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                },
                {
                    model: estado_model_1.default,
                    as: 'Estado',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        res.status(201).json({
            msg: 'LoteTalla creado exitosamente',
            data: loteTallaCreado
        });
    }
    catch (error) {
        console.error('Error en createLoteTalla:', error);
        res.status(500).json({ msg: 'Ocurrió un error, comuníquese con soporte' });
    }
};
exports.createLoteTalla = createLoteTalla;
// UPDATE - Actualizar lote_talla
const updateLoteTalla = async (req, res) => {
    const { id } = req.params;
    const { idlote, idtalla, stock, esGenero, preciocosto, precioventa } = req.body;
    try {
        if (!id) {
            res.status(400).json({ msg: "El ID del lote_talla es obligatorio" });
            return;
        }
        const loteTalla = await lote_talla_model_1.default.findByPk(id);
        if (!loteTalla) {
            res.status(404).json({ msg: `No existe un lote_talla con el id ${id}` });
            return;
        }
        // Verificar si existe el lote (si se está actualizando)
        if (idlote) {
            const lote = await lote_model_1.default.findByPk(idlote);
            if (!lote) {
                res.status(400).json({ msg: 'El lote no existe' });
                return;
            }
        }
        // Verificar si existe la talla (si se está actualizando)
        if (idtalla) {
            const talla = await talla_model_1.default.findByPk(idtalla);
            if (!talla) {
                res.status(400).json({ msg: 'La talla no existe' });
                return;
            }
        }
        // Verificar si ya existe otro registro con el mismo idlote, idtalla y esGenero
        if ((idlote || loteTalla.idlote) && (idtalla || loteTalla.idtalla) && (esGenero !== undefined || loteTalla.esGenero)) {
            const loteTallaExistente = await lote_talla_model_1.default.findOne({
                where: {
                    id: { [sequelize_1.Op.ne]: id },
                    idlote: idlote || loteTalla.idlote,
                    idtalla: idtalla || loteTalla.idtalla,
                    esGenero: esGenero !== undefined ? esGenero : loteTalla.esGenero,
                    idestado: { [sequelize_1.Op.ne]: estados_constans_1.LoteEstado.ELIMINADO }
                }
            });
            if (loteTallaExistente) {
                res.status(400).json({
                    msg: 'Ya existe otro registro con la misma talla y género para este lote'
                });
                return;
            }
        }
        // Actualizar campos
        if (idlote)
            loteTalla.idlote = idlote;
        if (idtalla)
            loteTalla.idtalla = idtalla;
        if (stock !== undefined)
            loteTalla.stock = stock;
        if (esGenero !== undefined)
            loteTalla.esGenero = esGenero;
        if (preciocosto !== undefined)
            loteTalla.preciocosto = preciocosto;
        if (precioventa !== undefined)
            loteTalla.precioventa = precioventa;
        // Cambiar estado a DISPONIBLE si no está eliminado
        if (loteTalla.idestado !== estados_constans_1.LoteEstado.ELIMINADO) {
            loteTalla.idestado = estados_constans_1.LoteEstado.DISPONIBLE;
        }
        await loteTalla.save();
        // Obtener el lote_talla actualizado con relaciones
        const loteTallaActualizado = await lote_talla_model_1.default.findByPk(id, {
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                },
                {
                    model: estado_model_1.default,
                    as: 'Estado',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        res.json({
            msg: "LoteTalla actualizado con éxito",
            data: loteTallaActualizado
        });
    }
    catch (error) {
        console.error("Error en updateLoteTalla:", error);
        res.status(500).json({ msg: "Ocurrió un error, comuníquese con soporte" });
    }
};
exports.updateLoteTalla = updateLoteTalla;
// READ - Listar todos los lote_talla
const getLotesTalla = async (req, res) => {
    try {
        const lotesTalla = await lote_talla_model_1.default.findAll({
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                },
                {
                    model: estado_model_1.default,
                    as: 'Estado',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['id', 'ASC']]
        });
        res.json({
            msg: 'Lista de lotes_talla obtenida exitosamente',
            data: lotesTalla
        });
    }
    catch (error) {
        console.error('Error en getLotesTalla:', error);
        res.status(500).json({ msg: 'Error al obtener la lista de lotes_talla' });
    }
};
exports.getLotesTalla = getLotesTalla;
// READ - Listar lotes_talla disponibles (no eliminados)
const getLotesTallaDisponibles = async (req, res) => {
    try {
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: {
                idestado: [estados_constans_1.LoteEstado.DISPONIBLE, estados_constans_1.LoteEstado.AGOTADO]
            },
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['id', 'ASC']]
        });
        res.json({
            msg: 'Lotes_talla disponibles obtenidos exitosamente',
            data: lotesTalla
        });
    }
    catch (error) {
        console.error('Error en getLotesTallaDisponibles:', error);
        res.status(500).json({ msg: 'Error al obtener lotes_talla disponibles' });
    }
};
exports.getLotesTallaDisponibles = getLotesTallaDisponibles;
// READ - Obtener lote_talla por ID
const getLoteTallaById = async (req, res) => {
    const { id } = req.params;
    try {
        const loteTalla = await lote_talla_model_1.default.findByPk(id, {
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                },
                {
                    model: estado_model_1.default,
                    as: 'Estado',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        if (!loteTalla) {
            res.status(404).json({ msg: 'LoteTalla no encontrado' });
            return;
        }
        res.json({
            msg: 'LoteTalla obtenido exitosamente',
            data: loteTalla
        });
    }
    catch (error) {
        console.error('Error en getLoteTallaById:', error);
        res.status(500).json({ msg: 'Error al obtener el lote_talla' });
    }
};
exports.getLoteTallaById = getLoteTallaById;
// READ - Obtener lotes_talla por lote
const getLotesTallaByLote = async (req, res) => {
    const { idlote } = req.params;
    try {
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: {
                idlote,
                idestado: [estados_constans_1.LoteEstado.DISPONIBLE, estados_constans_1.LoteEstado.AGOTADO]
            },
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                },
                {
                    model: estado_model_1.default,
                    as: 'Estado',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['idtalla', 'ASC']]
        });
        res.json({
            msg: 'Lotes_talla del lote obtenidos exitosamente',
            data: lotesTalla
        });
    }
    catch (error) {
        console.error('Error en getLotesTallaByLote:', error);
        res.status(500).json({ msg: 'Error al obtener lotes_talla del lote' });
    }
};
exports.getLotesTallaByLote = getLotesTallaByLote;
// UPDATE - Cambiar estado del lote_talla (disponible/agotado)
const cambiarEstadoLoteTalla = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // LoteEstado.DISPONIBLE o LoteEstado.AGOTADO
    try {
        if (!estado || ![estados_constans_1.LoteEstado.DISPONIBLE, estados_constans_1.LoteEstado.AGOTADO].includes(estado)) {
            res.status(400).json({
                msg: 'Estado inválido. Debe ser DISPONIBLE (1) o AGOTADO (2)'
            });
            return;
        }
        const loteTalla = await lote_talla_model_1.default.findByPk(id);
        if (!loteTalla) {
            res.status(404).json({ msg: 'LoteTalla no encontrado' });
            return;
        }
        loteTalla.idestado = estado;
        await loteTalla.save();
        res.json({
            msg: 'Estado del lote_talla actualizado con éxito',
            data: { id: loteTalla.id, estado }
        });
    }
    catch (error) {
        console.error('Error en cambiarEstadoLoteTalla:', error);
        res.status(500).json({ msg: 'Error al cambiar el estado del lote_talla' });
    }
};
exports.cambiarEstadoLoteTalla = cambiarEstadoLoteTalla;
// DELETE - Eliminar lote_talla (cambiar estado a eliminado)
const deleteLoteTalla = async (req, res) => {
    const { id } = req.params;
    try {
        const loteTalla = await lote_talla_model_1.default.findByPk(id);
        if (!loteTalla) {
            res.status(404).json({ msg: 'LoteTalla no encontrado' });
            return;
        }
        // Cambiar estado a ELIMINADO en lugar de eliminar físicamente
        loteTalla.idestado = estados_constans_1.LoteEstado.ELIMINADO;
        await loteTalla.save();
        res.json({
            msg: 'LoteTalla eliminado con éxito',
            data: { id: loteTalla.id, estado: estados_constans_1.LoteEstado.ELIMINADO }
        });
    }
    catch (error) {
        console.error('Error en deleteLoteTalla:', error);
        res.status(500).json({ msg: 'Error al eliminar el lote_talla' });
    }
};
exports.deleteLoteTalla = deleteLoteTalla;
// READ - Listar lotes_talla eliminados
const getLotesTallaEliminados = async (req, res) => {
    try {
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: { idestado: estados_constans_1.LoteEstado.ELIMINADO },
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['id', 'ASC']]
        });
        res.json({
            msg: 'Lotes_talla eliminados obtenidos exitosamente',
            data: lotesTalla
        });
    }
    catch (error) {
        console.error('Error en getLotesTallaEliminados:', error);
        res.status(500).json({ msg: 'Error al obtener lotes_talla eliminados' });
    }
};
exports.getLotesTallaEliminados = getLotesTallaEliminados;
// UPDATE - Restaurar lote_talla eliminado
const restaurarLoteTalla = async (req, res) => {
    const { id } = req.params;
    try {
        const loteTalla = await lote_talla_model_1.default.findByPk(id);
        if (!loteTalla) {
            res.status(404).json({ msg: 'LoteTalla no encontrado' });
            return;
        }
        // Cambiar estado a DISPONIBLE
        loteTalla.idestado = estados_constans_1.LoteEstado.DISPONIBLE;
        await loteTalla.save();
        res.json({
            msg: 'LoteTalla restaurado con éxito',
            data: { id: loteTalla.id, estado: estados_constans_1.LoteEstado.DISPONIBLE }
        });
    }
    catch (error) {
        console.error('Error en restaurarLoteTalla:', error);
        res.status(500).json({ msg: 'Error al restaurar el lote_talla' });
    }
};
exports.restaurarLoteTalla = restaurarLoteTalla;
// READ - Listar productos disponibles por talla y género (para catálogo)
const getProductosDisponiblesPorTalla = async (req, res) => {
    const { idtalla, esGenero, idcategoria, idmarca } = req.query;
    try {
        // Construir condiciones de filtrado
        const whereConditions = {
            idestado: estados_constans_1.LoteEstado.DISPONIBLE,
            stock: { [sequelize_1.Op.gt]: 0 } // Solo productos con stock disponible
        };
        if (idtalla)
            whereConditions.idtalla = idtalla;
        if (esGenero !== undefined)
            whereConditions.esGenero = esGenero;
        // Construir condiciones para las relaciones
        const includeLoteConditions = {
            model: lote_model_1.default,
            as: 'Lote',
            where: { idestado: estados_constans_1.LoteEstado.DISPONIBLE },
            include: [
                {
                    model: producto_model_1.default,
                    as: 'Producto',
                    include: [
                        {
                            model: categoria_model_1.default,
                            as: 'Categoria',
                            where: idcategoria ? { id: idcategoria } : undefined,
                            attributes: ['id', 'nombre'],
                            required: !!idcategoria
                        },
                        {
                            model: marca_model_1.default,
                            as: 'Marca',
                            where: idmarca ? { id: idmarca } : undefined,
                            attributes: ['id', 'nombre'],
                            required: !!idmarca
                        }
                    ]
                }
            ]
        };
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: whereConditions,
            include: [
                includeLoteConditions,
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [
                [{ model: lote_model_1.default, as: 'Lote' }, { model: producto_model_1.default, as: 'Producto' }, 'nombre', 'ASC']
            ]
        });
        res.json({
            msg: 'Productos disponibles por talla obtenidos exitosamente',
            data: lotesTalla
        });
    }
    catch (error) {
        console.error('Error en getProductosDisponiblesPorTalla:', error);
        res.status(500).json({ msg: 'Error al obtener productos disponibles por talla' });
    }
};
exports.getProductosDisponiblesPorTalla = getProductosDisponiblesPorTalla;
// // READ - Listar productos disponibles con filtros (para página de ventas)
// export const getProductosDisponibles = async (req: Request, res: Response): Promise<void> => {
//   const { idcategoria, idmarca, esGenero, idtalla } = req.query;
//   try {
//     // Construir condiciones para lote_talla
//     const whereLoteTallaConditions: any = {
//       idestado: LoteEstado.DISPONIBLE,
//       stock: { [Op.gt]: 0 } // Solo productos con stock disponible
//     };
//     if (esGenero !== undefined) whereLoteTallaConditions.esGenero = esGenero;
//     if (idtalla) whereLoteTallaConditions.idtalla = idtalla;
//     // Construir condiciones para las relaciones
//     const includeLoteConditions: any = {
//       model: Lote,
//       as: 'Lote',
//       where: { idestado: LoteEstado.DISPONIBLE },
//       include: [
//         {
//           model: Producto,
//           as: 'Producto',
//           include: [
//             {
//               model: Categoria,
//               as: 'Categoria',
//               where: idcategoria ? { id: idcategoria } : undefined,
//               attributes: ['id', 'nombre'],
//               required: !!idcategoria
//             },
//             {
//               model: Marca,
//               as: 'Marca',
//               where: idmarca ? { id: idmarca } : undefined,
//               attributes: ['id', 'nombre'],
//               required: !!idmarca
//             }
//           ]
//         }
//       ]
//     };
//     const lotesTalla = await LoteTalla.findAll({
//       where: whereLoteTallaConditions,
//       include: [
//         includeLoteConditions,
//         { 
//           model: Talla, 
//           as: 'Talla',
//           attributes: ['id', 'nombre'] 
//         }
//       ],
//       order: [
//         [{ model: Lote, as: 'Lote' }, { model: Producto, as: 'Producto' }, 'nombre', 'ASC'],
//         ['idtalla', 'ASC']
//       ]
//     });
//     res.json({
//       msg: 'Productos disponibles obtenidos exitosamente',
//       data: lotesTalla
//     });
//   } catch (error) {
//     console.error('Error en getProductosDisponibles:', error);
//     res.status(500).json({ msg: 'Error al obtener productos disponibles' });
//   }
// };
// READ - Listar productos disponibles con filtros (OPTIMIZADO)
const getProductosDisponibles = async (req, res) => {
    const { idcategoria, idmarca, esGenero, idtalla, nombre, minPrecio, maxPrecio, page = 1, limit = 12 } = req.query;
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const offset = (pageNumber - 1) * limitNumber;
        // Construir condiciones
        const whereConditions = {
            idestado: estados_constans_1.LoteEstado.DISPONIBLE,
            stock: { [sequelize_1.Op.gt]: 0 }
        };
        if (minPrecio)
            whereConditions.precioventa = Object.assign(Object.assign({}, whereConditions.precioventa), { [sequelize_1.Op.gte]: parseFloat(minPrecio) });
        if (maxPrecio)
            whereConditions.precioventa = Object.assign(Object.assign({}, whereConditions.precioventa), { [sequelize_1.Op.lte]: parseFloat(maxPrecio) });
        if (esGenero !== undefined)
            whereConditions.esGenero = esGenero;
        if (idtalla)
            whereConditions.idtalla = idtalla;
        // Primero obtener los IDs de productos que cumplen con los filtros
        const lotesTallaIds = await lote_talla_model_1.default.findAll({
            where: whereConditions,
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    where: { idestado: estados_constans_1.LoteEstado.DISPONIBLE },
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            where: nombre ? { nombre: { [sequelize_1.Op.like]: `%${nombre}%` } } : undefined,
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    where: idcategoria ? { id: idcategoria } : undefined,
                                    required: !!idcategoria
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    where: idmarca ? { id: idmarca } : undefined,
                                    required: !!idmarca
                                }
                            ]
                        }
                    ]
                }
            ],
            attributes: ['id'],
            limit: limitNumber,
            offset: offset
        });
        const ids = lotesTallaIds.map(item => item.id);
        // Ahora obtener los datos completos solo para esos IDs
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: Object.assign({ id: { [sequelize_1.Op.in]: ids } }, whereConditions),
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [
                [{ model: lote_model_1.default, as: 'Lote' }, { model: producto_model_1.default, as: 'Producto' }, 'nombre', 'ASC'],
                ['idtalla', 'ASC']
            ]
        });
        // Obtener total para paginación
        const total = await lote_talla_model_1.default.count({
            where: whereConditions,
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    where: { idestado: estados_constans_1.LoteEstado.DISPONIBLE },
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            where: nombre ? { nombre: { [sequelize_1.Op.like]: `%${nombre}%` } } : undefined,
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    where: idcategoria ? { id: idcategoria } : undefined,
                                    required: !!idcategoria
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    where: idmarca ? { id: idmarca } : undefined,
                                    required: !!idmarca
                                }
                            ]
                        }
                    ]
                }
            ],
            distinct: true,
            col: 'id' // ✅ Ajuste aquí
        });
        // Transformar datos
        const productosTransformados = lotesTalla.map(item => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return ({
                id: item.id,
                producto_id: (_b = (_a = item.Lote) === null || _a === void 0 ? void 0 : _a.Producto) === null || _b === void 0 ? void 0 : _b.id,
                nombre: (_d = (_c = item.Lote) === null || _c === void 0 ? void 0 : _c.Producto) === null || _d === void 0 ? void 0 : _d.nombre,
                imagen: (_f = (_e = item.Lote) === null || _e === void 0 ? void 0 : _e.Producto) === null || _f === void 0 ? void 0 : _f.imagen,
                categoria: (_h = (_g = item.Lote) === null || _g === void 0 ? void 0 : _g.Producto) === null || _h === void 0 ? void 0 : _h.Categoria,
                marca: (_k = (_j = item.Lote) === null || _j === void 0 ? void 0 : _j.Producto) === null || _k === void 0 ? void 0 : _k.Marca,
                talla: item.Talla,
                genero: item.esGenero,
                precio: item.precioventa,
                stock: item.stock,
            });
        });
        res.json({
            msg: 'Productos disponibles obtenidos exitosamente',
            data: productosTransformados,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                totalItems: total,
                itemsPerPage: limitNumber
            }
        });
    }
    catch (error) {
        console.error('Error en getProductosDisponibles:', error);
        res.status(500).json({ msg: 'Error al obtener productos disponibles' });
    }
};
exports.getProductosDisponibles = getProductosDisponibles;
// GET - Obtener tallas disponibles para un producto específico (Versión ajustada)
const getTallasDisponibles = async (req, res) => {
    const { productoId, genero } = req.query;
    try {
        // Validaciones
        if (!productoId || typeof productoId !== 'string') {
            res.status(400).json({ msg: 'El ID del producto es requerido' });
            return;
        }
        const productoIdNumero = parseInt(productoId);
        if (isNaN(productoIdNumero)) {
            res.status(400).json({ msg: 'El ID del producto debe ser un número válido' });
            return;
        }
        // Filtro base: solo tallas con stock > 0 y lote en estado disponible
        const whereOptions = {
            idestado: estados_constans_1.LoteEstado.DISPONIBLE,
            stock: { [sequelize_1.Op.gt]: 0 } //  garantiza que no traiga tallas agotadas
        };
        // Agregar filtro de género si está presente
        if (genero && typeof genero === 'string' && !isNaN(parseInt(genero))) {
            whereOptions.esGenero = parseInt(genero);
        }
        const tallas = await lote_talla_model_1.default.findAll({
            where: whereOptions,
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    where: {
                        idproducto: productoIdNumero,
                        idestado: estados_constans_1.LoteEstado.DISPONIBLE
                    },
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre', 'imagen']
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ],
            attributes: ['id', 'stock', 'precioventa', 'preciocosto'],
            order: [[{ model: talla_model_1.default, as: 'Talla' }, 'nombre', 'ASC']]
        });
        res.json({
            msg: 'Tallas disponibles obtenidas exitosamente',
            data: tallas
        });
    }
    catch (error) {
        console.error('Error en getTallasDisponibles:', error);
        res.status(500).json({ msg: 'Error al obtener tallas disponibles' });
    }
};
exports.getTallasDisponibles = getTallasDisponibles;
// GET - Verificar stock en tiempo real
const verificarStock = async (req, res) => {
    const { loteTallaId, cantidad } = req.query;
    try {
        const loteTalla = await lote_talla_model_1.default.findByPk(loteTallaId, {
            attributes: ['id', 'stock', 'precioventa']
        });
        if (!loteTalla) {
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        const stockDisponible = loteTalla.stock || 0;
        const cantidadSolicitada = parseInt(cantidad) || 1;
        res.json({
            msg: 'Stock verificado exitosamente',
            data: {
                disponible: stockDisponible >= cantidadSolicitada,
                stockActual: stockDisponible,
                puedeComprar: stockDisponible >= cantidadSolicitada
            }
        });
    }
    catch (error) {
        console.error('Error en verificarStock:', error);
        res.status(500).json({ msg: 'Error al verificar stock' });
    }
};
exports.verificarStock = verificarStock;
// UPDATE - Agregar stock a un detalle de lote_talla específico
const agregarStockPorLoteTalla = async (req, res) => {
    var _a;
    const { idLoteTalla, cantidad } = req.body;
    const transaction = await connection_db_1.default.transaction(); // 🔹 iniciamos transacción
    try {
        // Validaciones iniciales
        if (!idLoteTalla || cantidad === undefined) {
            res.status(400).json({ msg: 'Los campos idLoteTalla y cantidad son obligatorios' });
            return;
        }
        if (cantidad <= 0) {
            res.status(400).json({ msg: 'La cantidad debe ser un valor positivo' });
            return;
        }
        // Buscar el detalle de lote_talla existente con sus relaciones
        const loteTalla = await lote_talla_model_1.default.findByPk(idLoteTalla, {
            include: [
                { model: talla_model_1.default, as: 'Talla', attributes: ['id', 'nombre'] },
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    include: [{ model: estado_model_1.default, as: 'Estado', attributes: ['id', 'nombre'] }]
                },
                { model: estado_model_1.default, as: 'Estado', attributes: ['id', 'nombre'] }
            ],
            transaction
        });
        if (!loteTalla) {
            await transaction.rollback();
            res.status(404).json({ msg: 'El detalle de lote-talla no existe' });
            return;
        }
        // Verificar que el lote esté disponible
        if (((_a = loteTalla.Lote) === null || _a === void 0 ? void 0 : _a.idestado) !== estados_constans_1.LoteEstado.DISPONIBLE) {
            await transaction.rollback();
            res.status(400).json({ msg: 'No se puede agregar stock a un lote no disponible' });
            return;
        }
        // Verificar que el detalle de lote-talla esté disponible
        if (loteTalla.idestado !== estados_constans_1.LoteEstado.DISPONIBLE) {
            await transaction.rollback();
            res.status(400).json({ msg: 'No se puede agregar stock a un detalle no disponible' });
            return;
        }
        // 🔹 Incrementar stock de forma segura
        await loteTalla.increment('stock', { by: cantidad, transaction });
        // Crear movimiento de ingreso
        const nuevoMovimiento = await movimiento_lote_model_1.default.create({
            idlote_talla: idLoteTalla,
            tipomovimiento: estados_constans_1.TipoMovimientoLote.ENTRADA,
            cantidad,
            fechamovimiento: (0, moment_timezone_1.default)().tz("America/Lima").toDate(),
            idestado: estados_constans_1.EstadoGeneral.REGISTRADO
        }, { transaction });
        // Confirmar la transacción
        await transaction.commit();
        // Obtener el movimiento creado con sus relaciones
        const movimientoCreado = await movimiento_lote_model_1.default.findByPk(nuevoMovimiento.id, {
            include: [
                {
                    model: lote_talla_model_1.default,
                    as: 'LoteTalla',
                    attributes: ['id', 'stock', 'esGenero', 'preciocosto', 'precioventa'],
                    include: [
                        { model: talla_model_1.default, as: 'Talla', attributes: ['id', 'nombre'] },
                        {
                            model: lote_model_1.default,
                            as: 'Lote',
                            attributes: ['id', 'proveedor', 'fechaingreso'],
                            include: [{ model: producto_model_1.default, as: 'Producto', attributes: ['id', 'nombre'] }]
                        }
                    ]
                },
                { model: estado_model_1.default, as: 'Estado', attributes: ['id', 'nombre'] }
            ]
        });
        // Obtener el detalle actualizado
        const loteTallaActualizado = await lote_talla_model_1.default.findByPk(idLoteTalla, {
            include: [
                { model: talla_model_1.default, as: 'Talla', attributes: ['id', 'nombre'] },
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    include: [
                        { model: producto_model_1.default, as: 'Producto', attributes: ['id', 'nombre'] },
                        { model: estado_model_1.default, as: 'Estado', attributes: ['id', 'nombre'] }
                    ]
                },
                { model: estado_model_1.default, as: 'Estado', attributes: ['id', 'nombre'] }
            ]
        });
        res.status(200).json({
            msg: 'Stock agregado exitosamente',
            idLoteTalla,
            idMovimiento: nuevoMovimiento.id,
            data: {
                loteTalla: loteTallaActualizado,
                movimiento: movimientoCreado
            }
        });
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error en agregarStockPorLoteTalla:', error.message, error.stack);
        res.status(500).json({ msg: 'Ocurrió un error, comuníquese con soporte' });
    }
};
exports.agregarStockPorLoteTalla = agregarStockPorLoteTalla;
// READ - Obtener productos en formato similar al servicio (valores estáticos)
// export const getProductosFormatoService = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Obtener productos con sus relaciones
//     const productos = await Producto.findAll({
//       where: { idestado: EstadoGeneral.REGISTRADO },
//       include: [
//         {
//           model: Categoria,
//           as: 'Categoria',
//           attributes: ['id', 'nombre']
//         },
//         {
//           model: Marca,
//           as: 'Marca',
//           attributes: ['id', 'nombre']
//         },
//         {
//           model: Lote,
//           as: 'Lotes',
//           where: { idestado: LoteEstado.DISPONIBLE },
//           required: false,
//           include: [
//             {
//               model: LoteTalla,
//               as: 'LoteTallas',
//               where: { idestado: LoteEstado.DISPONIBLE, stock: { [Op.gt]: 0 } },
//               required: false,
//               include: [
//                 {
//                   model: Talla,
//                   as: 'Talla',
//                   attributes: ['id', 'nombre']
//                 }
//               ]
//             }
//           ]
//         }
//       ],
//       order: [['id', 'ASC']]
//     });
//     // Transformar los datos al formato del servicio
//     const productosFormateados = productos.map((producto: any, index: number) => {
//       // Obtener tallas disponibles
//       const tallasDisponibles = producto.Lotes?.flatMap((lote: any) =>
//         lote.LoteTallas?.map((lt: any) => lt.Talla?.nombre).filter(Boolean)
//       ).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index) || [];
//       // Calcular stock total
//       const stockTotal = producto.Lotes?.reduce((total: number, lote: any) =>
//         total + (lote.LoteTallas?.reduce((subtotal: number, lt: any) => subtotal + (lt.stock || 0), 0) || 0), 0
//       ) || 0;
//       // Obtener precio (usar el precio de venta del primer lote_talla disponible)
//       const precio = producto.Lotes?.[0]?.LoteTallas?.[0]?.precioventa || 0;
//       // Generar colores basados en la marca (simulación)
//       const coloresPorMarca: { [key: string]: string[] } = {
//         'Nike': ['Blanco', 'Negro', 'Azul'],
//         'Adidas': ['Blanco', 'Negro', 'Rojo'],
//         'Puma': ['Negro', 'Azul', 'Rosa'],
//         'Levi\'s': ['Azul', 'Negro', 'Gris'],
//         'H&M': ['Blanco', 'Rosa', 'Azul'],
//         'Zara': ['Beige', 'Azul', 'Negro']
//       };
//       const colores = coloresPorMarca[producto.Marca?.nombre] || ['Negro', 'Blanco', 'Gris'];
//       // Generar imágenes placeholder
//       const imagenes = [
//         `https://via.placeholder.com/400x300?text=${encodeURIComponent(producto.nombre || 'Producto')}+1`,
//         `https://via.placeholder.com/400x300?text=${encodeURIComponent(producto.nombre || 'Producto')}+2`,
//         `https://via.placeholder.com/400x300?text=${encodeURIComponent(producto.nombre || 'Producto')}+3`
//       ];
//       return {
//         id: producto.id || index + 1,
//         nombre: producto.nombre || 'Producto sin nombre',
//         marca: producto.Marca?.nombre || 'Sin marca',
//         precio: precio,
//         descripcion: producto.descripcion || `Descripción del producto ${producto.nombre}`,
//         imagenes: imagenes,
//         categoria: producto.Categoria?.nombre || 'Sin categoría',
//         genero: producto.Lotes?.[0]?.LoteTallas?.[0]?.esGenero === 1 ? 'Hombre' :
//                producto.Lotes?.[0]?.LoteTallas?.[0]?.esGenero === 2 ? 'Mujer' : 'Unisex',
//         tallas: tallasDisponibles.length > 0 ? tallasDisponibles : ['Única'],
//         colores: colores,
//         stock: stockTotal
//       };
//     });
//     res.json({
//       msg: 'Productos obtenidos en formato servicio exitosamente',
//       data: productosFormateados
//     });
//   } catch (error) {
//     console.error('Error en getProductosFormatoService:', error);
//     res.status(500).json({ msg: 'Error al obtener productos en formato servicio' });
//   }
// };
const getProductosFormatoService = async (req, res) => {
    try {
        // Obtener productos disponibles siguiendo el patrón de consultas existentes
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: {
                idestado: estados_constans_1.LoteEstado.DISPONIBLE,
                stock: { [sequelize_1.Op.gt]: 0 }
            },
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    where: { idestado: estados_constans_1.LoteEstado.DISPONIBLE },
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            where: { idestado: [estados_constans_1.EstadoGeneral.REGISTRADO, estados_constans_1.EstadoGeneral.ACTUALIZADO] },
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: marca_model_1.default,
                                    as: 'Marca',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [
                [{ model: lote_model_1.default, as: 'Lote' }, { model: producto_model_1.default, as: 'Producto' }, 'nombre', 'ASC']
            ]
        });
        // Agrupar por producto para evitar duplicados
        const productosMap = new Map();
        lotesTalla.forEach((item) => {
            var _a, _b, _c, _d, _e;
            const producto = (_a = item.Lote) === null || _a === void 0 ? void 0 : _a.Producto;
            if (!producto)
                return;
            const productoId = producto.id;
            if (!productosMap.has(productoId)) {
                // Generar colores basados en la marca (simulación)
                const coloresPorMarca = {
                    'Nike': ['Blanco', 'Negro', 'Azul'],
                    'Adidas': ['Blanco', 'Negro', 'Rojo'],
                    'Puma': ['Negro', 'Azul', 'Rosa'],
                    'Levi\'s': ['Azul', 'Negro', 'Gris'],
                    'H&M': ['Blanco', 'Rosa', 'Azul'],
                    'Zara': ['Beige', 'Azul', 'Negro']
                };
                const colores = coloresPorMarca[(_b = producto.Marca) === null || _b === void 0 ? void 0 : _b.nombre] || ['Negro', 'Blanco', 'Gris'];
                // Generar imágenes placeholder
                const imagenes = [
                    producto.imagen || 'Producto'
                ];
                productosMap.set(productoId, {
                    id: item.id,
                    nombre: producto.nombre || 'Producto sin nombre',
                    marca: ((_c = producto.Marca) === null || _c === void 0 ? void 0 : _c.nombre) || 'Sin marca',
                    precio: item.precioventa || 0,
                    preciosPorTalla: {}, // Nuevo campo para precios por talla
                    descripcion: producto.descripcion || `Descripción del producto ${producto.nombre}`,
                    imagenes: imagenes,
                    categoria: ((_d = producto.Categoria) === null || _d === void 0 ? void 0 : _d.nombre) || 'Sin categoría',
                    genero: item.esGenero === 1 ? 'Hombre' : item.esgenero === 2 ? 'Mujer' : 'Unisex',
                    tallas: [],
                    colores: colores,
                    stock: 0
                });
            }
            // Agregar talla y precio por talla si no existe
            const productoData = productosMap.get(productoId);
            if (((_e = item.Talla) === null || _e === void 0 ? void 0 : _e.nombre) && !productoData.tallas.includes(item.Talla.nombre)) {
                productoData.tallas.push(item.Talla.nombre);
                // Agregar precio por talla usando preciocosto
                productoData.preciosPorTalla[item.Talla.nombre] = item.precioventa || 0;
            }
            // Sumar stock
            productoData.stock += item.stock || 0;
        });
        // Convertir el mapa a array
        const productosFormateados = Array.from(productosMap.values());
        res.json({
            msg: 'Productos obtenidos en formato servicio exitosamente',
            data: productosFormateados
        });
    }
    catch (error) {
        console.error('Error en getProductosFormatoService:', error);
        res.status(500).json({ msg: 'Error al obtener productos en formato servicio' });
    }
};
exports.getProductosFormatoService = getProductosFormatoService;
// UPDATE OR CREATE MULTIPLE - Crear o actualizar múltiples lote_talla
const updateOrCreateMultipleLoteTalla = async (req, res) => {
    const { lotesTalla } = req.body; // Array de objetos lote_talla a procesar
    try {
        if (!lotesTalla || !Array.isArray(lotesTalla) || lotesTalla.length === 0) {
            res.status(400).json({ msg: "El array de lotes_talla es obligatorio" });
            return;
        }
        const resultados = [];
        const errores = [];
        for (const item of lotesTalla) {
            try {
                const { id, idlote, idtalla, stock, esGenero, preciocosto, precioventa } = item;
                // VALIDACIONES OBLIGATORIAS
                if (!idlote) {
                    errores.push({ item, error: "El idlote es obligatorio" });
                    continue;
                }
                if (!idtalla) {
                    errores.push({ item, error: "El idtalla es obligatorio" });
                    continue;
                }
                if (esGenero === undefined) {
                    errores.push({ item, error: "El campo esGenero es obligatorio" });
                    continue;
                }
                // Verificar si existe el lote
                const lote = await lote_model_1.default.findByPk(idlote);
                if (!lote) {
                    errores.push({ item, error: 'El lote no existe' });
                    continue;
                }
                // Verificar si existe la talla
                const talla = await talla_model_1.default.findByPk(idtalla);
                if (!talla) {
                    errores.push({ item, error: 'La talla no existe' });
                    continue;
                }
                let loteTalla = null;
                let esNuevo = false;
                if (id) {
                    // ========== ACTUALIZACIÓN ==========
                    // Buscar registro existente
                    loteTalla = await lote_talla_model_1.default.findByPk(id);
                    if (!loteTalla) {
                        errores.push({ item, error: `No existe un lote_talla con el id ${id}` });
                        continue;
                    }
                    // Verificar duplicados SOLO para actualizaciones
                    const whereClause = {
                        id: { [sequelize_1.Op.ne]: id }, // Excluir el registro actual
                        idlote,
                        idtalla,
                        esGenero,
                        idestado: { [sequelize_1.Op.ne]: estados_constans_1.LoteEstado.ELIMINADO }
                    };
                    const loteTallaExistente = await lote_talla_model_1.default.findOne({ where: whereClause });
                    if (loteTallaExistente) {
                        errores.push({
                            item,
                            error: 'Ya existe otro registro con la misma talla y género para este lote'
                        });
                        continue;
                    }
                    // Actualizar campos (EXCLUYENDO el stock para actualizaciones)
                    if (preciocosto !== undefined)
                        loteTalla.preciocosto = preciocosto;
                    if (precioventa !== undefined)
                        loteTalla.precioventa = precioventa;
                    // Cambiar estado a DISPONIBLE si no está eliminado
                    if (loteTalla.idestado !== estados_constans_1.LoteEstado.ELIMINADO) {
                        loteTalla.idestado = estados_constans_1.LoteEstado.DISPONIBLE;
                    }
                }
                else {
                    // ========== CREACIÓN ==========
                    esNuevo = true;
                    // Validar que el stock esté presente para nuevos registros
                    if (stock === undefined || stock === null) {
                        errores.push({ item, error: "El stock es obligatorio para nuevos registros" });
                        continue;
                    }
                    // Verificar duplicados SOLO para creaciones (sin excluir ningún ID)
                    const whereClause = {
                        idlote,
                        idtalla,
                        esGenero,
                        idestado: { [sequelize_1.Op.ne]: estados_constans_1.LoteEstado.ELIMINADO }
                    };
                    const loteTallaExistente = await lote_talla_model_1.default.findOne({ where: whereClause });
                    if (loteTallaExistente) {
                        errores.push({
                            item,
                            error: 'Ya existe un registro con la misma talla y género para este lote'
                        });
                        continue;
                    }
                    // Crear nuevo registro
                    loteTalla = await lote_talla_model_1.default.create({
                        idlote,
                        idtalla,
                        stock: stock || 0,
                        esGenero,
                        preciocosto: preciocosto || 0,
                        precioventa: precioventa || 0,
                        idestado: estados_constans_1.LoteEstado.DISPONIBLE
                    });
                    // Registrar movimiento de ENTRADA por el stock inicial
                    if (stock && stock > 0) {
                        await movimiento_lote_model_1.default.create({
                            idlote_talla: loteTalla.id,
                            tipomovimiento: estados_constans_1.TipoMovimientoLote.ENTRADA,
                            cantidad: Number(stock),
                            fechamovimiento: (0, moment_timezone_1.default)().tz("America/Lima").toDate(),
                            idestado: estados_constans_1.EstadoGeneral.REGISTRADO
                        });
                    }
                }
                await loteTalla.save();
                // Obtener el lote_talla actualizado/creado con relaciones
                const loteTallaCompleto = await lote_talla_model_1.default.findByPk(loteTalla.id, {
                    include: [
                        {
                            model: lote_model_1.default,
                            as: 'Lote',
                            attributes: ['id', 'proveedor', 'fechaingreso'],
                            include: [
                                {
                                    model: producto_model_1.default,
                                    as: 'Producto',
                                    attributes: ['id', 'nombre'],
                                    include: [
                                        {
                                            model: categoria_model_1.default,
                                            as: 'Categoria',
                                            attributes: ['id', 'nombre']
                                        },
                                        {
                                            model: marca_model_1.default,
                                            as: 'Marca',
                                            attributes: ['id', 'nombre']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: talla_model_1.default,
                            as: 'Talla',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: estado_model_1.default,
                            as: 'Estado',
                            attributes: ['id', 'nombre']
                        }
                    ]
                });
                // Verificar que loteTallaCompleto no sea null antes de usarlo
                if (!loteTallaCompleto) {
                    errores.push({ item, error: "Error al recuperar el registro después de guardar" });
                    continue;
                }
                resultados.push(Object.assign(Object.assign({}, loteTallaCompleto.toJSON()), { accion: esNuevo ? 'creado' : 'actualizado' }));
            }
            catch (error) {
                console.error(`Error procesando lote_talla ${item.id || 'nuevo'}:`, error);
                errores.push({ item, error: "Error interno al procesar el registro" });
            }
        }
        if (errores.length > 0) {
            res.status(207).json({
                msg: "Algunos registros no se pudieron procesar",
                data: resultados,
                errores: errores,
                total: lotesTalla.length,
                exitosos: resultados.length,
                fallidos: errores.length
            });
        }
        else {
            res.json({
                msg: "Todos los lote_talla fueron procesados con éxito",
                data: resultados,
                total: resultados.length
            });
        }
    }
    catch (error) {
        console.error("Error en updateOrCreateMultipleLoteTalla:", error);
        res.status(500).json({ msg: "Ocurrió un error, comuníquese con soporte" });
    }
};
exports.updateOrCreateMultipleLoteTalla = updateOrCreateMultipleLoteTalla;
// READ - Obtener resumen de stock crítico con detalle
const getResumenStockCritico = async (req, res) => {
    const { limiteStock = 15 } = req.query;
    try {
        const limite = parseInt(limiteStock) || 15;
        const lotesTalla = await lote_talla_model_1.default.findAll({
            where: {
                idestado: {
                    [sequelize_1.Op.in]: [estados_constans_1.LoteEstado.DISPONIBLE, estados_constans_1.LoteEstado.AGOTADO]
                }
            },
            attributes: [
                'id',
                'stock',
                'esGenero',
                'preciocosto',
                'precioventa'
            ],
            include: [
                {
                    model: lote_model_1.default,
                    as: 'Lote',
                    where: { idestado: estados_constans_1.LoteEstado.DISPONIBLE },
                    attributes: ['id', 'proveedor', 'fechaingreso'],
                    include: [
                        {
                            model: producto_model_1.default,
                            as: 'Producto',
                            attributes: ['id', 'nombre'],
                            include: [
                                {
                                    model: categoria_model_1.default,
                                    as: 'Categoria',
                                    attributes: ['id', 'nombre']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: talla_model_1.default,
                    as: 'Talla',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        // Calcular estadísticas y armar detalle
        let agotados = 0;
        let porAgotarse = 0;
        let normales = 0;
        const detalleCritico = [];
        lotesTalla.forEach((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const estado = item.stock === 0
                ? 'AGOTADO'
                : item.stock <= limite
                    ? 'POR AGOTARSE'
                    : 'NORMAL';
            if (estado === 'AGOTADO')
                agotados++;
            if (estado === 'POR AGOTARSE')
                porAgotarse++;
            if (estado === 'NORMAL')
                normales++;
            // Solo guardamos en detalle los críticos
            if (estado !== 'NORMAL') {
                detalleCritico.push({
                    idLoteTalla: item.id,
                    stock: item.stock,
                    estado: estado,
                    preciocosto: item.preciocosto,
                    precioventa: item.precioventa,
                    talla: ((_a = item.Talla) === null || _a === void 0 ? void 0 : _a.nombre) || null,
                    producto: ((_c = (_b = item.Lote) === null || _b === void 0 ? void 0 : _b.Producto) === null || _c === void 0 ? void 0 : _c.nombre) || null,
                    categoria: ((_f = (_e = (_d = item.Lote) === null || _d === void 0 ? void 0 : _d.Producto) === null || _e === void 0 ? void 0 : _e.Categoria) === null || _f === void 0 ? void 0 : _f.nombre) || null,
                    proveedor: ((_g = item.Lote) === null || _g === void 0 ? void 0 : _g.proveedor) || null,
                    fechaingreso: ((_h = item.Lote) === null || _h === void 0 ? void 0 : _h.fechaingreso) || null
                });
            }
        });
        const total = agotados + porAgotarse + normales;
        res.json({
            msg: 'Resumen de stock crítico obtenido exitosamente',
            data: {
                total_lotes_talla: total,
                agotados,
                por_agotarse: porAgotarse,
                normales,
                limite_stock: limite,
                porcentaje_critico: total > 0 ? Math.round(((agotados + porAgotarse) / total) * 100) : 0,
                detalle: detalleCritico
            }
        });
    }
    catch (error) {
        console.error('Error en getResumenStockCritico:', error);
        res.status(500).json({ msg: 'Error al obtener resumen de stock crítico' });
    }
};
exports.getResumenStockCritico = getResumenStockCritico;
