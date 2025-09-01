import { Router } from 'express';
import { getAllRoles } from '../controllers/role.controller.js';

const router = Router();

router.get('/roles', getAllRoles);

export default router;