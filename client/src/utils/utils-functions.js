export const capitalizeName = (name) =>{
	if(!name) return "";
	const nameArray = name.split(" ");
	const capitalizeNameArray = nameArray.map((word) =>{
		return word.charAt(0).toUpperCase() + word.slice(1);
	})
	return capitalizeNameArray.join(" ");
}
