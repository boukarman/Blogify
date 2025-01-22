import { Link, useParams } from "react-router-dom"
import Avatar from "/images/avatar1.jpg"
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { capitalizeName } from "../utils/utils-functions";

const initialState = {
	password: '',
	newPassword: '',
	newPassword2: '',
}

function UserProfile() {
	const { currentUser } = useContext(UserContext);
	const [avatar, setAvatar] = useState('')
	const [userName, setUserName] = useState(currentUser?.name);
	const [loading, setLoading] = useState(false);
	const [avatarUpdate, setAvatarUpdate] = useState(false);
	const { id } = useParams();
	const [userData, setUserData] = useState({
		name: '',
		email: '',
		password: '',
		newPassword: '',
		newPassword2: '',
	})
	const [error, setError] = useState('');
	const changeInputHandler = ((e) => {
		setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	})

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${id}`);
				setUserData(prev => ({ ...prev, name: response?.data?.name, email: response?.data?.email }));
				if (response?.data?.avatar) {
					setAvatar(response?.data?.avatar);
				}
			} catch (error) {
				console.log(error?.response?.data?.message);
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, [id])

	const changeAvatar = async () => {
		const formData = new FormData();
		formData.set('avatar', avatar);
		setLoading(true);
		setError('');
		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/change-avatar`, formData, {
				withCredentials: true,
				headers: {
					"Content-Type": "multipart/form-data",
					'Authorization': `Bearer ${currentUser?.token}`
				}
			});
			if (response?.status === 200) {
				setAvatar(response?.data?.avatar);

			}
		} catch (error) {
			console.log(error?.response?.data?.message);
			setError(error?.response?.data?.message);
		} finally {
			setLoading(false);
			setAvatarUpdate(false);
		}
	}

	const updateProfile = async () => {
		setLoading(true);
		setError('');
		console.log(currentUser)
		try {
			const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/edit-user`, userData, {
				withCredentials: true,
				headers: {
					'Authorization': `Bearer ${currentUser?.token}`
				}
			});
			if (response?.status === 200) {
				console.log(response?.data);
				setUserData({ ...initialState, name: response?.data?.name, email: response?.data?.email });
				setUserName(response?.data?.name);
			}
		} catch (error) {
			console.log(error?.response?.data?.message);
			setUserData({ ...initialState, name: currentUser?.name, email: currentUser?.email });
			setError(error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	}
	if (loading) {
		return <Loader />
	}


	return (
		<section className="profile">
			<div className="container profile__container">
				<Link to={`/myposts/${currentUser.id}`} className="btn">My posts</Link>
				<div className="profile__details">
					<div className="avatar__wrapper">
						<div className="profile__avatar">
							<img src={avatar ? `${import.meta.env.VITE_ASSETS_URL}/${avatar}` : Avatar} alt="" />
						</div>
						{/* Form to update avatar */}
						<form className="avatar__form">
							<input type="file" name="avatar" id="avatar" onChange={(e) => {
								console.log(e.target.files[0])
								setAvatar(e.target.files[0])
							}} accept="png, jpg, jpeg" />
							<label htmlFor="avatar" onClick={() => setAvatarUpdate(prev => !prev)}><FaEdit /></label>
							{avatarUpdate && <button type='submit' className="profile__avatar-btn" onClick={changeAvatar}>
								<FaCheck />
							</button>}
						</form>
					</div>
					<h1>{capitalizeName(userName)}</h1>
				</div>
				<form className="form profile__form">
					{error && <p className="form__error-message">{error}</p>}
					<input type="text" onChange={changeInputHandler} value={userData.name} name="name" id="name" placeholder="Full Name" />
					<input type="email" onChange={changeInputHandler} value={userData.email} name="email" id="email" placeholder="Email" />
					<input type="password" onChange={changeInputHandler} value={userData.currentPassword} name="currentPassword" id="currentPassword" placeholder="Current Password" />
					<input type="password" onChange={changeInputHandler} value={userData.newPassword} name="newPassword" id="newPassword" placeholder="New Password" />
					<input type="password" onChange={changeInputHandler} value={userData.newPassword2} name="newPassword2" id="newPassword2" placeholder="Confirm New Password" />
					<button type="submit" className="btn primary" onClick={updateProfile}>

						{loading ? <span className="loader__wrapper"><svg className="loader__wrapper-img" fill="#000000" width="800px" height="800px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M41.9 23.9c-.3-6.1-4-11.8-9.5-14.4-6-2.7-13.3-1.6-18.3 2.6-4.8 4-7 10.5-5.6 16.6 1.3 6 6 10.9 11.9 12.5 7.1 2 13.6-1.4 17.6-7.2-3.6 4.8-9.1 8-15.2 6.9-6.1-1.1-11.1-5.7-12.5-11.7-1.5-6.4 1.5-13.1 7.2-16.4 5.9-3.4 14.2-2.1 18.1 3.7 1 1.4 1.7 3.1 2 4.8.3 1.4.2 2.9.4 4.3.2 1.3 1.3 3 2.8 2.1 1.3-.8 1.2-2.5 1.1-3.8 0-.4.1.7 0 0z" /></svg></span>
							: "Update Profile"}
					</button>


				</form>
			</div>
		</section>
	)
}

export default UserProfile
