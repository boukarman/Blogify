const Post = require('../models/postModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const HttpError = require('../models/errorModel');



/****************Create a post
 * post: api/posts
 * UNPROTECTED
 */
const createPost = async (req, res, next) => {
	try {
		let { title, category, description } = req.body;
		if (!title || !category || !description) {
			return next(new HttpError('Please fill all the fields.', 422));
		}

		if (!req?.files?.thumbnail) {
			return next(new HttpError('Please choose and image.', 422));
		}
		const { thumbnail } = req.files;
		if (thumbnail.size > 2000000) {
			return next(new HttpError('Thumbnail is too big. Should be less then 2mb.', 422));
		}
		let fileName = thumbnail.name;
		let splittedFileName = fileName.split('.');
		let newFileName = splittedFileName[0] + '-' + uuid() + '.' + splittedFileName[splittedFileName.length - 1];

		await thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (error) => {
			if (error) {
				return next(new HttpError(error));
			}
			const newPost = await Post.create({ title, category, description, thumbnail: newFileName, creator: req.user.id });
			if (!newPost) {
				return next(new HttpError('Failed to create post.', 422));
			}
			// find user and increase post count by 1
			const currentUser = await User.findById(req.user.id);
			const userPostCount = currentUser.posts + 1
			await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
			res.status(201).json({ newPost });
		})
	} catch (error) {
		return next(new HttpError(error.message));
	}
}

/****************Get a post
 * get: api/posts
 * UNPROTECTED
 */
const getPosts = async (req, res, next) => {
	try {
		const posts = await Post.find().sort({ createdAt: -1 });
		res.status(200).json(posts);

	} catch (error) {
		return next(new HttpError(error));
	}
}

/****************Get a post
 * get: api/posts/:id
 * UNPROTECTED
 */
const getPost = async (req, res, next) => {
	try {
		const { id } = req.params;
		const post = await Post.findById(id);
		if (!post) {
			return next(new HttpError('Post not found.', 404))
		}
		res.status(200).json(post);
	} catch (error) {
		// console.log(error)
		return next(new HttpError(error, error.status));
	}
}

/****************Get posts by category
 * get: api/posts/categories/:category
 * UNPROTECTED
 */
const getPostByCategory = async (req, res, next) => {
	try {
		const { category } = req.params;
		const catPosts = await Post.find({ category: category }).sort({ createdAt: -1 });
		if (!catPosts) {
			return next(new HttpError('Posts not found.', 404))
		}
		res.status(200).json(catPosts);
	} catch (error) {
		return next(new HttpError(error));
	}
}

/****************Get posts by author
 * get: api/posts/users/:id
 * UNPROTECTED
 */
const getUserPosts = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userPosts = await Post.find({ creator: id }).sort({ createdAt: -1 });
		if (!userPosts) {
			return next(new HttpError('Posts not found.', 404))
		}
		res.status(200).json(userPosts);
	} catch (error) {
		return next(new HttpError(error));
	}
}

/****************Edit Post
 * patch: api/posts/:id
 * PROTECTED
 */
const editPost = async (req, res, next) => {
	try {
		let fileName;
		let newFileName;
		let updatedPost;
		const postId = req.params.id;
		let { title, category, description } = req.body;
		if (!title || !category || !description) {
			return next(new HttpError('Please fill all the fields.', 422));
		}
		const oldPost = await Post.findById(postId);
		// console.log(oldPost.creator.toString(), req.user.id)
		if (oldPost.creator.toString() !== req.user.id) {
			return next(new HttpError('You are not allowed to edit this post.', 403));
		}
		if (!req?.files) {
			updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
		} else {
			// get old post

			fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (error) => {
				if (error) {
					return next(new HttpError(error));
				}
			})
			const { thumbnail } = req.files;
			if (thumbnail.size > 2000000) {
				return next(new HttpError('Thumbnail is too big. Should be less then 2mb.', 422));
			}
			fileName = thumbnail.name;
			const splittedFileName = fileName.split('.');
			newFileName = splittedFileName[0] + '-' + uuid() + '.' + splittedFileName[splittedFileName.length - 1];
			await thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (error) => {
				if (error) {
					return next(new HttpError(error));
				}
			})
			updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFileName }, { new: true });
			if (!updatedPost) {
				return next(new HttpError('Failed to update post.', 422));
			}
		}
		res.status(200).json(updatedPost);
	} catch (error) {
		return next(new HttpError(error));
	}
}

/****************delete Post
 * delete: api/posts/:id
 * PROTECTED
 */
const deletePost = async (req, res, next) => {
	try {
		const postId = req.params.id;
		// console.log(postId)

		const post = await Post.findById(postId);

		if (!post) {
			return next(new HttpError('Post not found.', 404));
		}
		if (post.creator.toString() !== req.user.id) {
			return next(new HttpError('You are not allowed to delete this post.', 403));
		}
		const fileName = post.thumbnail;
		fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (error) => {
			if (error) {
				return next(new HttpError(error));
			}
		})
		await Post.findByIdAndDelete(postId);
		// find user and reduce post count by 1
		const currentUser = await User.findById(post.creator);
		const userPostCount = currentUser.posts - 1;
		await User.findByIdAndUpdate(post.creator, { posts: userPostCount }, { new: true });
		res.status(200).json({ message: 'Post deleted successfully.' });
	} catch (error) {

	}
}


module.exports = {
	createPost,
	getPosts,
	getPost,
	getPostByCategory,
	getUserPosts,
	editPost,
	deletePost
}
