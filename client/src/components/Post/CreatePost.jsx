import React, { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { SiPhotobucket } from 'react-icons/si';
import { Portrait } from '../../assets';
import { FiUpload } from 'react-icons/fi';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Axios from '../../api/index';
import { toast } from 'react-toastify';
import { ImSpinner9 } from 'react-icons/im';
import { useAuthContext } from '../../hooks/useAuthContext';
import { createPostSchema } from '../../validations/PostValidation';
import { usePostContext } from '../../hooks/usePostContext';
const CreatePost = ({ isVisiblePost, handleCreatePost, setActiveOverlay }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [isZoomImage, setIsZoomImage] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [state,dispatch] = useAuthContext()
	const [statePost, dispatchPost] = usePostContext()
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setValue('mainImage', file);
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedFile(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			title: '',
			price: '',
			mainImage: null,
			description: '',
			isNew: -1,
			isGeneralSubject: -1,
		},
		resolver: yupResolver(createPostSchema),
	});
	const onSubmit = async (data) => {
		let formData = new FormData();
		formData.append('title', data.title);
		formData.append('price', data.price);
		formData.append('mainImage', data.mainImage);
		formData.append('description', data.description);
		formData.append('isNew', data.isNew);
		formData.append('isGeneralSubject', data.isGeneralSubject);
		// let postData = Object.fromEntries(formData)
		setIsLoading(true);
		// console.log(postData)
		try {
			dispatchPost({ type: "SET_LOADING" })
			const config = {
				headers: {
					'content-type': 'multipart/form-data',
				},
			};
			const res = await Axios.post('/api/v1/posts', formData, config);
			if (res.status === 201) {
				toast.success('Your post have been posted!');
				dispatchPost({ type: "CREATE_ONE_POST", value: res.data.data.data })
				handleCreatePost(false);
				console.log(res.data.data.data)
			}
		} catch (err) {
			//Don't use err.response it will cause error 500: Internal Server error
			//You can write specific message for it
			// console.log(err.response.data.message)
			dispatchPost({ type: "API_ERROR" })
			toast.error(err.response);
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	};
	console.log(state)
	return (
		<>
			<motion.div
				initial={{
					scale: 0,
					opacity: 0,
				}}
				animate={{
					scale: 1,
					opacity: 1,
					transition: {
						duration: 0.3,
						ease: [0.12, 0, 0.39, 0],
						type: 'spring',
					},
				}}
				exit={{
					scale: 0,
					opacity: 0,
					transition: {
						duration: 0.5,
						ease: [0.12, 0, 0.39, 0],
						type: 'spring',
					},
				}}
				className="fixed inset-0 m-auto w-[600px] h-fit max-h-screen bg-white z-20 rounded-lg overflow-hidden"
			>
				<div className="w-full h-full flex flex-col">
					<p className="text-base text-center font-semibold py-2 border-b">Create new post</p>
					{isLoading && (
						<div className="w-full h-full absolute left-0 top-0 bg-white/80 flex justify-center items-center z-10">
							<ImSpinner9 className="animate-spin duration-500 text-primary-main" size={50} />
						</div>
					)}
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
						<div className="p-4">
							<div className="flex mb-3">
								<div className="w-12 h-12 rounded-full overflow-hidden mr-3">
									<img src={`http://127.0.0.1:5000/public/images/users/${state.user.user.avatar}`} alt="" className="w-full h-full object-cover" />
								</div>
								<span>
									{state.user.user && state.user.user != null ? state.user.user.username : 'John Doe'}
								</span>
							</div>
							<div className="w-full flex flex-col">
								<span className="block mb-1 text-gray-400">Core Image:</span>
								<div className="flex items-center justify-center w-full relative mb-2">
									{selectedFile === null ? (
										<>
											<label
												htmlFor="dropzone-file"
												className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
											>
												<div className="flex flex-col items-center justify-center pt-5 pb-6">
													<FiUpload
														size={45}
														className="text-[#6e6d74] p-3 mb-2 bg-[#F8F8F8] rounded-lg"
													/>
													<p className="mb-2 text-sm text-primary-500 font-medium ">
														<span className="font-medium !text-black">
															Drag & drop files or
														</span>{' '}
														browse files
													</p>
													<p className="text-xs text-gray-500">
														JPG, PNG or GIF - Max file size 2MB
													</p>
												</div>
												<input
													id="dropzone-file"
													{...register('mainImage')}
													type="file"
													className="hidden"
													onChange={handleFileChange}
												/>
											</label>
											<p className="text-sm text-red-600 absolute left-0 -bottom-5 truncate">
												{errors.mainImage?.message}
											</p>
										</>
									) : (
										<>
											<div className="w-full border-2 border-dashed border-black/10 p-2 rounded-md">
												<img
													id="preview-image"
													src={selectedFile}
													alt="Preview"
													onClick={() => setIsZoomImage(true)}
													title="You can click to see the full size of image"
													className="w-full h-[250px] max-h-[20vh] object-cover object-center rounded-md cursor-pointer"
												/>
											</div>
											<AiOutlineClose
												onClick={() => setSelectedFile(null)}
												size={40}
												className="text-white bg-black p-3 rounded-full absolute top-2 right-2 transition-all hover:bg-black/70"
												cursor={'pointer'}
											/>
											<p className="text-sm text-red-600 absolute left-0 -bottom-5 truncate">
												{errors.mainImage?.message}
											</p>
											{isZoomImage && (
												<>
													<div className="fixed inset-0 w-screen h-screen bg-black z-30">
														<div className="w-full h-full py-[100px] px-[300px]">
															<img
																src={selectedFile}
																alt=""
																className="w-full h-full object-contain"
															/>
														</div>
														<AiOutlineClose
															onClick={() => setIsZoomImage(false)}
															className="absolute top-4 right-10 bg-white p-2 rounded-full cursor-pointer hover:bg-white/90 transition-all"
															size={40}
														/>
													</div>
												</>
											)}
										</>
									)}
								</div>
							</div>
							<div className="flex justify-between items-center gap-5 mt-3 h-fit mb-3">
								<div className="w-full flex flex-col mb-3 relative">
									<label htmlFor="email" className="mb-1 text-gray-400">
										Title:
									</label>
									<input
										type="text"
										{...register('title')}
										className="border border-gray-400 rounded-md placeholder:text-sm text-black px-4 py-2 w-full"
										placeholder="John Doe"
									/>
									<p className="text-sm text-red-600 absolute -bottom-5 truncate">
										{errors.title?.message}
									</p>
								</div>
								<div className="w-full flex flex-col mb-3 relative">
									<label htmlFor="email" className="mb-1 text-gray-400">
										Price:
									</label>
									<input
										type="text"
										{...register('price')}
										className="border border-gray-400 rounded-md placeholder:text-sm text-black px-4 py-2 w-full"
										placeholder="15000"
									/>
									<p className="text-sm text-red-600 absolute -bottom-5 truncate">
										{errors.price?.message}
									</p>
								</div>
							</div>
							<div className="flex justify-between items-center gap-5">
								<div className="w-full flex flex-col mb-3 relative">
									<label htmlFor="email" className="mb-1 text-gray-400">
										Major:
									</label>
									<select
										{...register('isGeneralSubject')}
										className="border border-gray-400 px-4 py-2 w-full rounded-md text-sm"
									>
										<option disabled value={'-1'} className="">
											Select Major
										</option>
										<option value="0">No</option>
										<option value="1">Yes</option>
									</select>
									<p className="text-sm text-red-600 absolute -bottom-5 truncate">
										{errors.isGeneralSubject?.message}
									</p>
								</div>
								<div className="w-full flex flex-col mb-3 relative">
									<label htmlFor="email" className="mb-1 text-gray-400">
										Type:
									</label>
									<select
										{...register('isNew')}
										className="border border-gray-400 px-4 py-2 w-full rounded-md text-sm"
									>
										<option disabled value={'-1'}>
											Select Type
										</option>
										<option value="1">New</option>
										<option value="0">Old</option>
									</select>
									<p className="text-sm text-red-600 absolute -bottom-5 truncate">
										{errors.isNew?.message}
									</p>
								</div>
							</div>
							<div className="flex flex-col relative mb-3">
								<label htmlFor="description" className="mb-1 text-gray-400">
									Description
								</label>
								<textarea
									{...register('description')}
									cols="20"
									rows="4"
									placeholder="Type something"
									className="px-4 py-2 border border-gray-400 rounded-md"
								></textarea>
								<p className="text-sm text-red-600 absolute -bottom-5 truncate">
									{errors.description?.message}
								</p>
							</div>
						</div>
						<div className="px-4 py-2 mb-2">
							<button
								type="submit"
								className={`w-full p-2 bg-primary-900 text-center rounded-lg text-white hover:bg-primary-800 transition-all`}
							>
								Publish
							</button>
						</div>
					</form>
				</div>
			</motion.div>
			<motion.div
				onClick={() => {
					handleCreatePost();
					setActiveOverlay(0);
				}}
				className="fixed w-full h-screen bg-black/50 z-10"
			></motion.div>
			<AiOutlineClose
				onClick={() => {
					handleCreatePost();
					setActiveOverlay(0);
				}}
				size={22}
				className="fixed top-4 right-4 text-white cursor-pointer hover:rotate-[360deg] transition-all duration-300 z-[15]"
			/>
		</>
	);
};

export default CreatePost;
