import { Router } from 'express';
import {
  getFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deleteFranchise,
  bulkPublishFranchises,
  bulkArchiveFranchises,
  bulkDeleteFranchises
} from '../controllers/franchisesController.js';

const router = Router();

router.get('/', getFranchises);
router.get('/:id', getFranchiseById);
router.post('/', createFranchise);
router.put('/:id', updateFranchise);
router.delete('/:id', deleteFranchise);
router.post('/bulk-publish', bulkPublishFranchises);
router.post('/bulk-archive', bulkArchiveFranchises);
router.post('/bulk-delete', bulkDeleteFranchises);

export default router;
