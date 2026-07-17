import { Router } from 'express';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  deleteBusiness
} from '../controllers/businessesController.js';

const router = Router();

router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.post('/', createBusiness);
router.delete('/:id', deleteBusiness);

export default router;
