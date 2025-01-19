const { Router } = require('express');
const router = Router();
const {
	getPosts,
	getPost,
	createPost,
	editPost,
	deletePost,
	getPostByCategory,
	getUserPosts
} = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', authMiddleware, createPost);
router.get('/:id', getPost);
router.patch('/:id', authMiddleware, editPost);
router.delete('/:id', authMiddleware, deletePost);
router.get('/users/:id', getUserPosts);
router.get('/categories/:category', getPostByCategory);


module.exports = router
