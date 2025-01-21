import { Link } from "react-router-dom"
import defaultAvatar from '/images/avatar1.jpg'
import { capitalizeName } from "../utils/utils-functions";
function AuthorItem({ author }) {
	const { _id: id, name, avatar, posts } = author;
	const  imagUrl = avatar ? `${import.meta.env.VITE_ASSETS_URL}/${avatar}` : defaultAvatar
	return (
		<Link to={`/posts/users/${id}`} className="author">
			<div className="author__avatar">
				<img src={imagUrl} alt={`Image of ${name}`} />
			</div>
			<div className="author__info">
				<h4>{capitalizeName(name)}</h4>
				<p>{posts} posts</p>
			</div>
		</Link>
	)
}

export default AuthorItem
