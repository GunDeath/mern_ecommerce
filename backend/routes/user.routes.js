import express from "express";
const router = express.Router()
import {protect, admin} from "../middleware/auth.middleware.js";
import {
    deleteUser,
    getUserById,
    getUserProfile,
    getUsers,
    registerUser, updateUser,
    updateUserProfile
} from "../controllers/user.controller.js";
import {authUser} from "../controllers/user.controller.js";

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)

export default router