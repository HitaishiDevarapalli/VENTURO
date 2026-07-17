import { Router } from 'express';
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty, 
  bulkPublish, 
  bulkHide, 
  bulkDelete 
} from '../controllers/propertiesController.js';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);
router.post('/bulk-publish', bulkPublish);
router.post('/bulk-hide', bulkHide);
router.post('/bulk-delete', bulkDelete);

export default router;
