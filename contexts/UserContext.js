import React from "react";

const UserContext = React.createContext({
	user: {},
	setUser: () => {},
	helpUser: {
		tickets:[]
	},
	setHelpUser: () => {},
});

export default UserContext;