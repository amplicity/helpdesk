import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import UserContext from '../../contexts/UserContext';
import TicketService from '../../modules/TicketService';

export default function Settings() {
	const userContext = useContext(UserContext);
	const router = useRouter();
	const [isAdmin, setIsAdmin] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		if (userContext.helpUser) {
			setIsAdmin(userContext.helpUser.admin);
			setName(userContext.helpUser.name);
		}
	}, [userContext.helpUser]);

	const handleNameOnChange = (e) => {
		setName(e.target.value || '');
	}


	const handleRoleOnChange = (e) => {
		setIsAdmin(e.target.checked || false);
	};

	const submitDisabled = () => {
		return name === '' || isAdmin === '';
	};

	const handleSettingsOnSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch('/api/updateUser', {
			method: 'POST',
			body: JSON.stringify({
				isAdmin: isAdmin,
				name: name
			})
		});
		if (response.ok) {
			const data = await response.json();
			const updatedUser = {
				...userContext.helpUser,
				admin: data.updatedUser.admin,
				name: data.updatedUser.name,
				tickets: data.updatedUser.tickets
			};
			userContext.setHelpUser(updatedUser);
			router.push('/dashboard');
		}

	};
	return (
		<DashboardLayout>
			<form onSubmit={handleSettingsOnSubmit} className="mt-4 ml-2 mr-2">

				<div className="text-left text-xl mt-4">
					<label>Enter your name:</label>
					<input onChange={handleNameOnChange} value={name} type="text" name="name" required="required" placeholder="Mae Brown" className="rounded-xl w-full p-4" />
				</div>
				<div className="mt-4 text-left">
					<label className="mr-2 relative inline-flex items-center cursor-pointer">
						<input name="toggle" id="toggle" onChange={handleRoleOnChange} checked={isAdmin} type="checkbox" className="sr-only peer" />
							<div className="w-11 h-6 mb-1 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-800"></div>
						<span className="ml-3 text-xl ">Admin</span>
					</label>
				</div>
				<button type="submit" disabled={submitDisabled()} className={` mt-4 z-90 bg-slate-500 text-white font-bold py-2 px-4 rounded`}>
					Save Changes
				</button>

			</form>
		</DashboardLayout>
	);
}




