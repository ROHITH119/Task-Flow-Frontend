import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children, allowedRoles}) => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    if(!token) {
        return <Navigate to="/" replace/>
    }

    if(allowedRoles && !allowedRoles.includes(user?.role)) {
        if(user?.role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace/>
        } else {
            return <Navigate to="/member/tasks" replace/>
        }
    }

    return children;
}

export default ProtectedRoute



