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
		id: 0,
		messages: [],
		user: {
			email: '',
			status: 0
		},
	});
	const [text, setText] = useState('');
	const [status, setStatus] = useState(0);

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
					setStatus(data.ticket.status || 0);
					console.log('data.ticket', data);

				}
			}
		}

		fetchMessages();
	}, [router.query.id]);

	const handleTextOnChange = (e) => {
		setText(e.target.value);
	}

	const handleStatusOnChange = async (e) => {
		setStatus(e.target.value);
		const updatedTickets = userContext.helpUser.tickets.map((t) =>
			t.id === ticket.id ? { ...t, status: parseInt(e.target.value) } : t
		);
		userContext.setHelpUser((prevHelpUser) => ({
			...prevHelpUser,
			tickets: updatedTickets,
		}));
		const response = await fetch('/api/tickets/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				status: e.target.value,
				ticketId: ticket.id
			}),
		});
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
				{ticket && ticket.id > 0 && (
					<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<div className="mb-4">
							<h1 className="text-2xl font-semibold text-gray-900">Ticket {ticket.id} - {ticket.description} </h1>
							<h2 className="text-xl text-gray-900">{ticket.user.name}</h2>
							<h2 className="text-xl text-gray-900">{ticket.user.email}</h2>
							{TicketService.isAdmin(userContext.helpUser) && (
								<select id="status" value={status} onChange={handleStatusOnChange} className="rounded-xl p-2 w-24" disabled={!TicketService.isAdmin(userContext.helpUser)}>
									<option value="0">New</option>
									<option value="1">In Progress</option>
									<option value="2">Resolved</option>
								</select>
							)}
							{!TicketService.isAdmin(userContext.helpUser) && (
								<p>Status: &nbsp;
									{status == '0' && 'New'}
									{status == '1' && 'In Progress'}
									{status == '2' && 'Resolved'}
								</p>
							)}

						</div>

						<div className="w-full">
							<div className=" h-[30rem] max-h-[30rem] overflow-y-auto">
								{ticket.messages.map((message, index) => (
									<div key={index} className={`chat ${(!TicketService.isAdmin(userContext.helpUser) && message.adminResponse) || (TicketService.isAdmin(userContext.helpUser) && !message.adminResponse) ? 'chat-start' : 'chat-end'}`}>
										<div className="chat-header">
											{TicketService.isAdmin(userContext.helpUser) && message.adminResponse && <div className="chat-header-name text-slate-500">Support</div>}
											{!TicketService.isAdmin(userContext.helpUser) && message.adminResponse && <div className="chat-header-name text-slate-500">Support</div>}
											{TicketService.isAdmin(userContext.helpUser) && message.adminResponse === false && <div className="chat-header-name text-slate-500">{ticket.user.email}</div>}
											{!TicketService.isAdmin(userContext.helpUser) && message.adminResponse === false && <div className="chat-header-name text-slate-500">You</div>}
											<time className="text-sm opacity-50 text-slate-400">{DayJs(message.createdAt).format('MM/DD/YYYY h:mma')}</time>
										</div>
										<div className="chat-bubble">{message.text}</div>
									</div>
								))}
							</div>
							<form onSubmit={submitText}>
								<div className="relative">


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
				)}

			</div>
		</DashboardLayout >
	);
}
