import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";

function Dashboard() {
	const [posts, setPosts] = useState([]);
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/users/${id}`);
				setPosts(response?.data);
			} catch (error) {
				console.log(error?.response?.data?.message);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	},[id])
	if(loading){
		return <Loader />
	}
	return (
		<section className="dashboard">
			{
				posts.length ?
					<div className="container dashboard__container">
						{
							posts.map((post) => {
								return <article key={post._id} className="dashboard__post">
									<div className="dashboard__post-info">
										<div className="dashboard__post-thumbnail">
											<img src={`${import.meta.env.VITE_ASSETS_URL}/${post.thumbnail}`} alt="" />
										</div>
										<h5>{post.title}</h5>
									</div>
									<div className="dashboard__post-actions">
										<Link to={`/posts/${post._id}`} className="btn sm category">View</Link>
										<Link to={`/posts/${post._id}/edit`} className="btn sm primary">Update</Link>
										{/* <Link to={`/posts/${post._id}/delete`} className="btn sm danger">Delete</Link> */}
										<DeletePost postId={post._id} sm={"sm"} />
									</div>
								</article>
							})
						}
					</div>
					:
					<h2 className='center'>No posts founds</h2>
			}
		</section>
	)
}

export default Dashboard
