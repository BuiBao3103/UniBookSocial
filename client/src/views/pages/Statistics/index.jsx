import { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import { toast } from 'react-toastify';
import Axios from '../../../api/index';
import { useForm } from 'react-hook-form';
import { IoPrintOutline } from "react-icons/io5";
import { writeFile } from 'xlsx'
import * as XLSX from 'xlsx'
const Statistics = () => {
	const [selectedFilter, setSelectedFilter] = useState('Violated');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [chartData, setChartData] = useState({ categories: [], data: [] });
	const [dateFilter, setDateFilter] = useState([new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().substring(0, 10), new Date().toISOString().substring(0, 10)])
	const [dataTable, setDataTable] = useState([])
	const modalRef = useRef(null);
	const tableRef = useRef(null)
	const { register, handleSubmit, formState: { errors }, setFocus } = useForm({
		defaultValues: {
			dayStart: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().substring(0, 10),
			dayEnd: new Date().toISOString().substring(0, 10)
		}
	})
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	const handleFilterChange = (filter) => {
		setSelectedFilter(filter);
		setIsDropdownOpen(false);
	};

	const updateChartData = async (data) => {
		if (new Date(data.dayStart) > new Date(data.dayEnd)) {
			toast.error("Please choose day End is greater than day Start")
			return setFocus("dayStart")
		}
		if (new Date(data.dayEnd) > new Date()) {
			toast.error("Please choose day End before or equal the current day")
			return setFocus("dayEnd")
		}
		if (new Date(data.dayEnd) - new Date(data.dayStart) > 30 * 60 * 60 * 24 * 1000) {
			toast.error("The limit between 2 dates is less or equal than 30 days")
			return setFocus("dayStart")
		}
		setDateFilter([data.dayStart, data.dayEnd])
		try {
			const response = await Axios.get(`/api/v1/posts/statistics/${selectedFilter}/dayStart/${data.dayStart}/dayEnd/${data.dayEnd}`,);
			console.log(selectedFilter);
			if (response.status === 200) {
				console.log(response)
				const statisticsData = response.data.data.posts;
				if (statisticsData.length === 0) {
					toast.success("No data found between the selected date")
				}
				const categories = statisticsData.map((item) => item.date_col_formed);
				const data = statisticsData.map((item) => item.count);
				setDataTable(response.data.data.violatedUsers)
				setChartData({ categories, data });
			}
		} catch (error) {
			console.error('Error fetching statistics data:', error);
		}
	};
	const getChartData = async () => {
		try {
			const response = await Axios.get(`/api/v1/posts/statistics/${selectedFilter}/dayStart/${dateFilter[0]}/dayEnd/${dateFilter[1]}`,);
			console.log(selectedFilter);
			if (response.status === 200) {
				console.log(response)
				const statisticsData = response.data.data.posts;
				if (statisticsData.length === 0) {
					toast.success("No data found between the selected date")
				}
				const categories = statisticsData.map((item) => item.date_col_formed);
				const data = statisticsData.map((item) => item.count);
				setDataTable(response.data.data.violatedUsers)
				setChartData({ categories, data });
			}
		} catch (error) {
			console.log(error)
		}
	}
	const options = {
		chart: {
			id: `Data-of-${selectedFilter === "Violated" ? "Violated" : "Checking"}-Posts `,
		},
		xaxis: {
			categories: chartData.categories,
		},
		title: {
			text: `Number of ${selectedFilter === "Violated" ? "violated" : "checking"} posts ${dateFilter.length !== 0 ? ` between ${dateFilter[0]} and ${dateFilter[1]}` : ''} `,
			offsetX: 0,
			offsetY: 0,
			align: 'center',
			margin: 10,
			style: {
				fontSize: '30px',
				fontWeight: '500'
			},
		}
	};

	const series = [
		{
			name: 'Number of violating posts',
			data: chartData.data,
		},
	];
	useEffect(() => {
		getChartData()
	}, [dateFilter,selectedFilter])
	const exportToExcel = () => {
		const ws = XLSX.utils.json_to_sheet(dataTable.map(item => ({
			'ID': item.userPostData.id,
			'Name': item.userPostData.username,
			'Email': item.userPostData.email,
			'Quantity': item.count,
			'Total': item.countAll,
		})));

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		const filename = `${selectedFilter === "Violated" ? "Violated" : "Checking"}_${dateFilter[0]}_${dateFilter[1]}.xlsx`;

		// Save the file
		writeFile(wb, filename);
	};
	return (
		<div className="relative w-full h-full">
			<div className="flex items-center pb-4 pt-[15px] bg-white space-x-4">
				<div className="ml-5" ref={modalRef}>
					<button
						onClick={toggleDropdown}
						id="dropdownActionButhrefn"
						data-dropdown-hrefggle="dropdownAction"
						className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-[10px]"
						type="button"
					>
						<span className="sr-only">Action buthrefn</span>
						{selectedFilter}
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
					{isDropdownOpen && (
						<div
							id="dropdownAction"
							className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 "
						>
							<ul className="py-1 text-sm text-gray-700 " aria-labelledby="dropdownActionButhrefn">
								<li>
									<a
										href="#"
										className={`block px-4 py-2 hover:bg-gray-100 ${selectedFilter === 'Violated' ? 'bg-gray-100' : ''
											}`}
										onClick={() => handleFilterChange('Violated')}
									>
										Violated
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`block px-4 py-2 hover:bg-gray-100 ${selectedFilter === 'Checking' ? 'bg-gray-100' : ''
											}`}
										onClick={() => handleFilterChange('Checking')}
									>
										Check Post
									</a>
								</li>
							</ul>
						</div>
					)}
				</div>
				<form
					className='flex gap-2'
					onSubmit={handleSubmit(updateChartData)}>
					<input type="date" {...register("dayStart")} defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)} className='rounded-md w-fit' />
					<input type="date" {...register("dayEnd")} defaultValue={new Date().toISOString().substring(0, 10)} className='rounded-md w-fit' />
					<button type="submit" className='px-5 py-2 bg-primary-main text-white rounded-md hover:bg-primary-700 transition-all'>Filter</button>
				</form>
			</div>
			{/* <!-- BarChart --> */}
			<div className="w-full h-1/2 mt-10">
				<div className="h-full w-full flex justify-center">
					<Chart options={options} series={series} type="bar" width={1000} height={"100%"} />
				</div>
			</div>
			{
				dataTable.length > 0 && (
					<div className="w-full flex flex-col mt-3">
						<div className="w-full flex justify-between items-center px-3 py-1">
							<p className='font-medium'>Total: {dataTable.length}</p>
							<button
								onClick={() => {
									exportToExcel();
									toast.success("Data exported to excel")
								}}
								className='flex items-center gap-1 group transition-all px-3 py-1 mr-1 hover:bg-primary-main rounded-md'>
								<IoPrintOutline size={30} className='group-hover:text-white' />
								<span className='w-0 hidden transition-all group-hover:block group-hover:text-white group-hover:w-auto '>Export to excel</span>
							</button>
						</div>
						<table ref={(el) => tableRef.current = el} id='table' className='w-full text-sm text-left text-gray-500 border rounded-md'>
							<thead className='text-xs text-gray-700 uppercase bg-gray-50'>
								<tr>
									<th scope="col" className="px-6 py-3">ID</th>
									<th scope="col" className="px-6 py-3">Name</th>
									<th scope="col" className="px-6 py-3">Email</th>
									<th scope="col" className="px-6 py-3">Quantity Filter Result</th>
									<th scope="col" className="px-6 py-3">Total</th>
								</tr>
							</thead>
							<tbody key={1}>
								{
									dataTable.map((item, index) => (
										<tr key={index} className='bg-white border-b hover:bg-gray-50'>
											<td className="px-6 py-4">{item.userPostData.id}</td>
											<td className="px-6 py-4">{item.userPostData.username}</td>
											<td className="px-6 py-4">{item.userPostData.email}</td>
											<td className="px-6 py-4">{item.count}</td>
											<td className="px-6 py-4">{item.countAll}</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				)
			}
		</div>
	);
};

export default Statistics;
