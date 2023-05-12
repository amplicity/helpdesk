import { Fragment, useEffect, useState, useContext } from 'react'
import ReactModal from 'react-modal'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
	BellIcon,
	CalendarIcon,
	ChartBarIcon,
	FolderIcon,
	HomeIcon,
	InboxIcon,
	MenuAlt2Icon,
	UploadIcon,
	UsersIcon,
	XIcon,
	PlusIcon,
	TicketIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import UserContext from '../contexts/UserContext';
import { Magic } from 'magic-sdk';
import { useRouter } from 'next/router';
import CreateTicket from '../components/CreateTicket';

export default function Dashboard() {
	const [create, setCreate] = useState(false);
	const navigation = [
		{ name: 'My Tickets', href: '#', onClick:() => setCreate(false), icon: TicketIcon, current: !create },
		{ name: 'Create Ticket', href: '#', onClick: () => setCreate(true), icon: PlusIcon, current: create },
		{ name: 'Settings', href: '#', icon: PlusIcon, current: false },
	]
	
	function classNames(...classes) {
		return classes.filter(Boolean).join(' ')
	}

	const userNavigation = [
		{ name: 'Sign out', href: '#', onClick:() => { logout() } },
	]
	const userContext = useContext(UserContext);
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [namespaces, setNamespaces] = useState([]);
	const [helpUser, setHelpUser] = useState({
		tickets: [],
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [namespaceName, setNamespaceName] = useState('');
	const [files, setFiles] = useState([]);
	const router = useRouter();

	// TODO: move to AuthService
	const logout = async () => {
		console.log('attempting to logout')
		const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY);
		await magic.user.logout();
		router.push('/');
	}

	useEffect(() => {
		console.log('userContext', userContext);
		if (userContext.helpUser.tickets){
			setHelpUser(userContext.helpUser);
		}
	}, [userContext, userContext.helpUser]);


	return (
		<>
			<div>
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
								<div className="flex-shrink-0 flex items-center px-4">
									<img
										className="h-8 w-auto"
										src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
										alt="Workflow"
									/>
								</div>
								<div className="mt-5 flex-1 h-0 overflow-y-auto">
									<nav className="px-2 space-y-1">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												onClick={item.onClick}
												className={classNames(
													item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'group flex items-center px-2 py-2 text-base font-medium rounded-md'
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
											'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
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
								{/* TODO: Search -- uncomment and add feature if I have time */}
								{/* <form className="w-full flex md:ml-0" action="#" method="GET">
									<label htmlFor="search-field" className="sr-only">
										Search
									</label>
									<div className="relative w-full text-gray-400 focus-within:text-gray-600">
										<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
											<SearchIcon className="h-5 w-5" aria-hidden="true" />
										</div>
										<input
											id="search-field"
											className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
											placeholder="Search"
											type="search"
											name="search"
										/>
									</div>
								</form> */}
							</div>
							<div className="ml-4 flex items-center md:ml-6">
								{/* Profile dropdown */}
								<Menu as="div" className="ml-3 relative">
									<div>
										<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
											<span className="sr-only">Open user menu</span>
											<img
												className="h-8 w-8 rounded-full"
												src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
												alt=""
											/>
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<a
															onClick={item.onClick}
															href={item.href}
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
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

					<main className="flex-1 min-h-screen">
						{create && <CreateTicket />}
						{/* {!create && <Tickets />} */}
							
					</main>
				</div>
			</div>
		</>
	)
}
