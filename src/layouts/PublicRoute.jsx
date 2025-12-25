// Import the 'Navigate' component from the 'react-router-dom' library.
import { Navigate } from 'react-router-dom';

// Import the 'useAuthStore' function from a custom 'auth' store.
import { useAuthStore } from '../store/auth';

// Define the 'PublicRoute' component as a functional component that takes 'children' as a prop.
// This component prevents authenticated users from accessing public pages (like login/signup)
const PublicRoute = ({ children }) => {

    // Use the 'useAuthStore' hook to check the user's authentication status.
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

    // Conditionally render the children if the user is NOT authenticated.
    // If the user is already authenticated, redirect them to the dashboard.
    return !isLoggedIn ? <>{children}</> : <Navigate to="/dashboard/" replace />;
};

// Export the 'PublicRoute' component to make it available for use in other parts of the application.
export default PublicRoute;
