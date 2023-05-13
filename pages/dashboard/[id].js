import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import UserContext from '../../contexts/UserContext';
import TicketService from '../../modules/TicketService';
import DayJs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function TicketMessages() {
	const userContext = useContext(UserContext);
	const router = useRouter();
	const [ticket, setTicket] = useState({
		id: undefined,
		messages: [],
		user: {
			email: '',
		},
	});
	const [text, setText] = useState('');

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

	const handleTextOnChange = (e) => {

		setText(e.target.value);
	}

	const submitText = async (e) => {
		e.preventDefault();
		if (text.length > 0) {
			const response = await fetch('/api/tickets/reply', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: text,
					ticketId: ticket.id
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setTicket((prevTicket) => ({
					...prevTicket,
					messages: [...prevTicket.messages, data.message],
				}));
				setText('');
			}
		}
	};

	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<div className="mb-4">
						<h1 className="text-2xl font-semibold text-gray-900">Ticket {ticket.id} - {ticket.description} </h1>
						<h2 className="text-xl text-gray-900">{ticket.user.email}</h2>
						<h2 className="text-xl text-gray-900">{ticket.user.name}</h2>

					</div>

					<div className="w-full">
						<div className=" h-[30rem] max-h-[30rem] overflow-y-auto">
							{ticket.messages.map((message, index) => (
								<div key={index} className={`chat ${(!TicketService.isAdmin() && message.adminResponse) || (TicketService.isAdmin() && !message.adminResponse) ? 'chat-start' : 'chat-end'}`}>
									<div className="chat-header">
										{TicketService.isAdmin() && message.adminResponse && <div className="chat-header-name text-slate-500">Support</div>}
										{!TicketService.isAdmin() && message.adminResponse && <div className="chat-header-name text-slate-500">Support</div>}
										{TicketService.isAdmin() && message.adminResponse === false && <div className="chat-header-name text-slate-500">{ticket.user.email}</div>}
										{!TicketService.isAdmin() && message.adminResponse === false && <div className="chat-header-name text-slate-500">You</div>}
										<time className="text-sm opacity-50 text-slate-400">{DayJs(message.createdAt).format('MM/DD/YYYY h:mma')}</time>
									</div>
									<div className="chat-bubble">{message.text}</div>
								</div>
							))}
						</div>
						<form onSubmit={submitText}>
							<div class="relative">


								<input
									onChange={handleTextOnChange}
									value={text}
									type="text"
									name="text"
									required="required"
									placeholder="Reply here..."
									className="rounded-xl w-full p-4" />
								{text.length > 0 && (
									<button type="submit" className="absolute right-4 h-14 text-3xl text-slate-200">
										<FontAwesomeIcon icon={faCircleArrowUp} />
									</button>
								)}
							</div>

						</form>

					</div>
				</div>
			</div>
		</DashboardLayout >
	);
}
