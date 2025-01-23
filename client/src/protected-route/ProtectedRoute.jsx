import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children})=>{
	const {currentUser} = useContext(UserContext);
	const token = currentUser?.token;
	if(!token){
		return (
			<main style={{minHeight: '100vh'}}>
				<Navigate to="/login" replace/>
			</main>
		)
	}

	return children;
}

export default ProtectedRoute;