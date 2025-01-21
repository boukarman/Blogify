import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorPage from './pages/ErrorPage'
import PostDetail from './pages/PostDetail'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import Authors from './pages/Authors'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import DeletePost from './pages/DeletePost'
import CategoryPosts from './pages/CategoryPosts'
import AuthorPosts from './pages/AuthorPosts'
import Dashboard from './pages/Dashboard'
import Logout from './pages/Logout'
import './index.css'
import UserProvider from './context/userContext'
import ProtectedRoute from './protected-route/ProtectedRoute.jsx'


const router = createBrowserRouter([
	{
		path: '/',
		element: <UserProvider><Layout /></UserProvider>,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Home />, },
			{ path: 'posts/:id', element: <PostDetail />, },
			{ path: 'register', element: <Register />, },
			{ path: 'login', element: <Login /> },
			{ path: 'profile/:id', element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
			{ path: 'authors', element: <Authors /> },
			{ path: 'create', element: <ProtectedRoute><CreatePost /></ProtectedRoute> },
			{ path: 'posts/:id/edit', element: <ProtectedRoute><EditPost /></ProtectedRoute> },
			{ path: 'posts/:id/delete', element: <ProtectedRoute><DeletePost /></ProtectedRoute> },
			{ path: 'posts/categories/:category', element: <CategoryPosts /> },
			{ path: 'posts/users/:id', element: <AuthorPosts /> },
			{ path: 'myposts/:id', element:<ProtectedRoute><Dashboard /></ProtectedRoute>  },
			{ path: 'logout', element: <Logout /> },
		]
	}
])
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
