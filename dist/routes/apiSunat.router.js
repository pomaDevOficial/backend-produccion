"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiSunat_controller_1 = require("../controllers/apiSunat.controller");
const routerApiSunat = (0, express_1.Router)();
// 👉 Consultar DNI
routerApiSunat.get('/dni/:dni', apiSunat_controller_1.consultarDNI);
// 👉 Consultar RUC
routerApiSunat.get('/ruc/:ruc', apiSunat_controller_1.consultarRUC);
exports.default = routerApiSunat;
