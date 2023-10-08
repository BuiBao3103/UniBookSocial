import { useState } from 'react';

function Search({ userList, onSearch }) {
    const [searchTerm, setSearchTerm] = useState(''); // Giá trị của ô input

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filteredUsers = userList.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
        onSearch(filteredUsers);
    };

    return (
        <div className="relative ml-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-500 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                </svg>
            </div>
            <input
                type="text"
                id="table-search-users"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500  none-outline"
                value={searchTerm}
                placeholder="Search for users"
                onChange={handleSearch}
            />
        </div>
    );
}

export default Search;
