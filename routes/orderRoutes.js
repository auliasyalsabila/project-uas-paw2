
const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware);

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/checkout', orderController.checkout);
router.put('/:id/status', adminMiddleware, orderController.updateStatus);

module.exports = router;
