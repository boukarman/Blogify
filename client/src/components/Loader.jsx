import GifLoader from "/images/loader.svg"

const Loader = () => {
	return (
		<div className="loader">
			<div className="loader__image">
				<img src={GifLoader} alt="" />
			</div>
		</div>
	)
}

export default Loader
