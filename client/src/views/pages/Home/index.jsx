import React, { useEffect, useState } from 'react';
import Axios from '../../../api/index';
import Post from '../../../components/Post/Post';
import { ScrollRestoration,} from 'react-router-dom';
import { usePostContext } from '../../../hooks/usePostContext'
const Index = () => {
	const [state, dispatch] = usePostContext()
	const [isLoading, setIsLoading] = useState(state.isLoading)
	useEffect(() => {
		setIsLoading(state.isLoading)
	}, [state.isLoadingEdit, state.isCancelOrder, state.isLoadingHistoryConfirm,state.isReport, isLoading])
	return (
		<>
			<div className="p-[25px] lg:px-[150px] xl:px-[250px] 2xl:px-[400px] mx-auto lg:flex justify-center items-start gap-5">
				{
					state.isLoading ? (
						<div className="w-full h-screen flex justify-center items-center">
						</div>
					) : (
						<>
							<div className="post-list flex-1">
								{state.posts.map((post) => (
									<Post key={post.id} post={post} />
								))}
							</div>
						</>
					)
				}
				<ScrollRestoration getKey={location => {
					return location.pathname
				}} />
			</div >
		</>
	);
};
export const AllPostLoader = async () => {
	try {
		const response = await Axios.get("/api/v1/posts?filter=equals(status,'Unconfirmed')&include=userPostData&sort=-createdAt");
		return response.data.data; // Removed the extra ".data" and ".data"
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error; // Re-throw the error to handle it further up the call stack
	}
};

export default Index;
