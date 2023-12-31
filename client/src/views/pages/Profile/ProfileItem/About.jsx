import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Axios from '../../../../api/index';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ChangePasswordProfile from './AboutComponents/ChangePasswordProfile';
import { changeInformationSchema } from '../../../../validations/ProfileValidation';
import { useAuthContext } from '../../../../hooks/useAuthContext';

function isObjectEmpty(obj) {
	return Object.keys(obj).length === 0;
}

const About = () => {
	const [currentUser, setCurrentUser] = useState({});
	const userID = useParams();
	const navigate = useNavigate();

	const [state, dispatch] = useAuthContext();
	const [edit, setEdit] = useState(false);

	const handleEdit = () => {
		setEdit(!edit);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,

	} = useForm({
		defaultValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			username: currentUser.username,
			email: currentUser.email,
			phoneNumber: currentUser.phoneNumber,
			linkFacebook: currentUser.linkFacebook,
			linkInstagram: currentUser.linkInstagram,
			linkZalo: currentUser.linkZalo
		},
		resolver: yupResolver(changeInformationSchema),
	});

	useEffect(() => {
		Axios.get(`/api/v1/users/${userID.id}`)
			.then(res => setCurrentUser(res.data.data.data))
			.catch(err => {
				toast.error(err.response.message);
				navigate('/');
			});
	}, [userID.id]);

	const handleEditInformation = async (data) => {
		const fieldsToTrack = [
			'firstName',
			'lastName',
			'username',
			'email',
			'phoneNumber',
			'linkFacebook',
			'linkInstagram',
			'linkZalo',
		];
		console.log(data)

		if (data.firstName === "") {
			toast.error("Please enter first name")
			setFocus("firstName")
			return;
		}
		if (data.lastName === "") {
			toast.error("Please enter last name")
			setFocus("lastName")
			return;
		}
		if (data.username === "") {
			toast.error("Please enter username")
			setFocus("username")
			return;
		}
		if (data.email === "") {
			toast.error("Please enter email")
			setFocus("email")
			return;
		}
		if (data.phoneNumber != null) {
			if (data.phoneNumber != "") {
				if (!/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/.test(data.phoneNumber)) {
					toast.error("Please enter valid phone number")
					setFocus("phoneNumber")
					return;
				}
			}
		}
		if (data.linkFacebook != null) {
			if (data.linkFacebook != "") {
				if (!/(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/.test(data.linkFacebook)) {
					toast.error("Please enter valid Facebook link")
					setFocus("linkFacebook")
					console.log(data)
					return;
				}
			}
		}
		if (data.linkInstagram != null) {
			if (data.linkInstagram != "") {
				if (!/(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_\.]+)/im.test(data.linkInstagram)) {
					toast.error("Please enter valid Instagram link")
					setFocus("linkInstagram")
					return;
				}
			}
		}
		if (data.linkZalo != null) {
			if (data.linkZalo != "") {
				if (!/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/.test(data.linkZalo)) {
					toast.error("Please enter valid zalo phone number")
					setFocus("linkZalo")
					return;
				}
			}
		}
		const curUser = {};
		fieldsToTrack.forEach((field) => {
			if (data[field]) {
				curUser[field] = data[field]
			} else {
				curUser[field] = data[field] || currentUser[field];
			}
		});
		console.log(curUser)
		if (isObjectEmpty(curUser)) {
			toast.error("You haven't changed anything");
		} else {
			try {
				const response = await Axios.patch('/api/v1/users/updateMe', curUser);
				if (response.status === 200) {
					toast.success("Edit information success!");
				}
			} catch (err) {
				console.log(err);
				toast.error(err.response.data.message);
			}
		}
	};

	return (
		<div className='w-full h-screen'>
			<form
				onSubmit={handleSubmit(handleEditInformation)}
				className='w-full flex flex-col gap-5 mb-2'
			>
				{["firstName", "lastName", "username", "phoneNumber", "email", "linkFacebook", "linkZalo", "linkInstagram"].map((field) => (
					<div key={field} className={`flex justify-between items-center relative mb-2`}>
						<label htmlFor={field} className='w-1/5 font-medium first-letter:uppercase'>{
							field === "linkZalo" ? "Zalo" : field.replace(/([a-z])([A-Z])/g, '$1 $2')
						}</label>
						<input
							type={field === "linkZalo" ? "text" : field.includes("link") ? "url" : "text"}
							disabled={!edit}
							defaultValue={currentUser[field]}
							{...register(field)}
							className='w-4/5 rounded-md px-3 py-2 text-black'
						/>
						<p className='text-sm text-red-400 absolute -bottom-6 left-[20%]'>{errors[field]?.message}</p>
					</div>
				))}
				{Object.entries(state.user).length > 0 && state.user.user.id === currentUser.id && (
					<div className="flex gap-5">
						<button
							type='button'
							onClick={handleEdit}
							className={`w-28 bg-primary-main px-8 py-2 text-white hover:bg-primary-800 cursor-pointer transition-all rounded-md`}
						>
							{edit ? 'Cancel' : 'Edit'}
						</button>
						<button
							type="submit"
							disabled={!edit}
							className={`w-28 px-8 py-2 cursor-pointer transition-all rounded-md ${edit ? 'bg-primary-main text-white hover:bg-primary-800 cursor-pointer' : 'bg-gray-200 text-white cursor-not-allowed'}`}
						>
							Submit
						</button>
					</div>
				)}
			</form>
			{Object.entries(state.user).length > 0 && state.user.user.id === currentUser.id && (
				<ChangePasswordProfile />
			)}
		</div>
	);
};

export default About;
