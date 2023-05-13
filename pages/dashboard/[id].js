import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import UserContext from '../../contexts/UserContext';
import TicketService from '../../modules/TicketService';
import DayJs from 'dayjs';

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
					console.log('data.ticket', data.ticket);
					setTicket(data.ticket);
				}
			}
		}

		fetchMessages();
	}, [router.query.id]);

	const isAdmin = () => {
		if (userContext.helpUser === undefined) return false;
		return userContext.helpUser.admin === true;
	}

	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<h1 className="text-2xl font-semibold text-gray-900 mb-4">Ticket {ticket.id} - {ticket.description} </h1>
					<div className="w-full">
						{ticket.messages.map((message, index) => (
							<div key={index} className={`chat ${(!isAdmin() && message.adminResponse) || (isAdmin() && !message.adminResponse) ? 'chat-start' : 'chat-end'}`}>
								<div className="chat-header">
									{isAdmin() && message.adminResponse && <div className="chat-header-name text-slate-500">You</div>}
									{!isAdmin() && message.adminResponse && <div className="chat-header-name text-slate-500">Support</div>}
									{isAdmin() && message.adminResponse === false && <div className="chat-header-name text-slate-500">{ticket.user.email}</div>}
									{!isAdmin() && message.adminResponse === false && <div className="chat-header-name text-slate-500">You</div>}
									<time className="text-sm opacity-50 text-slate-400">{DayJs(message.createdAt).format('MM/DD/YYYY h:mma')}</time>
								</div>
								<div className="chat-bubble">{message.text}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
