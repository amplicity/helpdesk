import '../styles/globals.css';
import Head from 'next/head';
import UserContext from '../contexts/UserContext';
import ToastContext from '../contexts/ToastContext';
import AuthService from '../modules/AuthService';
import React, { useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/router';


function App({ Component, pageProps }) {
	const [user, setUser] = useState({});
	const [helpUser, setHelpUser] = useState({});
	const userContextProvider = { user, setUser, helpUser, setHelpUser };
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
					setHelpUser(responseData.helpUser);
				} else {
					console.log('No user identified', responseData);
					setUser({ user: null });
					router.push('/');
				}
				if (responseData.user) {
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
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<UserContext.Provider value={userContextProvider}>
				<ToastContext.Provider value={toastContextProvider}>

					<div className="bg-white">

						{toast.visible &&
							<div id="toast-simple" className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow    absolute right-4 top-4" role="alert">
								<div className="pl-4 text-sm font-normal">{toast.message}</div>
							</div>
						}
						{(pathName == '/' || pathName == '/login') &&
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="absolute w-[40rem] h-[40rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob "></div>
									<div
										className="absolute w-[40rem] h-[40rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob "
										style={animationDelay2}
									></div>
								</div>
								<Component {...pageProps} />
							</div>
						}
						{pathName != '/' && pathName != '/login' &&
							<Component {...pageProps} />
						}
						

					</div>
				</ToastContext.Provider>
			</UserContext.Provider>
		</>
	)
}

export default App
