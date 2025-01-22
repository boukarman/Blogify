import { useEffect, useState } from 'react';
import PostItem from '../components/PostItem';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

function CategoryPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { category } = useParams();
	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/categories/${category}`);
				setPosts(response?.data);
			} catch (error) {
				console.log(error?.response?.data?.message);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	}, [category])
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

export default CategoryPosts
