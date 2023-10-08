const randomRgbColor = () => {
	let r = Math.floor(Math.random() * 100);
	let g = Math.floor(Math.random() * 100);
	let b = Math.floor(Math.random() * 100);
	return 'rgb(' + r + ',' + g + ',' + b + ')';
};

export default randomRgbColor;
