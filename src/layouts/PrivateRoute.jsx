// Import the 'Navigate' component from the 'react-router-dom' library.
import { Navigate } from 'react-router-dom';

// Import the 'useAuthStore' function from a custom 'auth' store.
import { useAuthStore } from '../store/auth';

// Import Cookies to check for valid tokens
import Cookies from 'js-cookie';

// Define the 'PrivateRoute' component as a functional component that takes 'children' as a prop.
const PrivateRoute = ({ children }) => {

    // Use the 'useAuthStore' hook to check the user's authentication status.
    // isLoggedIn is a function in the store, so we call it to get the boolean result
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
    
    // Check if access token exists in cookies
    const accessToken = Cookies.get('access_token');

    // Conditionally render the children if the user is authenticated AND has a valid token.
    // If the user is not authenticated or no token exists, redirect them to the login page.
    return (isLoggedIn && accessToken) ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

// Export the 'PrivateRoute' component to make it available for use in other parts of the application.
export default PrivateRoute;
