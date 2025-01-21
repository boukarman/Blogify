import { Link } from "react-router-dom";
import Logo from "/images/logoipsum-311.svg";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import {capitalizeName} from '../utils/utils-functions'

function Header() {
	const [isNavShowing, setIsNavShowing] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const {currentUser} = useContext(UserContext);
	useEffect(() => {
		function handleResize(){
			setWindowWidth(window.innerWidth);
			if (window.innerWidth > 800){
				setIsNavShowing(false);
			}
		}
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	},[]);

	// Close navbar handler
	const closeNavHandler = () => {
			setIsNavShowing(prev => !prev);
	};

	


	return (
		<nav>
			<div className="container nav__container">
				<Link to="/" className="nav__logo" onClick={closeNavHandler}>
					<p style={{fontSize: '1.3rem', fontWeight :700}}>Blogify</p>
				</Link>
				{currentUser && (isNavShowing || windowWidth > 800 ) && (
					<ul className="nav__menu">
						<li>
							<Link to={`/profile/${currentUser.id}`} onClick={()=>setIsNavShowing(false)}>
								{capitalizeName(currentUser.name)}
							</Link>
						</li>
						<li>
							<Link to="/create" onClick={()=>setIsNavShowing(false)}>
								Create Post
							</Link>
						</li>
						<li>
							<Link to="/authors" onClick={()=>setIsNavShowing(false)}>
								Authors
							</Link>
						</li>
						<li>
							<Link to="/logout" onClick={()=>setIsNavShowing(false)}>
								Logout
							</Link>
						</li>
					</ul>
				)}
				{!currentUser && (isNavShowing || windowWidth > 800 ) && (
					<ul className="nav__menu">
						
						<li>
							<Link to="/authors" onClick={()=>setIsNavShowing(false)}>
								Authors
							</Link>
						</li>
						<li>
							<Link to="/login" onClick={()=>setIsNavShowing(false)}>
								Login
							</Link>
						</li>
					</ul>
				)}
				<button
					className="nav__toggle-btn"
					onClick={() => setIsNavShowing((prev) => !prev)}
				>
					{isNavShowing ? <AiOutlineClose /> : <FaBars />}
				</button>
			</div>
		</nav>
	);
}

export default Header;
