import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import UserContext from '../../contexts/UserContext';
import TicketService from '../../modules/TicketService';

export default function Tickets() {
	const userContext = useContext(UserContext);
	const router = useRouter();
	const [tickets, setTickets] = useState([]);

	useEffect(() => {
		if (userContext.helpUser.tickets) {
			setTickets(userContext.helpUser.tickets);
		}
		if (!userContext.helpUser.name) {
			router.push('/dashboard/settings');
		}
	}, [router, userContext.helpUser]);



	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<h1 className="text-2xl font-semibold text-gray-900 mb-4">
						{!TicketService.isAdmin(userContext.helpUser) &&
							<>My Tickets</>
						}
						{TicketService.isAdmin(userContext.helpUser) &&
							<>All Tickets
								 &nbsp;<span className="bg-gray-100 text-gray-800 text-xs tex uppercase font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Admin</span>

							</>
						}
					</h1>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{tickets.map((ticket, index) => (
							<div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm hover:cursor-pointer" onClick={() => router.push(`/dashboard/${ticket.id}`)}>
								<div className="text-xl text-gray-600">
									{ticket.description.length > 30
										? ticket.description.substring(0, 30) + '...'
										: ticket.description}
								</div>
								<div className="text-sm font-semibold text-gray-700 mb-2">Status: {TicketService.getStatus(ticket.status)}</div>
							</div>
						))}

					</div>
					{tickets.length < 1 &&
						<p>Nothing to see here, yet...</p>
					}
				</div>
			</div>
		</DashboardLayout>
	);
}
