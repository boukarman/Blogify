import { Link } from "react-router-dom"
import PostAuthor from "./PostAuthor"
import Loader from "./Loader";

function PostItem({ post }) {
	const { _id: id, thumbnail, category, title, description: desc, creator: authorID, createdAt } = post
	const shortTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title;
	const shortDesc = desc.length > 150 ? `${desc.slice(0, 150)}...` : desc;
	
	return (
		<article className="post">
			<div className="post__thumbnail">
				<img src={`${import.meta.env.VITE_ASSETS_URL}/${thumbnail}`} alt={title} />
			</div>
			<div className="post__content">
				<Link to={`/posts/${id}`}>
					<h3 >{shortTitle}</h3>
				</Link>
				<p dangerouslySetInnerHTML={{__html: shortDesc}}></p>
				<div className="post__footer">
					<PostAuthor id={authorID} createdAt={createdAt} />
					<Link to={`/posts/categories/${category}`} className="btn category">
						{category}
					</Link>
				</div>

			</div>
		</article>
	)
	
}

export default PostItem
