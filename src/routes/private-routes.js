import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomToast from '../components/toast';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (!token) {
            CustomToast({ type: 'warning', message: 'Faça login para acessar esta página!' });
            setShowMessage(true);
        }
    }, [token]);

    if (showMessage) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
