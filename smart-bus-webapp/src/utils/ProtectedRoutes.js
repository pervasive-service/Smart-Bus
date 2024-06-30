import React from "react";
import { Navigate, useOutletContext, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const ProtectedRoute = ({ children }) => {
	const context = useAuth();
	console.log(context)
  //  || !context.roles.includes(role)
	if (!context.authToken) {
		return <Navigate to="/login" replace />;
	}

  return children;
	// return <Outlet context={context}/>;
};

export default ProtectedRoute;
