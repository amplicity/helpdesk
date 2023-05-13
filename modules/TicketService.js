
const TicketService = {
	getStatus: function(statusInt) {
		if (statusInt === 0){
			return 'New'
		} else if (statusInt === 1) {
			return 'In Progress'
		} else if (statusInt === 2) {
			return 'Resolved'
		}
		return 'Unknown'
	}
};

export default TicketService;