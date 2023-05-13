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
		if (userContext.helpUser.tickets) {
			setTickets(userContext.helpUser.tickets);
		}
	}, [userContext.helpUser]);

	const handleNameOnChange = (e) => {
		setName(e.target.value);
	}

	const handleRoleOnChange = (e) => {
		setIsAdmin(e.target.value === 'admin');
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
			let data = await response.json();
			userContext.setUser(data.user);
			userContext.setHelpUser(data.helpUser)
			router.push('/dashboard');
		}

	return (
		<DashboardLayout>
			<form onSubmit={handleSettingsOnSubmit} className="mt-4 ml-2 mr-2">

				<div className="text-left text-xl mt-4">Enter your name:</div>

				<input onChange={handleNameOnChange} value={userContext.helpUser.name} type="text" name="name" required="required" placeholder="Mae Brown" className="rounded-xl w-full p-4" />
				<div className="mt-4 text-left">
					<label className="mr-2 text-xl">Select your role:</label><br></br>
					<select id="role" onChange={handleRoleOnChange} value={userContext.helpUser.admin} className="rounded-xl p-2 w-24">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
			</form>
		</DashboardLayout>
	);
}
