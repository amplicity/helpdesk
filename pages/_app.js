import '../styles/globals.css';
import Head from 'next/head';
import UserContext from '../contexts/UserContext';
import ToastContext from '../contexts/ToastContext';
import AuthService from '../modules/AuthService';
import React, { useState, useEffect, createContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import BreathingCircles from '../components/BreathingCircles';


function App({ Component, pageProps }) {
	const [user, setUser] = useState({});
	const [miniUser, setMiniUser] = useState({});
	const userContextProvider = { user, setUser, miniUser, setMiniUser };
	const router = useRouter();
	const [toast, setToast] = useState({ visible: false, message: '' });
	const toastContextProvider = { toast, setToast };

	const [pathName, setPathName] = useState(router.pathname);
	const animationDelay2 = {
		animationDelay: '2s'
	};

	useEffect(() => {
		async function identifyUser() {
			if (Object.keys(user).length === 0) {
				setUser({ loading: true })
				const responseData = await AuthService.identifyUser();
				if (responseData.user) {
					setUser(responseData.user);
					setMiniUser(responseData.miniUser);
				} else {
					console.log('No user identified', responseData);
					setUser({ user: null });
					router.push('/');
				}
				if (responseData.user) {
					console.log('responseData', responseData);
					if (router.pathname == '/') {
						router.push('/dashboard');
					}
				}
			}
		}
		identifyUser();
	});

	useEffect(() => {
		setPathName(router.pathname)
	}, [router.pathname])

	return (
		<>
			<Head>
				<title>My Helpdesk - Get Help Fast!</title>
			</Head>
			<UserContext.Provider value={userContextProvider}>
				<ToastContext.Provider value={toastContextProvider}>

					<div className="bg-white">

						{toast.visible &&
							<div id="toast-simple" className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800  absolute right-4 top-4" role="alert">
								<div className="pl-4 text-sm font-normal">{toast.message}</div>
							</div>
						}
						{(pathName == '/' || pathName == '/login') &&
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="absolute w-[40rem] h-[40rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob dark:bg-indigo-300"></div>
									<div
										className="absolute w-[40rem] h-[40rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob dark:bg-gray-300"
										style={animationDelay2}
									></div>
								</div>
								<Component {...pageProps} />
							</div>
						}
						{pathName == '/dashboard' &&
							<Component {...pageProps} />
						}

					</div>
				</ToastContext.Provider>
			</UserContext.Provider>
		</>
	)
}

export default App
