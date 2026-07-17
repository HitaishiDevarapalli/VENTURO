import { Router } from 'express';
import {
  getDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer
} from '../controllers/dealersController.js';

const router = Router();

router.get('/', getDealers);
router.get('/:id', getDealerById);
router.post('/', createDealer);
router.put('/:id', updateDealer);
router.delete('/:id', deleteDealer);

export default router;
