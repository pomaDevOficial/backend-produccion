"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFileWhatsApp = exports.reenviarComprobanteWSP = exports.enviarComprobanteWSP = exports.sendWhatsAppMessage = exports.obtenerEstadoServicio = exports.enviarArchivo = exports.reenviarComprobante = exports.enviarComprobante = exports.enviarComprobanteService = exports.enviarMensaje = exports.enviarMensajePedido = exports.enviarArchivoWSP = exports.generarPDFComprobante = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const comprobante_model_1 = __importDefault(require("../models/comprobante.model"));
const venta_model_1 = __importDefault(require("../models/venta.model"));
const pedido_model_1 = __importDefault(require("../models/pedido.model"));
const persona_model_1 = __importDefault(require("../models/persona.model"));
const tipo_comprobante_model_1 = __importDefault(require("../models/tipo_comprobante.model"));
const detalle_venta_model_1 = __importDefault(require("../models/detalle_venta.model"));
const pedido_detalle_model_1 = __importDefault(require("../models/pedido_detalle.model"));
const lote_talla_model_1 = __importDefault(require("../models/lote_talla.model"));
const lote_model_1 = __importDefault(require("../models/lote.model"));
const producto_model_1 = __importDefault(require("../models/producto.model"));
// Configuración de GreenAPI
const ID_INSTANCE = "7105309578";
const API_TOKEN_INSTANCE = "13cf8fdf2a3348fa9e802e080eb072d7b42acc76c6964d1f90";
// const API_TOKEN_INSTANCE = "bfb0408724134cb59d908715edf9e3967519705a04be4227b5";
// Función para generar PDF en formato voucher
// export const generarPDFComprobante = async (comprobante: any, venta: any, pedido: any, detallesVenta: any[]): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Crear nombre de archivo único
//       const filename = `comprobante_${comprobante.numserie}.pdf`;
//      /// path.join(__dirname, "../../dist/uploads");
//       const filePath = path.join(__dirname, "../../dist/uploads", filename);
//       console.log(filePath)
//       // Crear directorio si no existe
//       if (!fs.existsSync(path.dirname(filePath))) {
//         fs.mkdirSync(path.dirname(filePath), { recursive: true });
//       }
//       // Crear documento PDF (tamaño voucher: 80mm ancho ≈ 226.77 puntos)
//       const doc = new PDFDocument({ 
//         size: [226.77, 600], // Ancho fijo, alto variable
//         margin: 10 
//       });
//       // Pipe el PDF a un archivo
//       const stream = fs.createWriteStream(filePath);
//       doc.pipe(stream);
//       // Estilos
//       const fontSizeSmall = 8;
//       const fontSizeNormal = 10;
//       const fontSizeLarge = 12;
//       const lineHeight = 5;
//       // Encabezado
//       doc.fontSize(fontSizeLarge)
//          .font('Helvetica-Bold')
//          .text('MI EMPRESA', { align: 'center' });
//       doc.moveDown(0.5);
//       doc.fontSize(fontSizeNormal)
//          .text('RUC: 20123456789', { align: 'center' });
//       doc.moveDown(0.5);
//       doc.text('BOLETA DE VENTA ELECTRÓNICA', { align: 'center' });
//       // Línea separadora
//       doc.moveTo(doc.x, doc.y + lineHeight)
//          .lineTo(doc.x + 206.77, doc.y + lineHeight)
//          .stroke();
//       doc.moveDown();
//       // Información del comprobante
//       doc.fontSize(fontSizeNormal)
//          .font('Helvetica-Bold')
//          .text(`${comprobante.TipoComprobante?.nombre || 'BOLETA'}: ${comprobante.numserie}`, { align: 'left' });
//       doc.font('Helvetica')
//          .fontSize(fontSizeSmall)
//          .text(`Fecha: ${new Date(venta.fechaventa).toLocaleDateString()}`, { align: 'left' });
//       doc.moveDown();
//       // Información del cliente
//       doc.font('Helvetica-Bold')
//          .text('CLIENTE:', { align: 'left' });
//       doc.font('Helvetica')
//          .text(`${pedido.Persona?.nombre || 'CLIENTE GENERAL'}`, { align: 'left' });
//       if (pedido.Persona?.documento) {
//         doc.text(`DOC: ${pedido.Persona.documento}`, { align: 'left' });
//       }
//       doc.moveDown();
//       // Línea separadora
//       doc.moveTo(doc.x, doc.y + lineHeight)
//          .lineTo(doc.x + 206.77, doc.y + lineHeight)
//          .stroke();
//       doc.moveDown();
//       // Detalles de productos
//       doc.font('Helvetica-Bold')
//          .text('DESCRIPCIÓN', 10, doc.y, { width: 120, align: 'left' })
//          .text('CANT', 130, doc.y, { width: 30, align: 'right' })
//          .text('TOTAL', 160, doc.y, { width: 50, align: 'right' });
//       doc.moveDown(0.5);
//       // Línea separadora
//       doc.moveTo(doc.x, doc.y + lineHeight)
//          .lineTo(doc.x + 206.77, doc.y + lineHeight)
//          .stroke();
//       doc.moveDown(0.5);
//       // Productos
//       detallesVenta.forEach(detalle => {
//         const producto = detalle.PedidoDetalle?.LoteTalla?.Lote?.Producto?.nombre || 'Producto';
//         const cantidad = detalle.PedidoDetalle?.cantidad || 0;
//         const precio = detalle.precio_venta_real || 0;
//         const total = cantidad * precio;
//         doc.font('Helvetica')
//            .fontSize(fontSizeSmall)
//            .text(producto.substring(0, 20), 10, doc.y, { width: 120, align: 'left' })
//            .text(cantidad.toString(), 130, doc.y, { width: 30, align: 'right' })
//            .text(`S/. ${total}`, 160, doc.y, { width: 50, align: 'right' });
//         doc.moveDown(0.5);
//       });
//       // Línea separadora
//       doc.moveTo(doc.x, doc.y + lineHeight)
//          .lineTo(doc.x + 206.77, doc.y + lineHeight)
//          .stroke();
//       doc.moveDown();
//       // Totales
//       doc.font('Helvetica-Bold')
//          .text(`SUBTOTAL: S/. ${(comprobante.total - comprobante.igv)}`, { align: 'right' });
//       doc.text(`IGV (18%): S/. ${comprobante.igv}`, { align: 'right' });
//       doc.fontSize(fontSizeLarge)
//          .text(`TOTAL: S/. ${comprobante.total}`, { align: 'right' });
//       doc.moveDown();
//       // Pie de página
//       doc.fontSize(fontSizeSmall)
//          .font('Helvetica')
//          .text('¡Gracias por su compra!', { align: 'center' });
//       doc.text('Contacto: +51 987 654 321', { align: 'center' });
//       // Finalizar documento
//       doc.end();
//       // Cuando se termine de generar el PDF
//       stream.on('finish', () => {
//         resolve(filename);
//       });
//       stream.on('error', (error) => {
//         reject(error);
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
// Constantes para el layout del PDF
const PDF_CONFIG = {
    width: 226.77,
    height: 700,
    margin: 15,
    fontSizes: {
        small: 7.5,
        normal: 7, // Aún más pequeño para encabezados
        large: 11,
    },
    columns: {
        description: { x: 15, width: 90 },
        quantity: { x: 110, width: 25 },
        unitPrice: { x: 140, width: 35 },
        total: { x: 180, width: 30 },
    },
    lineSpacing: 0.5,
};
// Función auxiliar para dibujar línea separadora
const drawSeparator = (doc, y) => {
    doc.moveTo(PDF_CONFIG.margin, y)
        .lineTo(PDF_CONFIG.width - PDF_CONFIG.margin, y)
        .stroke();
};
// Función auxiliar para agregar texto con wrapping
const addWrappedText = (doc, text, x, y, options) => {
    const maxWidth = options.width || 100;
    const lines = doc.heightOfString(text, { width: maxWidth }) / doc.currentLineHeight();
    if (lines > 1) {
        doc.text(text, x, y, Object.assign(Object.assign({}, options), { width: maxWidth }));
    }
    else {
        doc.text(text, x, y, options);
    }
};
// Función para generar PDF en formato voucher (boleta)
const generarPDFComprobante = async (comprobante, venta, pedido, detallesVenta) => {
    return new Promise((resolve, reject) => {
        var _a, _b, _c, _d;
        try {
            const filename = `comprobante_${comprobante.numserie}.pdf`;
            const filePath = path_1.default.join(__dirname, "../../dist/uploads", filename);
            if (!fs_1.default.existsSync(path_1.default.dirname(filePath))) {
                fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            }
            // Documento tipo voucher (80mm de ancho)
            const doc = new pdfkit_1.default({
                size: [PDF_CONFIG.width, PDF_CONFIG.height],
                margin: PDF_CONFIG.margin,
            });
            const stream = fs_1.default.createWriteStream(filePath);
            doc.pipe(stream);
            // ===== Estilos =====
            const fontSizeSmall = PDF_CONFIG.fontSizes.small;
            const fontSizeNormal = PDF_CONFIG.fontSizes.normal;
            const fontSizeLarge = PDF_CONFIG.fontSizes.large;
            // ===== ENCABEZADO =====
            doc.fontSize(fontSizeLarge)
                .font("Helvetica-Bold")
                .text("MI EMPRESA S.A.C.", { align: "center" });
            doc.moveDown(0.3);
            doc.fontSize(fontSizeNormal).font("Helvetica")
                .text("RUC: 20123456789", { align: "center" })
                .text("Av. Principal 123 - Lima", { align: "center" })
                .text("Tel: (01) 234-5678", { align: "center" });
            doc.moveDown(0.5);
            doc.font("Helvetica-Bold")
                .text("BOLETA DE VENTA ELECTRÓNICA", { align: "center" });
            doc.moveDown(0.3);
            doc.font("Helvetica").fontSize(fontSizeNormal)
                .text(`${((_a = comprobante.TipoComprobante) === null || _a === void 0 ? void 0 : _a.nombre) || "BOLETA"}: ${comprobante.numserie}`, { align: "center" });
            // ===== SEPARADOR =====
            doc.moveDown(0.5);
            drawSeparator(doc, doc.y);
            // ===== INFO CLIENTE =====
            doc.moveDown(0.5);
            doc.font("Helvetica-Bold").fontSize(fontSizeNormal).text("CLIENTE:", { align: "left" });
            doc.font("Helvetica").fontSize(fontSizeSmall)
                .text(`${((_b = pedido === null || pedido === void 0 ? void 0 : pedido.Persona) === null || _b === void 0 ? void 0 : _b.nombres) || "CLIENTE GENERAL"}`, { align: "left" });
            if ((_c = pedido === null || pedido === void 0 ? void 0 : pedido.Persona) === null || _c === void 0 ? void 0 : _c.nroidentidad) {
                doc.text(`DOC: ${pedido.Persona.nroidentidad}`, { align: "left" });
            }
            if ((_d = pedido === null || pedido === void 0 ? void 0 : pedido.MetodoPago) === null || _d === void 0 ? void 0 : _d.nombre) {
                doc.text(`Método Pago: ${pedido.MetodoPago.nombre}`, { align: "left" });
            }
            doc.text(`Fecha: ${new Date(venta.fechaventa).toLocaleDateString()}`, { align: "left" });
            // ===== SEPARADOR =====
            doc.moveDown(0.5);
            drawSeparator(doc, doc.y);
            var xy = doc.y;
            // ===== DETALLE DE PRODUCTOS =====
            doc.moveDown(0.5);
            doc.font("Helvetica-Bold").fontSize(PDF_CONFIG.fontSizes.normal);
            doc.text("DESCRIPCIÓN", PDF_CONFIG.columns.description.x, xy, { width: PDF_CONFIG.columns.description.width, align: "left" })
                .text("CANT", PDF_CONFIG.columns.quantity.x, xy, { width: PDF_CONFIG.columns.quantity.width, align: "center" })
                .text("P.U.", PDF_CONFIG.columns.unitPrice.x, xy, { width: PDF_CONFIG.columns.unitPrice.width, align: "center" })
                .text("TOTAL", PDF_CONFIG.columns.total.x, xy, { width: PDF_CONFIG.columns.total.width, align: "center" });
            doc.moveDown(0.3);
            doc.y = xy + 15;
            drawSeparator(doc, doc.y);
            doc.moveDown(0.2);
            detallesVenta.forEach(detalle => {
                var _a, _b, _c, _d, _e;
                const producto = ((_d = (_c = (_b = (_a = detalle.PedidoDetalle) === null || _a === void 0 ? void 0 : _a.LoteTalla) === null || _b === void 0 ? void 0 : _b.Lote) === null || _c === void 0 ? void 0 : _c.Producto) === null || _d === void 0 ? void 0 : _d.nombre) || "Producto";
                const cantidad = Number((_e = detalle.PedidoDetalle) === null || _e === void 0 ? void 0 : _e.cantidad) || 0;
                const precio = Number(detalle.precio_venta_real) || 0;
                const total = cantidad * precio;
                // Guardamos la posición Y actual
                const y = doc.y;
                doc.font("Helvetica").fontSize(fontSizeSmall);
                // Columna 1: descripción con wrapping
                addWrappedText(doc, producto.substring(0, 20), PDF_CONFIG.columns.description.x, y, {
                    width: PDF_CONFIG.columns.description.width,
                    align: "left"
                });
                // Columna 2: cantidad
                doc.text(cantidad.toFixed(2), PDF_CONFIG.columns.quantity.x, y, {
                    width: PDF_CONFIG.columns.quantity.width,
                    align: "center"
                });
                // Columna 3: precio unitario
                doc.text(`S/. ${precio.toFixed(2)}`, PDF_CONFIG.columns.unitPrice.x, y, {
                    width: PDF_CONFIG.columns.unitPrice.width,
                    align: "center"
                });
                // Columna 4: total
                doc.text(`S/. ${total.toFixed(2)}`, PDF_CONFIG.columns.total.x, y, {
                    width: PDF_CONFIG.columns.total.width,
                    align: "center"
                });
                // Bajamos una línea después de cada item
                doc.moveDown(PDF_CONFIG.lineSpacing);
            });
            // ===== SEPARADOR =====
            doc.moveDown(0.3);
            drawSeparator(doc, doc.y);
            // ===== TOTALES =====
            const totalNum = Number(comprobante.total) || 0;
            const igvNum = Number(comprobante.igv) || 0;
            const subtotal = totalNum - igvNum;
            doc.moveDown(0.5);
            doc.font("Helvetica-Bold").fontSize(fontSizeNormal);
            doc.text(`SUBTOTAL: S/. ${subtotal.toFixed(2)}`, PDF_CONFIG.margin, doc.y, { align: "right", width: PDF_CONFIG.width - 2 * PDF_CONFIG.margin });
            doc.text(`IGV (18%): S/. ${igvNum.toFixed(2)}`, PDF_CONFIG.margin, doc.y, { align: "right", width: PDF_CONFIG.width - 2 * PDF_CONFIG.margin });
            doc.fontSize(fontSizeLarge).text(`TOTAL: S/. ${totalNum.toFixed(2)}`, PDF_CONFIG.margin, doc.y, { align: "right", width: PDF_CONFIG.width - 2 * PDF_CONFIG.margin });
            // ===== PIE =====
            doc.moveDown(1);
            doc.font("Helvetica").fontSize(fontSizeSmall)
                .text("¡Gracias por su compra!", PDF_CONFIG.margin, doc.y, { align: "center", width: PDF_CONFIG.width - 2 * PDF_CONFIG.margin })
                .text("Para consultas: soporte@miempresa.com", PDF_CONFIG.margin, doc.y, { align: "center", width: PDF_CONFIG.width - 2 * PDF_CONFIG.margin })
                .text("Boleta Electrónica", PDF_CONFIG.margin, doc.y, { align: "center", width: PDF_CONFIG.width - 2 * PDF_CONFIG.margin });
            doc.end();
            stream.on("finish", () => resolve(filename));
            stream.on("error", (error) => reject(error));
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generarPDFComprobante = generarPDFComprobante;
// Función para enviar archivo por WhatsApp
const enviarArchivoWSP = async (phone, filename, caption = "📄 Comprobante de Venta") => {
    const localPath = path_1.default.join(__dirname, "../../dist/uploads", filename);
    if (!fs_1.default.existsSync(localPath)) {
        throw new Error("Archivo no encontrado en el servidor");
    }
    try {
        const form = new form_data_1.default();
        form.append("chatId", `${phone}@c.us`);
        form.append("caption", caption);
        form.append("fileName", filename);
        form.append("file", fs_1.default.createReadStream(localPath));
        const greenUrl = `https://7105.media.greenapi.com/waInstance${ID_INSTANCE}/sendFileByUpload/${API_TOKEN_INSTANCE}`;
        const sendResponse = await axios_1.default.post(greenUrl, form, {
            headers: form.getHeaders(),
        });
        console.log(sendResponse);
        // Eliminar el archivo después de enviarlo
        fs_1.default.unlinkSync(localPath);
        return sendResponse.data;
    }
    catch (error) {
        // Asegurarse de eliminar el archivo incluso si hay error
        if (fs_1.default.existsSync(localPath)) {
            fs_1.default.unlinkSync(localPath);
        }
        throw error;
    }
};
exports.enviarArchivoWSP = enviarArchivoWSP;
// ============== CONTROLADORES ==============
const enviarMensajePedido = async (telefono, mensaje) => {
    var _a;
    const url = `https://7105.api.greenapi.com/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN_INSTANCE}`;
    const payload = {
        chatId: `${telefono}@c.us`,
        message: mensaje, // ojo, GreenAPI usa "message" no "mensaje"
        customPreview: {
            title: "Mensaje desde tu app",
            description: "Notificación automática",
        },
    };
    try {
        const response = await axios_1.default.post(url, payload, {
            headers: { "Content-Type": "application/json" },
        });
        return {
            success: true,
            data: response.data,
        };
    }
    catch (error) {
        console.error("Error al enviar mensaje:", error);
        return {
            success: false,
            error: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message || "Error al enviar mensaje",
        };
    }
};
exports.enviarMensajePedido = enviarMensajePedido;
// Enviar mensaje simple
const enviarMensaje = async (req, res) => {
    var _a;
    const { phone, message } = req.body;
    if (!phone || !message) {
        res.status(400).json({
            success: false,
            error: 'El número de teléfono y el mensaje son obligatorios'
        });
        return;
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        res.status(400).json({
            success: false,
            error: 'Formato de número inválido. Usa formato internacional sin "+" ni espacios (ej: 51987654321)'
        });
        return;
    }
    const url = `https://7105.api.greenapi.com/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN_INSTANCE}`;
    const payload = {
        chatId: `${phone}@c.us`,
        message,
        customPreview: {
            title: "Mensaje desde tu app",
            description: "Notificación automática"
        }
    };
    try {
        const response = await axios_1.default.post(url, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(200).json({
            success: true,
            message: 'Mensaje enviado exitosamente',
            data: response.data
        });
    }
    catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({
            success: false,
            error: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message || 'Error al enviar mensaje'
        });
    }
};
exports.enviarMensaje = enviarMensaje;
const enviarComprobanteService = async (idComprobante) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // 1. Buscar comprobante con sus relaciones
    const comprobante = await comprobante_model_1.default.findByPk(idComprobante, {
        include: [
            {
                model: venta_model_1.default,
                as: 'Venta',
                include: [
                    {
                        model: pedido_model_1.default,
                        as: 'Pedido',
                        include: [{ model: persona_model_1.default, as: 'Persona' }]
                    }
                ]
            },
            { model: tipo_comprobante_model_1.default, as: 'TipoComprobante' }
        ]
    });
    if (!comprobante) {
        throw new Error('Comprobante no encontrado');
    }
    // 2. Buscar detalles de la venta
    const detallesVenta = await detalle_venta_model_1.default.findAll({
        where: { idventa: (_a = comprobante.Venta) === null || _a === void 0 ? void 0 : _a.id },
        include: [
            {
                model: pedido_detalle_model_1.default,
                as: 'PedidoDetalle',
                include: [
                    {
                        model: lote_talla_model_1.default,
                        as: 'LoteTalla',
                        include: [
                            {
                                model: lote_model_1.default,
                                as: 'Lote',
                                include: [{ model: producto_model_1.default, as: 'Producto' }]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    // 3. Generar PDF
    const nombreArchivo = await (0, exports.generarPDFComprobante)(comprobante, comprobante.Venta, (_b = comprobante.Venta) === null || _b === void 0 ? void 0 : _b.Pedido, detallesVenta);
    // 4. Obtener teléfono
    const telefono = "51" + ((_e = (_d = (_c = comprobante === null || comprobante === void 0 ? void 0 : comprobante.Venta) === null || _c === void 0 ? void 0 : _c.Pedido) === null || _d === void 0 ? void 0 : _d.Persona) === null || _e === void 0 ? void 0 : _e.telefono);
    if (!telefono || !((_h = (_g = (_f = comprobante === null || comprobante === void 0 ? void 0 : comprobante.Venta) === null || _f === void 0 ? void 0 : _f.Pedido) === null || _g === void 0 ? void 0 : _g.Persona) === null || _h === void 0 ? void 0 : _h.telefono)) {
        throw new Error('El comprobante no tiene un número de teléfono válido asociado');
    }
    // 5. Enviar WhatsApp
    const resultadoWSP = await (0, exports.enviarArchivoWSP)(telefono, nombreArchivo, `📄 ${((_j = comprobante.TipoComprobante) === null || _j === void 0 ? void 0 : _j.nombre) || 'Comprobante'} ${comprobante.numserie}`);
    return {
        success: true,
        message: 'Comprobante enviado exitosamente por WhatsApp',
        data: resultadoWSP
    };
};
exports.enviarComprobanteService = enviarComprobanteService;
// Enviar comprobante por WhatsApp
const enviarComprobante = async (req, res) => {
    const { idComprobante } = req.body;
    try {
        if (!idComprobante) {
            res.status(400).json({
                success: false,
                error: 'El ID del comprobante es obligatorio'
            });
            return;
        }
        const resultado = await (0, exports.enviarComprobanteService)(idComprobante);
        res.status(200).json(resultado);
        // Buscar el comprobante con todos los datos relacionados
        // const comprobante = await Comprobante.findByPk(idComprobante, {
        //   include: [
        //     {
        //       model: Venta,
        //       as: 'Venta',
        //       include: [
        //         {
        //           model: Pedido,
        //           as: 'Pedido',
        //           include: [
        //             {
        //               model: Persona,
        //               as: 'Persona'
        //             }
        //           ]
        //         }
        //       ]
        //     },
        //     {
        //       model: TipoComprobante,
        //       as: 'TipoComprobante'
        //     }
        //   ]
        // });
        // if (!comprobante) {
        //   res.status(404).json({ 
        //     success: false,
        //     error: 'Comprobante no encontrado' 
        //   });
        //   return;
        // }
        // // Obtener detalles de la venta
        // const detallesVenta = await DetalleVenta.findAll({
        //   where: { idventa: comprobante.Venta?.id },
        //   include: [
        //     {
        //       model: PedidoDetalle,
        //       as: 'PedidoDetalle',
        //       include: [
        //         {
        //           model: LoteTalla,
        //           as: 'LoteTalla',
        //           include: [
        //             {
        //               model: Lote,
        //               as: 'Lote',
        //               include: [
        //                 {
        //                   model: Producto,
        //                   as: 'Producto'
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // });
        // // Generar el PDF del comprobante
        // const nombreArchivo = await generarPDFComprobante(
        //   comprobante, 
        //   comprobante.Venta, 
        //   comprobante.Venta?.Pedido, 
        //   detallesVenta
        // );
        // const telefono = "51" + comprobante?.Venta?.Pedido?.Persona?.telefono;
        // let resultadoWSP = null;
        // if (telefono && comprobante?.Venta?.Pedido?.Persona?.telefono) {
        //   resultadoWSP = await enviarArchivoWSP(
        //     telefono,
        //     nombreArchivo,
        //     `📄 ${comprobante.TipoComprobante?.nombre || 'Comprobante'} ${comprobante.numserie}`
        //   );
        // } else {
        //   console.warn("⚠️ El comprobante no tiene número de teléfono, no se envió por WhatsApp.");
        //   res.status(400).json({
        //     success: false,
        //     error: 'El comprobante no tiene un número de teléfono válido asociado'
        //   });
        //   return;
        // }
        // res.status(200).json({
        //   success: true,
        //   message: 'Comprobante enviado exitosamente por WhatsApp',
        //   data: resultadoWSP
        // });
    }
    catch (error) {
        console.error('Error al enviar comprobante:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error interno al enviar comprobante'
        });
    }
};
exports.enviarComprobante = enviarComprobante;
// Reenviar comprobante por WhatsApp
const reenviarComprobante = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { idComprobante } = req.body;
    try {
        if (!idComprobante) {
            res.status(400).json({
                success: false,
                error: 'El ID del comprobante es obligatorio'
            });
            return;
        }
        // Buscar el comprobante con todos los datos relacionados
        const comprobante = await comprobante_model_1.default.findByPk(idComprobante, {
            include: [
                {
                    model: venta_model_1.default,
                    as: 'Venta',
                    include: [
                        {
                            model: pedido_model_1.default,
                            as: 'Pedido',
                            include: [
                                {
                                    model: persona_model_1.default,
                                    as: 'Persona'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: tipo_comprobante_model_1.default,
                    as: 'TipoComprobante'
                }
            ]
        });
        if (!comprobante) {
            res.status(404).json({
                success: false,
                error: 'Comprobante no encontrado'
            });
            return;
        }
        // Obtener detalles de la venta
        const detallesVenta = await detalle_venta_model_1.default.findAll({
            where: { idventa: (_a = comprobante.Venta) === null || _a === void 0 ? void 0 : _a.id },
            include: [
                {
                    model: pedido_detalle_model_1.default,
                    as: 'PedidoDetalle',
                    include: [
                        {
                            model: lote_talla_model_1.default,
                            as: 'LoteTalla',
                            include: [
                                {
                                    model: lote_model_1.default,
                                    as: 'Lote',
                                    include: [
                                        {
                                            model: producto_model_1.default,
                                            as: 'Producto'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        // Generar el PDF del comprobante
        const nombreArchivo = await (0, exports.generarPDFComprobante)(comprobante, comprobante.Venta, (_b = comprobante.Venta) === null || _b === void 0 ? void 0 : _b.Pedido, detallesVenta);
        const telefono = "51" + ((_e = (_d = (_c = comprobante === null || comprobante === void 0 ? void 0 : comprobante.Venta) === null || _c === void 0 ? void 0 : _c.Pedido) === null || _d === void 0 ? void 0 : _d.Persona) === null || _e === void 0 ? void 0 : _e.telefono);
        let resultadoWSP = null;
        if (telefono && ((_h = (_g = (_f = comprobante === null || comprobante === void 0 ? void 0 : comprobante.Venta) === null || _f === void 0 ? void 0 : _f.Pedido) === null || _g === void 0 ? void 0 : _g.Persona) === null || _h === void 0 ? void 0 : _h.telefono)) {
            resultadoWSP = await (0, exports.enviarArchivoWSP)(telefono, nombreArchivo, `🔄 REENVÍO - ${((_j = comprobante.TipoComprobante) === null || _j === void 0 ? void 0 : _j.nombre) || 'Comprobante'} ${comprobante.numserie}`);
        }
        else {
            console.warn("⚠️ El comprobante no tiene número de teléfono, no se envió por WhatsApp.");
            res.status(400).json({
                success: false,
                error: 'El comprobante no tiene un número de teléfono válido asociado'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Comprobante reenviado exitosamente por WhatsApp',
            data: resultadoWSP
        });
    }
    catch (error) {
        console.error('Error al reenviar comprobante:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error interno al reenviar comprobante'
        });
    }
};
exports.reenviarComprobante = reenviarComprobante;
// Enviar archivo genérico por WhatsApp
const enviarArchivo = async (req, res) => {
    var _a;
    const { phone, filename } = req.body;
    if (!phone || !filename) {
        res.status(400).json({
            success: false,
            error: "El número de teléfono y nombre de archivo son obligatorios"
        });
        return;
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        res.status(400).json({
            success: false,
            error: "Formato de número inválido. Usa formato internacional sin '+' ni espacios (ej: 51987654321)"
        });
        return;
    }
    try {
        const resultado = await (0, exports.enviarArchivoWSP)(phone, filename, "📎 Archivo enviado desde tu servidor");
        res.status(200).json({
            success: true,
            message: 'Archivo enviado exitosamente por WhatsApp',
            data: resultado,
        });
    }
    catch (error) {
        console.error('Error al enviar archivo:', error);
        res.status(500).json({
            success: false,
            error: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message || 'Error al enviar archivo',
        });
    }
};
exports.enviarArchivo = enviarArchivo;
// Estado del servicio WhatsApp
const obtenerEstadoServicio = async (req, res) => {
    var _a;
    try {
        const url = `https://7105.api.greenapi.com/waInstance${ID_INSTANCE}/getStateInstance/${API_TOKEN_INSTANCE}`;
        const response = await axios_1.default.get(url);
        res.status(200).json({
            success: true,
            message: 'Estado del servicio WhatsApp obtenido',
            data: response.data
        });
    }
    catch (error) {
        console.error('Error al obtener estado del servicio:', error);
        res.status(500).json({
            success: false,
            error: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message || 'Error al consultar estado del servicio'
        });
    }
};
exports.obtenerEstadoServicio = obtenerEstadoServicio;
// ============== FUNCIONES LEGACY (compatibilidad) ==============
// Mantener compatibilidad con nombres anteriores
exports.sendWhatsAppMessage = exports.enviarMensaje;
exports.enviarComprobanteWSP = exports.enviarComprobante;
exports.reenviarComprobanteWSP = exports.reenviarComprobante;
exports.sendFileWhatsApp = exports.enviarArchivo;
