import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);
    const location = useLocation();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${location.pathname}`} />;
    }

    if (isAdmin && user.role !== "admin") {
        return <Navigate to="/account" />;
    }

    return children;
};

export default ProtectedRoute;
