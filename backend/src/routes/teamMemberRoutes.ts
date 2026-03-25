import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamMemberPhoto,
} from '../controllers/teamMemberController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET — публичный (для страницы /team на сайте)
router.get('/', getTeamMembers);
// Остальные — только для ADMIN
router.get('/:id',        authMiddleware, getTeamMemberById);
router.post('/',          authMiddleware, createTeamMember);
router.put('/:id',        authMiddleware, updateTeamMember);
router.delete('/:id',     authMiddleware, deleteTeamMember);
router.post('/:id/photo', authMiddleware, uploadTeamMemberPhoto);

export default router;
