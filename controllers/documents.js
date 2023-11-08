const User = require('../models/user'); // Asegúrate de tener la ruta correcta a tu modelo de Usuario
const Document = require('../models/document'); // Asegúrate de tener la ruta correcta a tu modelo de Documento

// Ruta para obtener la lista de documentos de un usuario
const getDocumentsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Obtiene el ID del usuario de los parámetros

        // Busca el usuario por su ID
        const usuario = await User.findById(userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtiene la lista de documentos pertenecientes al usuario
        const documentos = await Document.find({ _id: { $in: usuario.documents } });

        return res.status(200).json({ documents: documentos });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener la lista de documentos del usuario', error: error });
    }
};

module.exports = {
    getDocumentsByUser
};