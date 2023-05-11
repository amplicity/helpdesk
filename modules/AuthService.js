
const AuthService = {
	identifyUser: async function() {
		const response = await fetch('/api/user', {
		});

		const responseData = await response.json();
		return responseData;
	},
	userIsNull: async function(user) {
		if(Object.keys(user).length === 0) {
			return true;
		} else{
			return false;
		}
	}
};

export default AuthService;