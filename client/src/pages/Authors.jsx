import { useEffect, useState } from 'react'
import Avatar1 from '/images/avatar1.jpg'
import Avatar2 from '/images/avatar2.jpg'
import Avatar3 from '/images/avatar3.jpg'
import Avatar4 from '/images/avatar4.jpg'
import Avatar5 from '/images/avatar5.jpg'
import AuthorItem from '../components/AuthorItem'
import axios from 'axios'
import Loader from '../components/Loader'

const authorsData = [
	{ id: 1, avatar: Avatar1, name: 'Naoufel Boukarma', posts: 3 },
	{ id: 2, avatar: Avatar2, name: 'Naoufel Boukarma', posts: 5 },
	{ id: 3, avatar: Avatar3, name: 'Naoufel Boukarma', posts: 2 },
	{ id: 4, avatar: Avatar4, name: 'Naoufel Boukarma', posts: 1 },
	{ id: 5, avatar: Avatar5, name: 'Naoufel Boukarma', posts: 0 },
]

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
