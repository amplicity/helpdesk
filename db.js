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

export async function getOrCreateUserByPhone(phone) {
	const user = await prisma.user.upsert({
		where: { phone: phone },
		update: {
			phone: phone,
		},
		create: { phone: phone },
		include: { Namespaces: true },
	});
	return user;
}

export async function updateUser(phone) {
	const data = {};

	const user = await prisma.user.update({
		where: { phone: phone },
		data: data,
	});

	return user;
}

export async function createOrUpdateNamespace(namespaceName, userId) {
	const namespace = await prisma.namespace.upsert({
		where: {
			name: namespaceName,
		},
		update: {
			name: namespaceName,
			UserId: userId,
		},
		create: {
			name: namespaceName,
			User: {
				connect: {
					id: userId,
				},
			},
		},
		include: {
			User: true,
		},
	});
	return namespace;
}
