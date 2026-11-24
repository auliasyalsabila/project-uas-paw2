
const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addItem);
router.put('/:productId', cartController.updateItem);
router.delete('/:productId', cartController.removeItem);

module.exports = router;
