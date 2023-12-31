import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { changePasswordSchema } from '../../../../../validations/ProfileValidation'
import { toast } from 'react-toastify'
import Axios from '../../../../../api/index'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'
const ChangePasswordProfile = () => {

	const [password, setPassword] = useState(false)
	const [newPassword, setNewPassword] = useState(false)
	const [confirmPassword, setConfirmPassword] = useState(false)


	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			passwordCurrent: "",
			password: "",
			passwordConfirm: ""
		},
		resolver: yupResolver(changePasswordSchema)
	})
	const onSubmitChangePassword = (data) => {
		const passwords = {
			passwordCurrent: data.passwordCurrent,
			password: data.password,
			passwordConfirm: data.passwordConfirm
		}
		Axios.patch('/api/v1/users/updateMyPassword', passwords).then(res => {
			if (res.status === 200) {
				toast.success("Change password success!")
			}
			console.log(res)
			console.log(res.data)
		}).catch(err => {
			console.log(err.response)
			toast.error(err.response.data.message)
		})
	}
	return (
		<form
			onSubmit={handleSubmit(onSubmitChangePassword)}
			className='py-8'>
			<span className='text-xl'>Change Password</span>
			<div className="flex flex-col gap-8 mt-4">
				<div className="flex justify-between items-center relative">
					<label htmlFor="" className='w-1/4 font-medium'>Old Password</label>
					<input type={`${!password ? "password" : "text"}`} {...register("passwordCurrent")} className='w-3/4 rounded-md px-3 py-2 text-black' />
					{
						!password ? (
							<PiEyeBold
								onClick={() => setPassword(!password)}
								size={22} className='absolute top-1/4 right-3 cursor-pointer' />
						) : (
							<PiEyeClosedBold
								onClick={() => setPassword(!password)}
								size={22} className='absolute top-1/4 right-3 cursor-pointer' />
						)
					}
					<p className='text-sm w-fit text-red-400 absolute top-12 left-1/4'>{errors.passwordCurrent?.message}</p>
				</div>
				<div className="flex justify-between items-center relative">
					<label htmlFor="" className='w-1/4 font-medium'>New Password</label>
					<input type={`${!newPassword ? "password" : "text"}`} {...register("password")} className='w-3/4 rounded-md px-3 py-2 text-black' />
					{
						!newPassword ? (
							<PiEyeBold
								onClick={() => setNewPassword(!newPassword)}
								size={22} className='absolute top-1/4 right-3 cursor-pointer' />
						) : (
							<PiEyeClosedBold
								onClick={() => setNewPassword(!newPassword)}
								size={22} className='absolute top-1/4 right-3 cursor-pointer' />
						)
					}
					<p className='text-sm w-fit text-red-400 absolute top-12 left-1/4'>{errors.password?.message}</p>

				</div>
				<div className="flex justify-between items-center relative">
					<label htmlFor="" className='w-1/4 font-medium'>Confirm New Password</label>
					<input type={`${!confirmPassword ? "password" : "text"}`} {...register("passwordConfirm")} className='w-3/4 rounded-md px-3 py-2 text-black' />
					{
						!confirmPassword ? (
							<PiEyeBold
								onClick={() => setConfirmPassword(!confirmPassword)}
								size={22} className='absolute top-1/4 right-3 cursor-pointer' />
						) : (
							<PiEyeClosedBold
								onClick={() => setConfirmPassword(!confirmPassword)}
								size={22} className='absolute top-1/4 right-3 cursor-pointer' />
						)
					}
					<p className='text-sm w-fit text-red-400 absolute top-12 left-1/4'>{errors.passwordConfirm?.message}</p>

				</div>
			</div>
			<button
				type="submit"
				className='w-fit bg-primary-main px-8 py-2 mt-10 text-white hover:bg-primary-800 cursor-pointer transition-all rounded-md'> Submit
			</button>
		</form>
	)
}

export default ChangePasswordProfile