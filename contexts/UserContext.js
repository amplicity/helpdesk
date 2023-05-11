import React from "react";

const UserContext = React.createContext({
	user: {},
	setUser: () => {},
	helpUser: {},
	setHelpUser: () => {},
});

export default UserContext;