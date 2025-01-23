import { useEffect, useState } from 'react'
import AuthorItem from '../components/AuthorItem'
import axios from 'axios'
import Loader from '../components/Loader'

function Authors() {
	const [authors, setAuthors] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const fetchAuthors = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`);
				setAuthors(response?.data);
			} catch (error) {
				console.log(error?.response?.data?.message);
			} finally {
				setLoading(false);
			}
		}
		fetchAuthors();
	}, [])

	if (loading) {
		return <Loader />
	}
	
		return (
			<section className="authors">
				{authors.length > 0 ? <div className="container authors__container">
					{
						authors.map((author) => <AuthorItem key={author._id} author={author} />)
					}
				</div> : <h2 className='center'>No authors founds</h2>}
			</section>
		)
}

export default Authors
