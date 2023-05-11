import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faQuestionCircle, faCalendarCheck, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Magic } from 'magic-sdk';
import UserContext from '../contexts/UserContext'
import { getClosestCity, getCoordinates } from '../modules/LocationService'
import ToastContext from '../contexts/ToastContext';


export default function Settings() {
	const router = useRouter();
	const userContext = useContext(UserContext);
	const [city, setCity] = useState(null);
	const toastContext = useContext(ToastContext);

	const logout = async () => {
		const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY);
		await magic.user.logout();
		router.push('/');
	}

	useEffect(() => {
		if (userContext.miniUser.lat) {
			async function getCity() {
				if (userContext.miniUser) {
					setCity(await getClosestCity(userContext.miniUser.lat, userContext.miniUser.long));
				}
			}
			getCity();
		}
		console.log('usercontext', userContext.miniUser)

	}, [userContext.miniUser]);

	const showToast = (message) => {
		toastContext.setToast({ visible: true, message });
		setTimeout(() => {
			toastContext.setToast({ visible: false, message: '' });
		}, 4000); // Hide the toast after 4 seconds
	};

	const handleLocationChange = async () => {
		try {
			let location = await getCoordinates();
			setCity(await getClosestCity(location.latitude, location.longitude));
			await updateUser({ lat: location.latitude, long: location.longitude });
			showToast("Your location has been updated to " + city + ".");

		} catch (error) {
			console.error('Error getting location:', error);
		}
	}

	async function updateUser(updatedData) {
		console.log('updatedData', updatedData);
		try {
			const response = await fetch('/api/updateUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData),
			});

			if (!response.ok) {
				throw new Error('Failed to update user');
			}

			const { updatedUser } = await response.json();
			console.log('User updated successfully:', updatedUser);
			userContext.setMiniUser(updatedUser);
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}

	async function toggleNotifications() {
		await updateUser({ notificationsEnabled: !userContext.miniUser.notificationsEnabled });
	}

	async function handleNewEventClick() {
		if (userContext.miniUser.admin == true) {
			router.push('/events/create');
		}
	}



	return (
		<div>
			<div className="ml-8 mr-8 md:ml-32 md:mr-32 lg:ml-48 lg:mr-48">
				<div className=" bg-white rounded-lg shadow-lg p-4 mt-8 text-black hover:cursor-pointer w-full">
					<div className="">
						<h2 className="text-2xl mb-8 flex opacity-50">
							<FontAwesomeIcon icon={faQuestionCircle} className="w-6 flex-none " />&nbsp;
							<div className="flex-none ">
								Now what?
							</div>
						</h2>
					</div>
					<div className="">
						<p>Sit tight! Organyze will send you an SMS when there's an actionable event (phone a senator, tree planting, sign a petition, etc) near you. If you're an event organizer and would like to create an event, use the box below. </p>
					</div>

				</div>
			</div>

			<div className="ml-8 mr-8 md:ml-32 md:mr-32 lg:ml-48 lg:mr-48">
				<div className=" bg-white rounded-lg shadow-lg p-4 mt-8 text-black hover:cursor-pointer w-full">
					<div className="">
						<h2 className="text-2xl mb-8 flex opacity-50">
							<FontAwesomeIcon icon={faGear} className="w-6 flex-none " />&nbsp;
							<div className="flex-none ">
								Your settings
							</div>
						</h2>
					</div>
					<div className="float-none">
						<p className="">
							Your location:
						</p>
						<span className="flex" onClick={() => handleLocationChange()}>
							{city &&
								<b>
									{city}&nbsp;
								</b>
							}
							{!city &&
								<span className="animate-pulse blur-sm">My City Place</span>
							}

							<FontAwesomeIcon icon={faLocationArrow} className="w-6"></FontAwesomeIcon> (tap to update)
						</span>

						<p>Notifications:</p>
						<div className="mt-1 inline-flex">
							<label className="relative items-center cursor-pointer">
								<input type="checkbox" value="" class="sr-only peer" onClick={() => toggleNotifications()} checked={userContext.miniUser.notificationsEnabled ? true : false} />
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
							<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Receive SMS notifications for climate events in your area.</span>


						</div>

					</div>

				</div>
			</div>

			<div className="ml-8 mr-8 md:ml-32 md:mr-32 lg:ml-48 lg:mr-48">
				<div className=" bg-white rounded-lg shadow-lg p-4 mt-8 text-black hover:cursor-pointer w-full">
					<div className="">
						<h2 className="text-2xl mb-8 flex opacity-50">
							<FontAwesomeIcon icon={faCalendarCheck} className="w-6 flex-none " />&nbsp;
							<div className="flex-none ">
								Create an event
							</div>
						</h2>
					</div>
					<div className="float-none">
						Click below to create an event and notify users in the event's area.
					</div>

					<a href="https://docs.google.com/forms/d/e/1FAIpQLSdyDcZ0INxIOL2TQn_RYmkC6Rr3EHbNZ9mkaHv3egkzlQTD0g/formResponse" target="_blank" >
						<div className=" ml-8 mr-8 bg-organyze-blue rounded-lg shadow-lg p-4 mt-8 text-black hover:cursor-pointer"  >
							<h3 className="text-2xl text-center text-white">Create event</h3>
						</div>
					</a>
					{userContext.miniUser.admin}
					{userContext.miniUser.admin == true &&
						<div className=" ml-8 mr-8 bg-organyze-blue rounded-lg shadow-lg p-4 mt-8 text-black hover:cursor-pointer" onClick={() => { handleNewEventClick() }}  >
							<h3 className="text-2xl text-center text-white">Admin Create Event</h3>
						</div>
					}


				</div>
			</div>

			<div className="w-1/3 ml-[33%]  bg-organyze-coral rounded-lg shadow-lg p-4 mt-8 text-black hover:cursor-pointer" onClick={() => logout()}>
				<h3 className="text-base text-center text-white">Logout</h3>
			</div>
		</div >
	)
}
