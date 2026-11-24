
const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, adminMiddleware, transactionController.getAll);
router.get('/:id', authMiddleware, transactionController.getById);
router.post('/pay', authMiddleware, transactionController.pay);

module.exports = router;
