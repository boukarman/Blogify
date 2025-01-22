import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import GifLoader from "/images/loader.svg"
function CreatePost() {
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('Uncategorized');
	const [description, setDescription] = useState('');
	const [thumbnail, setThumbnail] = useState('');
	const { currentUser } = useContext(UserContext);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	// const navigate = useNavigate();
	// const token = currentUser?.token;

	// useEffect(()=>{
	// 	if(!token){
	// 		navigate("/login");
	// 	}
	// }, [])
	const POST_CATEGORIES = ['Uncategorized', 'Buisness', 'Investment', 'Weather', 'Education', 'Art', 'Entertainment', 'Agriculture'];
	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image'];
	const modules = {
		toolbar: [
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }],
			['link', 'image'],
			['clean']
		]
	}

	const createPost = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.set('title', title);
		formData.set('category', category);
		formData.set('description', description);
		formData.set('thumbnail', thumbnail);
		setError('');
		setLoading(true)
		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, formData, {
				headers: {
					'Authorization': `Bearer ${currentUser?.token}`
				}
			});
			if (response?.status === 201) {
				setTitle('');
				setCategory('Uncategorized');
				setDescription('');
				setThumbnail('');
				navigate('/');
			}
		} catch (error) {
			setError(error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	}
	return (
		<section className='create-post'>
			<div className="container">
				<h2>Create Post</h2>
				{error && <p className="form__error-message">
					{error}
				</p>}
				<form className="form create-post__form" onSubmit={createPost}>
					<input type="text" name="title" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
					<select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
						{POST_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
					</select>
					<ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} formats={formats} />
					<input className="create-post__thumbnail" type="file" name="thumbnail" id="thumbnail"
						onChange={(e) => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
					<button type="submit" className="btn primary" disabled={loading}>{
						loading ? <span className="loader__wrapper"><svg className="loader__wrapper-img" fill="#000000" width="800px" height="800px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M41.9 23.9c-.3-6.1-4-11.8-9.5-14.4-6-2.7-13.3-1.6-18.3 2.6-4.8 4-7 10.5-5.6 16.6 1.3 6 6 10.9 11.9 12.5 7.1 2 13.6-1.4 17.6-7.2-3.6 4.8-9.1 8-15.2 6.9-6.1-1.1-11.1-5.7-12.5-11.7-1.5-6.4 1.5-13.1 7.2-16.4 5.9-3.4 14.2-2.1 18.1 3.7 1 1.4 1.7 3.1 2 4.8.3 1.4.2 2.9.4 4.3.2 1.3 1.3 3 2.8 2.1 1.3-.8 1.2-2.5 1.1-3.8 0-.4.1.7 0 0z" /></svg></span>
						: "Create Post"
					}</button>
				</form>
			</div>
		</section>
	)
}

export default CreatePost
