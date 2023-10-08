import { createContext, useEffect, useMemo, useReducer } from "react";

export const AuthContext = createContext();

const initialState = {
	isAuthorized: localStorage.getItem("auth"),
	user: JSON.parse(localStorage.getItem("user")),
	resetToken: ""
}

const reducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			// Save user information and isAuthorized to localStorage
			localStorage.setItem("user", JSON.stringify({
				user: action.value,
			}));
			localStorage.setItem("auth", true)
			return {
				...state,
			};
		case "LOGOUT":
			localStorage.removeItem("user");
			localStorage.setItem("auth", false)
			return {
				...state,
			};
		case "RESET_PASSWORD":
			return {
				...state,
				resetToken: action.value
			}
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
