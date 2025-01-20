const HttpError = require('../models/errorModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

/*************Register a new User */
// POST : api/users/register
// UNPROTECTED
const registerUser = async (req, res, next) => {
	try {
		const { name, email, password, password2 } = req.body;
		if (!name || !email || !password || !password2) {
			return next(new HttpError('Fill in all fields.', 422))
		}
		const newEmail = email.toLowerCase();

		const emailExists = await User.findOne({ email: newEmail })

		if (emailExists) {
			return next(new HttpError('Email already exists.', 422))
		}

		if ((password.trim().length < 6)) {
			return next(new HttpError('Password must be at least 6 characters.', 422));
		}

		if (password !== password2) {
			return next(new HttpError('Passwords do not match.', 422));
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const avatar = "avatar13.jpg";
		const newUser = await User.create({ name, email: newEmail, password: hashedPassword, avatar});

		res.status(201).json({ message: `New user ${newUser.email} registered successfully.` });
	} catch (error) {
		next(new HttpError('User registration failed.', 422))
	}
}










/*************Login a registered user*/
// POST : api/users/login
// UNPROTECTED

const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(new HttpError('Fill in all fields.', 422));
		}

		const newEmail = email.toLowerCase();

		const user = await User.findOne({ email: newEmail });

		if (!user) {
			return next(new HttpError('Invalid credentials.', 422));
		}


		const comparePass = await bcrypt.compare(password, user.password);

		if (!comparePass) {
			return next(new HttpError('Invalid credentials.', 422));
		}

		const { _id: id, name } = user;

		const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' });

		res.status(200).json({ token, id, name, email });

	} catch (error) {
		return next(new HttpError('Login failed. Please check your credentials.', 422));
	}
}








/*************User profile */
// GET : api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select('-password');
		if (!user) {
			return next(new HttpError('User not found.', 404))
		}
		res.status(200).json(user);

	} catch (error) {
		return next(new HttpError(`Failed to find user with id ${req.params.id}`, 422));
	}
}







/*************Change user avatar */
// POST : api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res, next) => {
	try {
		console.log(req.files)
		if (!req?.files?.avatar) {
			return next(new HttpError('Please choose and image.', 422));
		}
		//find user from database
		const user = await User.findById(req.user.id);
		// delete hole avatar if exists
		if (user?.avatar) {
			fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
				if (err) {
					return next(new HttpError(err));
				}
			})
		}

		const { avatar } = req.files;
		// check file size
		if (avatar.size > 500000) {
			return next(new HttpError('Profile picture is too big. Should be less then 500kb.', 422));
		}

		let fileName = avatar.name;
		let splittedFileName = fileName.split('.');
		let newFileName = splittedFileName[0] + '-' + uuid() + '.' + splittedFileName[splittedFileName.length - 1];

		await avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (error) => {
			if (error) {
				return next(new HttpError(error));
			}
			const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFileName }, { new: true });
			if (!updatedAvatar) {
				return next(new HttpError('Avatar could not be updated.', 422));
			}
			res.status(200).json(updatedAvatar);
		});


	} catch (error) {
		return next(new HttpError(error));
	}
}








/*************Edi user details */
// POST : api/users/edit-user
// PROTECTED
const editUser = async (req, res, next) => {
	try {
		const { name, email, currentPassword, newPassword, newPassword2 } = req.body;
		if (!name || !email || !currentPassword || !newPassword || !newPassword2) {
			return next(new HttpError('Fill in all fields.', 422));
		}

		// get user from database
		const user = await User.findById(req.user.id);
		if (!user) {
			return next(new HttpError('User not found.', 404));
		}

		// make sure new email doesnt already exist
		const emailExist = await User.findOne({ email });
		// we want to update other details with/without changing the email (which is a unique id because we use it to login)
		if (emailExist && (emailExist._id != req.user.id)) {
			return next(new HttpError('Email already exists.', 422));
		}

		// compare current password to db password
		const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
		if (!validateUserPassword) {
			return next(new HttpError('Invalid current password.', 422));
		}

		// compare new password with new password2
		if (newPassword !== newPassword2) {
			return next(new HttpError('Passwords do not match.', 422));
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// update user infor in database

		const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hashedPassword }, { new: true });

		res.status(200).json(newInfo);
	} catch (error) {
		console.log(error);
		return next(new HttpError(error));
	}
}







/*************Edi Authors */
// GET : api/users/getAuthors
// UNPROTECTED
const getAuthors = async (req, res, next) => {
	try {
		const authors = await User.find().select('-password');
		if (!authors) {
			return next(new HttpError('No authors found.', 404));
		}
		res.status(200).json(authors);
	} catch (error) {
		return next(new HttpError(error));
	}
}

module.exports = {
	registerUser,
	loginUser,
	getUser,
	changeAvatar,
	editUser,
	getAuthors
}
