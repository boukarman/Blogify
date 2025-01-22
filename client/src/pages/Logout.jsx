import {Navigate, useNavigate} from 'react-router-dom'
import {Fragment, useContext} from 'react'
import {UserContext} from '../context/userContext'
function Logout() {
	const {setCurrentUser} = useContext(UserContext);
	setCurrentUser(null);
	
  return (
	<Navigate to="/login" replace/>
  )
}

export default Logout
