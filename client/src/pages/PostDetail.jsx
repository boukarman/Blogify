import { Link, useParams } from "react-router-dom"
import PostAuthor from "../components/PostAuthor"
import Thumbnail1 from '/images/blog1.jpg'
import { useEffect, useState, useContext } from "react"
import axios from "axios"
import Loader from "../components/Loader"
import { UserContext } from "../context/userContext"
import DeletePost from "./DeletePost"

function PostDetail() {
	const { id } = useParams()
	const [post, setPost] = useState({})
	const [postCreator, setPostCreator] = useState("")
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("")
	const { currentUser } = useContext(UserContext)
	
	useEffect(() => {
		const fetchSinglePost = async () => {
			setLoading(true)
			setError("")
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${id}`);

				// console.log(response?.data);
				setPost(response?.data);
				setPostCreator(response?.data?.creator)
			} catch (error) {
				setError(error?.response?.data?.message)
			} finally {
				setLoading(false);
			}
		}
		fetchSinglePost();
	}, [])
	if (loading) {
		return <Loader />
	}
	return (
		<section className="post__detail">
			{error && <p className="error">{error}</p>}

			{post && <div className="container post-detail__container">
				<div className="post-detail__header">
					{postCreator && <PostAuthor id={post.creator} createdAt={post.createdAt} />}
					{(currentUser?.id === post.creator) && <div className="post-detail__buttons">
						<Link to={`/posts/${post._id}/edit`} className="btn primary">Edit</Link>
						<DeletePost postId={id} />
					</div>}
				</div>
				<h1>{post.title}</h1>
				<div className="post-detail__thumbnail">
					<img src={`${import.meta.env.VITE_ASSETS_URL}/${post.thumbnail}`} alt="" />
				</div>
				<p dangerouslySetInnerHTML={{ __html: post.description }}></p>
			</div>}
		</section>
	)
}

export default PostDetail
