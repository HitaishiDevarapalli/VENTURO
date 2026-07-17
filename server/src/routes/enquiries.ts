import { Router } from 'express';
import {
  getEnquiries,
  createPropertyEnquiry,
  createFranchiseEnquiry,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/enquiriesController.js';

const router = Router();

router.get('/', getEnquiries);
router.post('/property', createPropertyEnquiry);
router.post('/franchise', createFranchiseEnquiry);
router.put('/:id', updateEnquiryStatus);
router.delete('/:id', deleteEnquiry);

export default router;
