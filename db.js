import { PrismaClient } from '@prisma/client'

let prisma;
if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	// In development, use a global variable to avoid multiple instances of Prisma Client
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export async function updateUser(u, body) {
	let isAdmin;
	let name;

	if (body) {
		body = JSON.parse(body);
		isAdmin = body.isAdmin;
		name = body.name;
	}
	const data = {
		admin: isAdmin,
		name: name,
	};

	const user = await prisma.user.update({
		where: { email: u.email },
		data: data,
		include: {
			tickets: true
		}
	});
	if (user.admin) {
		const allTickets = await prisma.ticket.findMany({
			include: {
				user: true
			}
		});
		user.tickets = allTickets;
	}

	return user;
}

export async function createTicket(u, body) {
	const newTicketStatus = 0;
	const data = {
		description: body.description,
		user: { connect: { email: u.email } },
		status: newTicketStatus
	};

	const ticket = await prisma.ticket.create({
		data: data,
	});

	return ticket;

}

export async function createMessage(u, ticketId, body) {
	const data = {
		text: body.text,
		ticket: { connect: { id: ticketId } }, // Connect the message with a ticket
		user: { connect: { email: u.email } }, // Connect the message with a user
	};

	const message = await prisma.message.create({
		data: data,
	});

	return message;
}

export async function getMessages(u, body) {
	if (body) {
		body = JSON.parse(body);
	}
	const messages = await prisma.message.findMany({
		where: {
			ticketId: body.ticketId,
			ticket: {
				user: {
					email: u.email
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return messages;

}

export async function getTicket(u, body) {
	if (body && typeof body === 'string') {
		body = JSON.parse(body);
	}

	const user = await prisma.user.findFirst({
		where: {
			email: u.email,
		},
	});

	if (!user.admin) {
		const ticket = await prisma.ticket.findFirst({
			where: {
				id: body.ticketId,
				user: {
					email: u.email,
				},
			},
			include: {
				messages: {
					orderBy: {
						createdAt: 'asc',
					},
				},
				user: true,
			},
		});
		return ticket;
	} else {
		const ticket = await prisma.ticket.findFirst({
			where: {
				id: body.ticketId,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: 'asc',
					},
				},
				user: true,
			},
		});
		return ticket;
	}


}


export async function getOrCreateUserByEmail(u, body) {
	let isAdmin;
	let name;

	if (body) {
		body = JSON.parse(body);
		isAdmin = body.isAdmin;
		name = body.name;
	}

	const updateData = {
		email: u.email,
		...(isAdmin !== undefined && { admin: isAdmin }),
	};

	if (name !== undefined) {
		updateData.name = name;
	}

	const createData = {
		email: u.email,
		...(isAdmin !== undefined && { admin: isAdmin }),
		...(name !== undefined && { name: name }),
	};

	let user = await prisma.user.upsert({
		where: { email: u.email },
		update: updateData,
		create: createData,
		include: { tickets: true },
	});
	if (user.admin) {
		const allTickets = await prisma.ticket.findMany({
			include: {
				user: true
			}
		});
		user.tickets = allTickets;
	}
	return user;
}

export async function sendMessage(u, body) {
	if (body && typeof body === 'string') {
		body = JSON.parse(body);
	}
	const helpUser = await prisma.user.findUnique({
		where: {
			email: u.email,
		},
	});
	const message = await prisma.message.create({
		data: {
			text: body.text,
			adminResponse: helpUser.admin,
			user: {
				connect: {
					email: u.email,
				},
			},
			ticket: {
				connect: {
					id: body.ticketId,
				},
			},
		},
	});

	return message;
}

export async function updateTicket(u, body) {
	if (body && typeof body === 'string') {
		body = JSON.parse(body);
	}
	const ticket = await prisma.ticket.update({
		where: {
			id: body.ticketId,
		},
		data: {
			status: parseInt(body.status),
		},
	});

	return ticket;
}
