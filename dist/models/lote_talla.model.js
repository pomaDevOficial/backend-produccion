"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ==================== MODELO LOTE_TALLA ====================
const sequelize_1 = require("sequelize");
const connection_db_1 = __importDefault(require("../db/connection.db"));
const lote_model_1 = __importDefault(require("./lote.model"));
const talla_model_1 = __importDefault(require("./talla.model"));
const estado_model_1 = __importDefault(require("./estado.model"));
class LoteTalla extends sequelize_1.Model {
}
LoteTalla.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idlote: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    idtalla: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    stock: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    esGenero: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    preciocosto: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: true },
    precioventa: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: true },
    idestado: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
}, { sequelize: connection_db_1.default, tableName: "lote_talla", timestamps: false });
// Relaciones
LoteTalla.belongsTo(lote_model_1.default, { foreignKey: 'idlote', as: 'Lote' });
LoteTalla.belongsTo(talla_model_1.default, { foreignKey: 'idtalla', as: 'Talla' });
LoteTalla.belongsTo(estado_model_1.default, { foreignKey: 'idestado', as: 'Estado' });
exports.default = LoteTalla;
