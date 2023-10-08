import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiChevronDown } from 'react-icons/hi';
const Index = () => {
    return (
        <div className="w-full h-full px-10 py-6">
            <div className="flex flex-col">
                <form action="" className="z-[8]">
                    <span className="text-4xl">Search</span>
                    <div className="flex justify-between items-center border border-gray-400 rounded-md px-3 py-2 mt-3">
                        <input
                            type="text"
                            name=""
                            id=""
                            className="w-full border-none focus:outline-none"
                            placeholder="Type something"
                        />
                        <FiSearch size={22} className="text-gray-400" />
                    </div>
                    <div className="py-4 flex border-b border-gray-400">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center relative w-fit">
                                <label htmlFor="type" className="text-sm mr-5 w-24">
                                    Subject Type
                                </label>
                                <select
                                    name=""
                                    id=""
                                    className="w-40 border border-gray-400 px-3 py-2 appearance-none rounded-md"
                                >
                                    <option disabled selected>
                                        Select Type
                                    </option>
                                    <option value="general">General Subject</option>
                                    <option value="main-major">Major</option>
                                </select>
                                <HiChevronDown size={18} className="absolute right-2" />
                            </div>
                            <div className="flex items-center relative w-fit mt-3">
                                <label htmlFor="type" className="text-sm mr-5 w-24">
                                    New/Old
                                </label>
                                <select
                                    name=""
                                    id=""
                                    className="w-40 border border-gray-400 px-3 py-2 appearance-none rounded-md"
                                >
                                    <option disabled selected>
                                        Select Type
                                    </option>
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                </select>
                                <HiChevronDown size={18} className="absolute right-2" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 ml-5">
                            <p className="h-full flex justify-start items-center">Price</p>
                            <div className="flex justify-between items-center gap-5">
                                <input type="number" name="price-min" id="" className="px-3 py-2 rounded-md" />
                                <span> - </span>
                                <input type="number" name="price-max" id="" className="px-3 py-2 rounded-md" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Index;
