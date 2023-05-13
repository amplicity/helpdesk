import { Magic } from 'magic-sdk';
import { useRouter } from 'next/router';

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
	},
	logout: async function(router) {
		const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY);
		await magic.user.logout();
		router.push('/');
	}
};

export default AuthService;