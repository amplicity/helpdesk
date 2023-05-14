import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import UserContext from '../../contexts/UserContext';

export default function Create() {
	const router = useRouter();
	const userContext = useContext(UserContext);
	const [text, setText] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (!userContext.helpUser.name) {
			router.push('/dashboard/settings');
		}
	}, [router, userContext.helpUser]);

	const handleTicketOnSubmit = async (e) => {
		e.preventDefault();
		const ticket = { description, text };
		try {
			const response = await fetch('/api/tickets/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(ticket),
			});

			if (!response.ok) {
				throw new Error('Failed to create ticket');
			}

			const result = await response.json();
			console.log('📧 Send email to admins. Ticket created:', result);
			const updatedTickets = [...userContext.helpUser.tickets, result.ticket];			
			const updatedUser = {
			  ...userContext.helpUser,
			  tickets: updatedTickets,
			};
			userContext.setHelpUser(updatedUser);
			
			router.push('/dashboard')

		} catch (error) {
			console.error('Error:', error);
		}
	};
	const handleTextOnChange = (e) => {
		setText(e.target.value);
	}

	const handleDescriptionOnChange = (e) => {
		setDescription(e.target.value);
	}

	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<h1 className="text-2xl font-semibold text-gray-900">Create a Ticket</h1>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<div className="flex flex-col ">
						<form action="#">
							<div className="mt-4">
								<label htmlFor="description" className="block text-sm font-medium text-gray-700">
									Subject
								</label>
								<input
									type="text"
									name="description"
									id="description"
									onChange={handleDescriptionOnChange}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
							<div className="mt-4">
								<label htmlFor="text" className="block text-sm font-medium text-gray-700">
									Description
								</label>
								<textarea
									name="text"
									id="text"
									rows="3"
									onChange={handleTextOnChange}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								></textarea>
							</div>
							<button onClick={handleTicketOnSubmit} disabled={description == '' || text == '' || text == undefined || description == undefined}  className={`mt-4 z-50 text-white font-bold py-2 px-4 bg-slate-500 rounded hover:cursor-pointer`} >
								Create Ticket
							</button>

						</form>
					</div>
				</div>
			</div>
		</DashboardLayout>

	);
}
