import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from '../context/userContext'

function Login() {
	const [userData, setUserData] = useState({
		email: "",
		password: "",
	})
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const { setCurrentUser } = useContext(UserContext);


	const changeInputHandler = (e) => {
		setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const loginUser = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
			const user = response.data;
			if (!user) {
				setError("User not found");
			}
			setCurrentUser(user);
			navigate("/");
		} catch (error) {
			setError(error?.response?.data?.message);
		}
	}
	return (
		<section className="login">
			<div className="container">
				<h2>Sign In</h2>
				<form className="form login__form" onSubmit={loginUser}>
					{error && <p className="form__error-message">{error}</p>}
					<input type="email" onChange={changeInputHandler} value={userData.email} name="email" id="email" placeholder="Email" />
					<input type="password" onChange={changeInputHandler} value={userData.password} name="password" id="password" placeholder="Password" />
					<button type="submit" className="btn primary">Login</button>
				</form>
				<small>You dont have and account? <Link to="/register">sign up</Link></small>
			</div>
		</section>
	)
}

export default Login
