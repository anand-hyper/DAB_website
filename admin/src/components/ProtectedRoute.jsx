// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

export const AdminRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  
  if (!aToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const DoctorRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext);
  
  if (!dToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};