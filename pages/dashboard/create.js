import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';

export default function Create() {
	const router = useRouter();

	const handleTicketOnSubmit = async (event) => {
		event.preventDefault();
		const description = event.target.description.value;
		const text = event.target.text.value;
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
			console.log('Ticket created:', result);
			router.push('/dashboard')

		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<h1 className="text-2xl font-semibold text-gray-900">Create a Ticket</h1>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<div className="flex flex-col ">
						<form onSubmit={handleTicketOnSubmit}>
							<div className="mt-4">
								<label htmlFor="description" className="block text-sm font-medium text-gray-700">
									Description
								</label>
								<input
									type="text"
									name="description"
									id="description"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
							<div className="mt-4">
								<label htmlFor="text" className="block text-sm font-medium text-gray-700">
									Text
								</label>
								<textarea
									name="text"
									id="text"
									rows="3"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								></textarea>
							</div>
							<button type="submit" className={` mt-4 z-90 text-white font-bold py-2 px-4 bg-slate-500 rounded hover:cursor-pointer`}>
								Create Ticket
							</button>
						</form>
					</div>
				</div>
			</div>
		</DashboardLayout>

	);
}
