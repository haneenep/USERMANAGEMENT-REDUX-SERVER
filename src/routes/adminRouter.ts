import express from 'express';
import AdminController from '../controller/adminController';


const router = express.Router();

router.get('/fetch-user',AdminController.fetchingUsers);

// adding user
router.post('/add-user',AdminController.addingUser);

// editing user
router.post('/edit-user',AdminController.editingUser);

// deleting user
router.delete('/delete-user',AdminController.deletingUser);

export default router;