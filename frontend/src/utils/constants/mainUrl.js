const mainUrl = window.location.origin.includes('localhost')
	? 'https://app.comunyt.co'
	: window.location.origin;

export default mainUrl;
