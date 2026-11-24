
const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', stockController.getAll);
router.get('/:productId', stockController.getByProduct);
router.post('/', authMiddleware, adminMiddleware, stockController.create);
router.put('/:productId', authMiddleware, adminMiddleware, stockController.update);

module.exports = router;
