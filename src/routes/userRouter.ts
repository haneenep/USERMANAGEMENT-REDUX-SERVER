import express from 'express'
import userController from '../controller/userController'

const router = express.Router()

// userSigning up
router.post('/postsignup',userController.signUp);
router.get('/fetchuser',userController.fetchingUserData);

// Loggin
router.post('/login',userController.login);

// editing profile
router.post('/edit-profile',userController.editingProfile);

// resseting password
router.post('/reset-password',userController.resettingPassword);

// deleting image
router.delete('/delete-image',userController.deletingImage);

// logging out
router.get('/logout',userController.logout);

export default router;
