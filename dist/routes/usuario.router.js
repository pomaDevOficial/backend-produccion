"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { createUsuario, getUsuarios, getUsuarioById } from '../controllers/usuario.controller';
const usuario_controller_1 = require("../controllers/usuario.controller");
const UsuariosRouter = (0, express_1.Router)();
UsuariosRouter.post('/', usuario_controller_1.createUsuario); // Crear un nuevo usuario
UsuariosRouter.get('/', usuario_controller_1.getUsuarios); // Obtener la lista de usuarios
UsuariosRouter.get('/:id', usuario_controller_1.getUsuarioById); // Obtener un usuario por ID
UsuariosRouter.put('/:id', usuario_controller_1.updateUsuario); // Actualizar un usuario por ID
UsuariosRouter.patch('/:id/estado', usuario_controller_1.deleteUsuario); // Cambia el estado del usuario
UsuariosRouter.patch('/:id/activar', usuario_controller_1.activarUsuario); // Cambia el estado del usuario
UsuariosRouter.patch('/:id/desactivar', usuario_controller_1.desactivarUsuario); // Cambia el estado del usuario
exports.default = UsuariosRouter;
