import { useEffect, useState } from 'react';
import PostItem from '../components/PostItem';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';
function AuthorPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();

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
	}, [])

	if (loading) {
		return <Loader />
	}
	return (
		<section>
			{posts.length > 0 ? <div className="container posts__container">
				{
					posts.map((post) => <PostItem key={post._id} post={post} />)
				}
			</div> : <h2 className='center'>No posts founds</h2>}
		</section>
	)
}

export default AuthorPosts
