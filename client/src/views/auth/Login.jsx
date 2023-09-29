import { useState } from 'react'
import { LoginImg } from '../../assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'
import { FcGoogle } from 'react-icons/fc'
import { slideUpLogin } from './animation'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import ForgotPassword from './forgotPassword/ForgotPassword'
const Login = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [isVisibleForgot, setIsVisibleForgot] = useState(false)
	const validationSchema = Yup.object().shape({
		email: Yup.string().lowercase().trim().email("Invalid email format").required("Please enter your email"),
		password: Yup
			.string()
			.required("Please enter your password")
			.matches(
				/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
				"Password must contain at least 8 characters, one uppercase, one number and one special case character. Ex(John123@)"
			),
	});
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			email: "",
			password: ""
		},
		resolver: yupResolver(validationSchema),
	})


	const onSubmit = (data) => {
		console.log("Form submitted", data)
	}

	return (
		<>
			<section
				className='w-full h-screen flex justify-center items-center bg-gray-100'>
				<motion.div
					variants={slideUpLogin}
					initial="initial"
					animate="animate"
					exit={"exit"}
					className="w-full md:flex bg-white shadow-lg rounded-2xl h-[630px] md:mx-16 xl:m-0 max-w-lg md:max-w-7xl overflow-hidden">
					<div className={`w-full md:w-1/2 xl:w-[40%] py-16 px-8 md:p-16 text-primary-main transition-all duration-1000 relative`}>
						<p className='  font-bold text-4xl'>Login</p>
						<form onSubmit={handleSubmit(onSubmit)} className='mt-3'>
							<div className="flex flex-col mb-3">
								<label htmlFor="email" className='font-semibold mb-1'>Email</label>
								<input type="text" id="email" {...register("email")}
									className='border border-primary-900 rounded-md text-primary-main placeholder:text-primary-700 placeholder:text-sm px-4 py-2 w-full focus:ring-1 focus:shadow-md focus:outline-none ring-primary-900' placeholder='Enter your email' />
							</div>
							<div className="flex flex-col relative">
								<label htmlFor="password" className='font-semibold mb-1'>Password</label>
								<input type={`${!showPassword ? "password" : "text"}`} id="password" {...register("password")}
									className='border border-primary-900 rounded-md text-primary-main placeholder:text-primary-700 placeholder:text-sm px-4 py-2 w-full' placeholder='Enter your password' />
								{
									!showPassword ? (
										<PiEyeBold
											onClick={() => setShowPassword(!showPassword)}
											size={22} className='absolute top-[55%] right-3 cursor-pointer' />
									) : (
										<PiEyeClosedBold
											onClick={() => setShowPassword(!showPassword)}
											size={22} className='absolute top-[55%] right-3 cursor-pointer' />
									)
								}
							</div>
							<div className="flex justify-between items-center my-6">
								<div className="flex items-center gap-2">
									<input type="checkbox" name="" id="remember-me" className='w-fit checked:ring-2 ring-offset-2 ring-primary-main' />
									<label htmlFor="remember-me">Remember me</label>
								</div>
								<Link
									to={"/forgotpassword"}
									onClick={() => {
										setIsVisibleForgot(!isVisibleForgot)
									}}
									className='underline-offset-2 underline'
								>Forgot Password?</Link>
							</div>
							<button
								type="submit"
								onClick={() => {
									toast.error(errors.email?.message)
									toast.error(errors.password?.message)
								}}
								className='w-full py-3 px-14 font-semibold rounded-lg bg-primary-main border transition-all duration-300 border-primary-main hover:bg-transparent hover:text-primary-main text-white'>
								Login
							</button>
							<div className="flex my-4">
								<span className='font-semibold text-black'>Not register yet?</span>
								<Link
									to={"/signup"}
									className='ml-1 font-semibold text-primary-main hover:underline underline-offset-2'>Create an account</Link>
							</div>
							<div className="flex flex-col justify-center items-center gap-3 mt-2 w-full">
								<p className='text-black'>Or, login with</p>
								<Link
									className='w-full px-4 py-2 border border-primary-900 rounded-lg
                                            transition-all hover:bg-primary-900 hover:text-white
                                            flex justify-center items-center gap-2 font-semibold
                                            '
								>
									<FcGoogle size={22} />
									Sign in with Google
								</Link>
							</div>
						</form>
					</div>
					<div className="hidden md:block md:w-1/2 xl:w-[60%] p-3 z-10">
						<img src={LoginImg} alt="" className='rounded-2xl w-full h-full xl:object-none object-cover' />
					</div>
				</motion.div>
			</section>
		</>
	)
}

export default Login
