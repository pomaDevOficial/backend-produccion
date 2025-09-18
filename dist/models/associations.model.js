"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
// src/models/associations.ts
const lote_model_1 = __importDefault(require("./lote.model"));
const lote_talla_model_1 = __importDefault(require("./lote_talla.model"));
const producto_model_1 = __importDefault(require("./producto.model"));
const estado_model_1 = __importDefault(require("./estado.model"));
const talla_model_1 = __importDefault(require("./talla.model"));
const setupAssociations = () => {
    // Asociaciones de LoteTalla
    lote_talla_model_1.default.belongsTo(lote_model_1.default, { foreignKey: 'idlote', as: 'Lote' });
    lote_talla_model_1.default.belongsTo(talla_model_1.default, { foreignKey: 'idtalla', as: 'Talla' });
    lote_talla_model_1.default.belongsTo(estado_model_1.default, { foreignKey: 'idestado', as: 'Estado' });
    // Asociaciones de Lote
    lote_model_1.default.belongsTo(producto_model_1.default, { foreignKey: 'idproducto', as: 'Producto' });
    lote_model_1.default.belongsTo(estado_model_1.default, { foreignKey: 'idestado', as: 'Estado' });
    lote_model_1.default.hasMany(lote_talla_model_1.default, { foreignKey: 'idlote', as: 'LoteTalla' });
};
exports.setupAssociations = setupAssociations;
