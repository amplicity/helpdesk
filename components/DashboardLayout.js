import { Fragment, useEffect, useState, useContext } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
	MenuAlt2Icon,
	XIcon,
	PlusIcon,
	TicketIcon,
	CogIcon,
	UserCircleIcon
} from '@heroicons/react/outline'
import UserContext from '../contexts/UserContext';
import { useRouter } from 'next/router';
import AuthService from '../modules/AuthService';

export default function DashboardLayout({ children }) {
	const router = useRouter();
	const userContext = useContext(UserContext);

	useEffect(() => {
		if (router.pathname === '/dashboard') {
			if ((userContext.helpUser.name == '' || userContext.helpUser.name == null) && userContext.helpUser.id) {
				setCurrent(3);
				router.push('/dashboard/settings');
			} else {
				setCurrent(0);
			}
		} else if (router.pathname === '/dashboard/create') {
			setCurrent(1);
		} else if (router.pathname === '/dashboard/settings') {
			setCurrent(3);
		}
	}, [router, router.pathname, userContext.helpUser]);

	const [current, setCurrent] = useState(0);
	const navigation = [
		{ name: 'My Tickets', onClick: () => router.push('/dashboard'), icon: TicketIcon, current: current === 0 },
		{ name: 'Create Ticket', onClick: () => router.push('/dashboard/create'), icon: PlusIcon, current: current === 1 },
		{ name: 'Settings', onClick: () => router.push('/dashboard/settings'), icon: CogIcon, current: current === 3 },
	]

	function classNames(...classes) {
		return classes.filter(Boolean).join(' ')
	}

	const userNavigation = [
		{ name: `${userContext.user.email}` },
		{ name: 'Sign out', onClick: () => { AuthService.logout(router) } },
	]
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [helpUser, setHelpUser] = useState({
		tickets: [],
	});

	useEffect(() => {
		if (userContext.helpUser.tickets) {
			setHelpUser(userContext.helpUser);
		}
	}, [userContext, userContext.helpUser]);


	return (
		<>
			<div className="grid grid-cols-dashboard-layout h-screen">
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute top-0 right-0 -mr-12 pt-2">
										<button
											type="button"
											className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
											onClick={() => setSidebarOpen(false)}
										>
											<span className="sr-only">Close sidebar</span>
											<XIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								<div className="flex-shrink-0 left-0 flex items-center px-4">

								</div>
								<div className="mt-5 flex-1 h-0 overflow-y-auto">
									<nav className="px-2 space-y-1">
										{navigation.map((item) => (
												<a
													key={item.name}
													href={item.href}
													onClick={item.onClick}
													className={classNames(
														item.current ? 'bg-gray-900 text-white hover:cursor-pointer' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
														'group flex items-center px-2 py-2 text-base font-medium rounded-md hover:cursor-pointer'
													)}
												>
													<item.icon
														className={classNames(
															item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
															'mr-4 flex-shrink-0 h-6 w-6'
														)}
														aria-hidden="true"
													/>
													{item.name}
												</a>
										))}
									</nav>
								</div>
							</div>
						</Transition.Child>
						<div className="flex-shrink-0 w-14" aria-hidden="true">
							{/* Dummy element to force sidebar to shrink to fit close icon */}
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex-1 flex flex-col min-h-0 bg-gray-800">
						<div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
							<div style={{ fontFamily: 'candy' }} className="text-6xl">
								<span className="text-white opacity-50"></span>
							</div>
						</div>
						<div className="flex-1 flex flex-col overflow-y-auto">
							<nav className="flex-1 px-2 py-4 space-y-1">
								{navigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										onClick={item.onClick}
										className={classNames(
											item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
											'group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:cursor-pointer'
										)}
									>
										<item.icon
											className={classNames(
												item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
												'mr-3 flex-shrink-0 h-6 w-6'
											)}
											aria-hidden="true"
										/>
										{item.name}
									</a>
								))}
							</nav>
						</div>
					</div>
				</div>
				<div className="md:pl-64 flex flex-col">
					<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
						<button
							type="button"
							className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						<div className="flex-1 px-4 flex justify-between">
							<div className="flex-1 flex">
							</div>
							<div className="ml-4 flex items-center md:ml-6">
								{/* Profile dropdown */}
								<Menu as="div" className="ml-3 relative">
										<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200">
											<UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
											<span className="sr-only">Open user menu</span>
										</Menu.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<a
															onClick={item.onClick}
															href={item.href}
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer'
															)}
														>
															{item.name}
														</a>
													)}
												</Menu.Item>
											))}
											
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<main className="flex-1">
						{children}

					</main>
				</div>
			</div>
		</>
	)
}
