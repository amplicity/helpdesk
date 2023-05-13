import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from './layout';

export default function CreateTicket() {
	const router = useRouter();



	return (
		<DashboardLayout>
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
				</div>
			</div>
		</DashboardLayout>
	);
}
