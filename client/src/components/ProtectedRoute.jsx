import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the user is logged in
    const userId = localStorage.getItem('userId');

    // If no userId, send them back to the Login page
    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, show the Dashboard!
    return children;
};

export default ProtectedRoute;