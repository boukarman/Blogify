const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
	registerUser,
	loginUser,
	getUser,
	changeAvatar,
	editUser,
	getAuthors
} = require('../controllers/userControllers');
const router = Router();
// const { User } = require('../models/userModel');
// const bcrypt = require('bcrypt');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.post('/change-avatar', authMiddleware, changeAvatar);
router.patch('/edit-user', authMiddleware, editUser);
router.get('/', getAuthors);

module.exports = router
