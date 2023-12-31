import React, { useState } from 'react'
import { GoAlertFill, GoX } from 'react-icons/go'
import { motion } from 'framer-motion'
import Axios from '../../api/index'
import { ImSpinner9 } from 'react-icons/im'
import { useReviewContext } from '../../hooks/useReviewContext'
import { toast } from 'react-toastify'
const DeleteReview = ({ setIsVisibleDeleteReviewModal, confirmDeleteReview }) => {
	return (
		<>
			<motion.div
				initial={{
					top: "-10%",
					opacity: 0
				}}
				animate={{
					top: "20px",
					opacity: 1,
					transition: {
						duration: 0.25,
						type: "spring"
					},
				}}
				className='fixed top-5 left-0 right-0 m-auto bg-white w-1/4 shadow-md rounded-md z-20'>
				<div className="p-5">
					<div className="flex flex-col items-center">
						<GoAlertFill size={60} className='text-red-600 mb-3' />
						<p className='font-medium text-center'>Are you sure you want to delete this review?</p>
						<p className='text-sm'>This action cannot be undone</p>
					</div>
					<div
						className="flex w-full justify-between items-center gap-2 mt-5">
						<button
							type='button'
							onClick={() => setIsVisibleDeleteReviewModal(false)}
							className='w-full p-2 bg-gray-400 rounded-md text-white'>
							Cancel
						</button>
						<button
							type='submit'
							onClick={() => {
								confirmDeleteReview("Delete review success")
							}}
							className='w-full p-2 bg-red-600 rounded-md text-white hover:bg-red-500 transition-all'>
							Submit
						</button>
					</div>
				</div>
				<GoX className='absolute top-2 right-2 cursor-pointer' size={22} onClick={() => setIsVisibleDeleteReviewModal(false)} />
			</motion.div>
			<motion.div
				initial={{
					opacity: 0
				}}
				animate={{
					opacity: 1,
					transition: {
						duration: 0.2
					}
				}}
				onClick={() => setIsVisibleDeleteReviewModal(false)}
				className="fixed top-0 left-0 w-screen h-screen bg-black/30 z-10"></motion.div>
		</>
	)
}

export default DeleteReview