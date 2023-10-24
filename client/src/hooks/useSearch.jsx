import React, { useContext } from "react";
import { SearchContext } from "../context/SearchProvider";
export const useSearchContext = () => {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
}