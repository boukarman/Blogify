import { useEffect, useState } from 'react'
import PostItem from './PostItem'
import axios from 'axios'
import Loader from './Loader';

function Posts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() =>{
		async function fetchPosts() {
			setLoading(true);
			try {
				// console.log("before fetch")
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
				// console.log("after fetch")
				setPosts(response?.data); 
			} catch (error) {
				console.log(error);
			}finally{
				setLoading(false);
			}
		}
		fetchPosts();
	}, [])

	if(loading){
		return <Loader />
	}
	
	return (
		<section >
			{posts.length > 0 ? <div className="container posts__container">
				{
					posts.map((post) => <PostItem key={post._id} post={post} />)
				}
			</div> : <h2 className='center'>No posts founds</h2>}
		</section>
	)
}

export default Posts
