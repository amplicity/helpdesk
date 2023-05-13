
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
	},
	formatDate: function(date) {
			const month = ("0" + (date.getMonth() + 1)).slice(-2);
			const day = ("0" + date.getDate()).slice(-2);
			const year = date.getFullYear();
			
			const hours = ("0" + date.getHours()).slice(-2);
			const minutes = ("0" + date.getMinutes()).slice(-2);
		  
			const ampm = date.getHours() >= 12 ? "PM" : "AM";
			const formattedHours = ("0" + (hours % 12 === 0 ? 12 : hours % 12)).slice(-2);
		  
			return `${month}/${day}/${year} ${formattedHours}:${minutes}${ampm}`;
	},
};

export default TicketService;