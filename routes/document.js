const { Router } = require('express')
const { getDocumentsByUser } = require('../controllers/documents')

const router = Router()

// Obtiene documentos por usuario
router.get('/user/:userId/documents', getDocumentsByUser )

module.exports = router