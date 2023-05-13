import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import UserContext from '../../contexts/UserContext';
import TicketService from '../../modules/TicketService';

export default function TicketMessages() {
	const userContext = useContext(UserContext);
    const router = useRouter();
	const [ticket, setTicket] = useState({
		id: undefined,
		messages: [],
	});

    useEffect(() => {
        async function fetchMessages() {
            if (router.query.id) {

                const response = await fetch('/api/tickets/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticketId: parseInt(router.query.id),
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setTicket(data.ticket);
                }
            }
        }

        fetchMessages();
    }, [router.query.id]);
	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<h1 className="text-2xl font-semibold text-gray-900 mb-4">Ticket {ticket.id} - {ticket.description} </h1>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{ticket.messages.map((message, index) => (
							<div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm hover:cursor-pointer">
								<p>{message.text}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
