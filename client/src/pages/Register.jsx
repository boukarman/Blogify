import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
function Register() {
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		password: "",
		password2: "",
	})
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const changeInputHandler = (e) => {
		setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const registerUser = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData)
			
			const newUser = response.data;
			
			if (!newUser){
				setError("Couldn't register user. Please try again.")
			}
			navigate("/login")
		} catch (error) {
			setError(error?.response?.data?.message);
		}
	}
	return (
		<section className="register">
			<div className="container">
				<h2>Sign Up</h2>
				<form action="" className="form register__form" onSubmit={registerUser}>
					{error && <p className="form__error-message">{error}</p>}
					<input type="text" onChange={changeInputHandler} value={userData.name} name="name" id="name" placeholder="Full Name" />
					<input type="email" onChange={changeInputHandler} value={userData.email} name="email" id="email" placeholder="Email" />
					<input type="password" onChange={changeInputHandler} value={userData.password} name="password" id="password" placeholder="Password" />
					<input type="password" onChange={changeInputHandler} value={userData.password2} name="password2" id="password2" placeholder="Confirm Password" />
					<button type="submit" className="btn primary">Register</button>
				</form>
				<small>Already have an account? <Link to="/login">sign in</Link></small>
			</div>
		</section>
	)
}

export default Register
