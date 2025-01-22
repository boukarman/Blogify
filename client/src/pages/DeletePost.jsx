import { Link, useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "../context/userContext";
import { useContext, useState } from "react"
import axios from "axios"
import Loader from "../components/Loader";
function DeletePost({postId: id, sm}) {
	const location = useLocation();
	const { currentUser } = useContext(UserContext)
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false);
	const removePost = async (id) => {
		setLoading(true)
		try {
			const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${currentUser?.token}`
				}
			})
			//myposts/:id  dashboard
			//posts/:id post details
			if (response?.status === 200) {
				if (location.pathname === `/posts/${id}` ){
					navigate('/');
				}else if(location.pathname === `/myposts/${currentUser?.id}`){
					navigate(0);
				}
			}
		} catch (error) {
			console.log(error)
		}finally{
			setLoading(false)
		}
	}
	if(loading){
		return <Loader />
	}
	return (
		<Link className={sm ? `btn danger ${sm}` : "btn danger"} onClick={() => removePost(id)}>Delete</Link>
	)
}

export default DeletePost
