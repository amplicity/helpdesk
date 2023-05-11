import React, { useState, useEffect, useContext } from 'react';
import { Magic } from 'magic-sdk';
import 'react-phone-number-input/style.css'
import UserContext from '../contexts/UserContext';
import { useRouter } from 'next/router';

function Login(props){
	const router = useRouter();
	const [email, setEmail] = useState('');
	const userContext = useContext(UserContext);
	const [formSubmitted, setFormSubmitted] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setFormSubmitted(true);
		console.log('process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY', process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY)

		let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY);
		await magic.auth.loginWithEmailOTP({
			email: email
		});
		let didToken = await magic.user.getIdToken();
		// Validate didToken with server
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + didToken,
			},
			body: JSON.stringify({
				
			})
		});
		if (response.ok) {
			let data = await response.json();
			userContext.setUser(data.user);
			userContext.setMiniUser(data.miniUser)
			console.log('data', data);
			router.push('/dashboard');
		}
	}
	const submitDisabled = () => {
		if(!email || email.length < 10){
			return true;
		}
		else{
			return false;
		}
	}

	const handleEmailOnChange = (e) => {
		setEmail(e.target.value);
	}


	return (
		<div className="mx-auto max-w-md px-4 pt-8 sm:max-w-2xl sm:px-6 text-center relative">
			<div className="text-left text-xl">Enter your email:</div>
			
			<form onSubmit={handleLogin} className="mt-4 ml-2 mr-2">
				<input onChange={handleEmailOnChange} type="email" name="email" required="required" placeholder="my@email.com" className="rounded-xl w-full p-4" />
				<div className={`text-center relative mt-8`}>
					<button type="submit" disabled={submitDisabled()} className={` z-90 bg-slate-500 text-white font-bold py-2 px-4 rounded hover:cursor-pointer`}>
						{!formSubmitted && 
							<span className="">Login</span>
						}
						{formSubmitted && 
							<span className="">Logging in, please wait..</span>
						}
					</button>
				</div>
			</form>
		</div>
	)
}

export default Login;