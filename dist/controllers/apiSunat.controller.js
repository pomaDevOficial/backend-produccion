"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarRUC = exports.consultarDNI = void 0;
const axios_1 = __importDefault(require("axios"));
const consultarDNI = async (req, res) => {
    const { dni } = req.params;
    if (!dni) {
        res.status(400).json({ error: 'Número de DNI no proporcionado' });
        return;
    }
    // Token de autenticación proporcionado por la API
    const API_KEY = 'YX6xrS9emeD3b51rgzTCMo7avtrGNvFtss1zkIAMvu73RZO6RbI723KHutyyf6AA';
    try {
        const response = await axios_1.default.get(`https://api.apis.net.pe/v1/dni?numero=${dni}`);
        // Devuelve los datos de la respuesta de la API
        res.json(response.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            if (axiosError.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                res.status(axiosError.response.status).json({ error: axiosError.response.data });
            }
            else {
                // Error de red o el servidor no respondió
                res.status(500).json({ error: 'Error de red o el servidor no respondió' });
            }
        }
        else {
            // Otro tipo de error
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};
exports.consultarDNI = consultarDNI;
const consultarRUC = async (req, res) => {
    const { ruc } = req.params;
    if (!ruc) {
        res.status(400).json({ error: 'Número de RUC no proporcionado' });
        return;
    }
    // Token de autenticación proporcionado por la API
    const API_KEY = 'YX6xrS9emeD3b51rgzTCMo7avtrGNvFtss1zkIAMvu73RZO6RbI723KHutyyf6AA';
    try {
        const response = await axios_1.default.get(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`);
        // Devuelve los datos de la respuesta de la API
        res.json(response.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            if (axiosError.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                res.status(axiosError.response.status).json({ error: axiosError.response.data });
            }
            else {
                // Error de red o el servidor no respondió
                res.status(500).json({ error: 'Error de red o el servidor no respondió' });
            }
        }
        else {
            // Otro tipo de error
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};
exports.consultarRUC = consultarRUC;
