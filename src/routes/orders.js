import express from 'express';
import * as controller from '../controllers/ordersController.js';
import { apiKey } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', controller.listOrders);       // GET  /orders
router.post('/', controller.createOrder);     // POST /orders

// De fasta sökvägarna måste stå FÖRE '/:id'.
// Annars matchar '/:id' först och tror att 'stats' är ett id.
router.get('/stats', controller.orderStats);                    // GET /orders/stats
router.get('/export', controller.exportOrders);                 // GET /orders/export
router.get('/log', apiKey, controller.streamOrderLog);   // GET /orders/log

router.get('/:id', controller.getOrder);      // GET  /orders/3

export default router;
