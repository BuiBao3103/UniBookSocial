import { createBrowserRouter } from 'react-router-dom';
import Login from '../views/auth/Login';
import DefaultLayout from '../views/layout/DefaultLayout';
import Dashboard from '../views/layout/Dashboard';
import Home from '../views/pages/Home';
import SignUp from '../views/auth/SignUp';
import Profile, { AllReviewLoader } from '../views/pages/Profile';
import NotFound from '../views/pages/PageNotFound';
import ForgotPassword from '../views/auth/forgotPassword/ForgotPassword';
import Search from '../views/pages/Search';
import Users from '../views/pages/Users/Users';
import Statistics from '../views/pages/Statistics';
import Posts from '../views/pages/Posts/Posts';
import DetailPost from '../components/Post/DetailPost';
import { AllPostLoader } from '../views/pages/Home';
import { About, HistoryConfirm, HistoryPost, Review } from '../views/pages/Profile/ProfileItem';
import PageNotFound from '../views/pages/PageNotFound'
const router = createBrowserRouter([
	{
		path: '/',
		element: <DefaultLayout />,
		children: [
			{
				path: '/',
				element: <Home />,
				loader: AllPostLoader,
				errorElement: <PageNotFound />
			},
			{
				path: '/profile/:id',
				element: <Profile />,
				loader: AllReviewLoader,
				errorElement: <PageNotFound />,
				children: [
					{
						index: true,
						element: <About />,
					},
					{
						path: 'historyPost',
						element: <HistoryPost />,
					},
					{
						path: 'historyConfirm',
						element: <HistoryConfirm />,
					},
					{
						path: 'review',
						element: <Review />,
					},
				],
			},
			{
				path: '/search',
				element: <Search />,
			},
		],
	},
	{
		path: '/dashboard',
		element: <Dashboard />,
		errorElement: <PageNotFound />,
		children: [
			// {
			//     path: '/dashboard',
			//     element: <HomeAdmin />,
			// },
			{
				path: 'users',
				element: <Users />,
			},
			{
				path: 'posts',
				element: <Posts />,
			},
			{
				path: 'statistics',
				element: <Statistics />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
		errorElement: <NotFound />,
	},
	{
		path: '/forgotpassword',
		element: <ForgotPassword />,
		errorElement: <NotFound />,
	},
	{
		path: '/signup',
		element: <SignUp />,
		errorElement: <NotFound />,
	},
	{
		path: '/detailPost/:id',
		element: <DetailPost />,
		errorElement: <NotFound />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

export default router;
