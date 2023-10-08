import { PiPencilSimpleLine, PiTrashSimpleLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Pagination from '../../../components/Dashboard/Pagination';
import Search from '../../../components/Dashboard/Search';
import { AvatarUser } from '../../../assets';
import './Users.scss';

const Users = () => {
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((result) => setUserList(result))
            .catch((error) => console.log(error));

        // Assign initial value to filteredUserList
        setFilteredUserList(userList);
    }, []);

    useEffect(() => {
        // When the value of userList changes, update the value of filteredUserList
        setFilteredUserList(userList);
    }, [userList]);

    const handleSearch = (filteredUsers) => {
        setFilteredUserList(filteredUsers);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mg">
                <div className="flex items-center pb-4 pt-4 bg-white space-x-4">
                    <div className="ml-2">
                        <button
                            id="dropdownActionButton"
                            data-dropdown-toggle="dropdownAction"
                            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 "
                            type="button"
                        >
                            <span className="sr-only">Action button</span>
                            All
                            <svg
                                className="w-2.5 h-2.5 ml-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                        {/* <!-- Dropdown menu --> */}
                        <div
                            id="dropdownAction"
                            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 "
                        >
                            <ul className="py-1 text-sm text-gray-700 " aria-labelledby="dropdownActionButton">
                                <li>
                                    <Link to="#" className="block px-4 py-2 hover:bg-gray-100">
                                        Reward
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="block px-4 py-2 hover:bg-gray-100 ">
                                        Promote
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="block px-4 py-2 hover:bg-gray-100 ">
                                        Activate account
                                    </Link>
                                </li>
                            </ul>
                            <div className="py-1">
                                <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">
                                    Delete User
                                </Link>
                            </div>
                        </div>
                    </div>
                    <label htmlFor="table-search" className="sr-only">
                        Search
                    </label>
                    <Search userList={userList} onSearch={handleSearch} />
                    <button className="w-28 sm:w-20 py-2 px-1 bg-primary-900 rounded-md text-white border border-primary-900 inline-flex items-center justify-center ">
                        Add user
                    </button>
                </div>
                <table className="w-full text-sm text-left text-gray-500 -400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 -700 -400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                FirstName
                            </th>
                            <th scope="col" className="px-6 py-3">
                                LastName
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUserList && filteredUserList.length > 0
                            ? filteredUserList.slice(startIndex, endIndex).map((user) => (
                                  <tr key={user.id} className="bg-white border-b -800 -700 hover:bg-gray-50 -gray-600">
                                      <td className="px-6 py-4">{user.id}</td>
                                      <th
                                          scope="row"
                                          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                                      >
                                          <img className="w-10 h-10 rounded-full" src={AvatarUser} alt="Jese image" />
                                          <div className="pl-3">
                                              <div className="text-base font-semibold">{user.name}</div>
                                              <div className="font-normal text-gray-500">{user.email}</div>
                                          </div>
                                      </th>
                                      <td className="px-6 py-4">Neil</td>
                                      <td className="px-6 py-4">Sims</td>
                                      <td className="px-6 py-4">Admin</td>
                                      <td className="px-6 py-4">
                                          <div className="flex items-center">
                                              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> Online
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          {/* <!-- Modal toggle --> */}
                                          <div className="flex items-center space-x-2 md:space-x-2">
                                              <Link
                                                  to="#"
                                                  type="button"
                                                  data-modal-target="editUserModal"
                                                  data-modal-show="editUserModal"
                                                  className=" font-semibold text-2xl text-blue-600"
                                              >
                                                  <i>
                                                      <PiPencilSimpleLine />
                                                  </i>
                                              </Link>
                                              <Link
                                                  to="#"
                                                  type="button"
                                                  data-modal-target="editUserModal"
                                                  data-modal-show="editUserModal"
                                                  className="font-medium text-2xl text-blue-600"
                                              >
                                                  <i>
                                                      <PiTrashSimpleLight />
                                                  </i>
                                              </Link>
                                          </div>
                                      </td>
                                  </tr>
                              ))
                            : `<p>This user could not be found</p>`}
                        {/* <tr className="bg-white border-b -800 -700 hover:bg-gray-50 -gray-600">
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                            <img className="w-10 h-10 rounded-full" src={AvatarUser} alt="Jese image" />
                            <div className="pl-3">
                                <div className="text-base font-semibold">Neil Sims</div>
                                <div className="font-normal text-gray-500">neil.sims@flowbite.com</div>
                            </div>
                        </th>
                        <td className="px-6 py-4">
                            Neil
                        </td>
                        <td className="px-6 py-4">
                            Sims
                        </td>
                        <td className="px-6 py-4">
                            Admin
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> Online
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <!-- Modal toggle --> 
                            <div className='flex items-center space-x-2 md:space-x-2'>
                                <Link to="#" type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className=" font-semibold text-2xl text-blue-600">
                                    <i >
                                        <PiPencilSimpleLine />
                                    </i>
                                </Link>
                                <Link to="#" type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className="font-medium text-2xl text-blue-600">
                                <i>
                                    <PiTrashSimpleLight />
                                </i>
                                </Link>
                            </div>
                        </td>
                    </tr> */}
                    </tbody>
                </table>
                {/* <!-- Edit user modal --> */}
                <div
                    id="editUserModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 left-0 right-0 z-50 items-center justify-center hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <div className="relative w-full max-w-2xl max-h-full">
                        {/* <!-- Modal content --> */}
                        <form action="#" className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit user</h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="editUserModal"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="first-name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Bonnie"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="last-name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Green"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="example@company.com"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="phone-number"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="number"
                                            name="phone-number"
                                            id="phone-number"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="e.g. +(12)3456 789"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="department"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            id="department"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Development"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="company"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Company
                                        </label>
                                        <input
                                            type="number"
                                            name="company"
                                            id="company"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="123456"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="current-password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="current-password"
                                            id="current-password"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="••••••••"
                                            required=""
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="new-password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new-password"
                                            id="new-password"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="••••••••"
                                            required=""
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Modal footer --> */}
                            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Save all
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Pagination */}
            <Pagination
                totalItems={filteredUserList.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default Users;
