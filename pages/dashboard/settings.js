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

	return (
		<DashboardLayout>
			<div className="text-left text-xl mt-4">Enter your name:</div>

			<input onChange={handleNameOnChange} type="text" name="name" required="required" placeholder="Mae Brown" className="rounded-xl w-full p-4" />
			<div className="mt-4 text-left">
				<label className="mr-2 text-xl">Select your role:</label><br></br>
				<select id="role" onChange={handleRoleOnChange} className="rounded-xl p-2 w-24">
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</select>
			</div>
		</DashboardLayout>
	);
}
