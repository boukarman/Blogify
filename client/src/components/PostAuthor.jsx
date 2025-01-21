import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import {capitalizeName} from '../utils/utils-functions'
import defaultAvatar from '/images/avatar1.jpg'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
import ReactTimeAgo from 'react-time-ago'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

function PostAuthor({id, createdAt}) {
	const [author, setAuthor] = useState({});
	useEffect(() => {
		async function fetchAuthor(){
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${id}`);
				setAuthor(response?.data);
			} catch (error) {
				console.log(error)
			}
		}
		fetchAuthor();
	},[id])
	const imagUrl = author?.avatar ? `${import.meta.env.VITE_ASSETS_URL}/${author?.avatar}` : defaultAvatar
	return (
		<Link to={`/posts/users/${id}`} className="post__author">
			<div className="post__author-avatar">
				<img src={imagUrl} alt="avatar" />
			</div>
			<div className="post__author-details">
				<h5>By: {capitalizeName(author?.name)} </h5>
				<small><ReactTimeAgo date={new Date(createdAt)} locale="en-US"/></small>
			</div>
		</Link>
	)
}

export default PostAuthor
