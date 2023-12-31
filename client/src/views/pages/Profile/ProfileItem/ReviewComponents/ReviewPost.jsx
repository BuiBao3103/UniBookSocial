import React, { useState } from 'react'
import Axios from '../../../../../api/index'
const ReviewPost = (review, userReview) => {
	console.log(review, userReview)
	const handleHideReview = async (id) => {
		try {
			const res = await Axios.patch(``)
			if(res.status === 200) {

			}
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div
			className="w-full flex flex-col gap-3 border border-gray-400 p-5 rounded-sm">
			<div className="w-full flex flex-row justify-between items-center">
				<div className="flex justify-between gap-3 items-center">
					<div className="flex w-full">
					<div className="w-14 h-14 rounded-full overflow-hidden">
						<img
							src={`http://127.0.0.1:5000/public/images/users/avatar/${userReview.userReviewData.avatar}`}
							alt="" className='w-full h-full object-cover' />
					</div>
					<div className="flex flex-col items-start">
						<span className="name font-medium text-lg">
							{userReview.userReviewData.username}
						</span>
						<div className='flex justify-start'>
							{
								Array(review.reviewData.numStars).fill(null).map((_, index) => (
									<AiFillStar key={index} className='text-yellow-500' size={14} />
								))
							}
						</div>
					</div>
					</div>
					<button className='text-red-500'>Hide Review</button>
				</div>
			</div>
			<div className="flex p-2 border border-gray-400 rounded-sm">
				<p>{review.reviewData.content}</p>
			</div>
		</div>
	)
}

export default ReviewPost