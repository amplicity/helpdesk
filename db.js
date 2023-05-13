import { PrismaClient } from '@prisma/client'

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	// In development, use a global variable to avoid multiple instances of Prisma Client
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}




export async function updateUser(phone) {
	const data = {};

	const user = await prisma.user.update({
		where: { phone: phone },
		data: data,
	});

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

	const user = await prisma.user.upsert({
		where: { email: u.email },
		update: updateData,
		create: createData,
		include: { tickets: true },
	});

	return user;
}

