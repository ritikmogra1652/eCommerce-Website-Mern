import { useEffect, useState } from 'react';
import axios from 'axios';
import { toastMessageSuccess, toastMessageError } from '../utilities/CommonToastMessage';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import './AdminUserList.css';

interface IUser {
    _id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    isActivated: boolean;
    profileImage?: string;
}

const AdminUserList = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_GET_USERS}`, {
                headers: {
                    Authorization: AuthStr,
                },
            });
            if (response?.data?.data) {
                setUsers(response.data.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatusChange = async (userId: string, isActive: boolean) => {
        const newStatus = !isActive;
        const confirmMessage = `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this user?`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            const response = await axios.put(
                `${backendApiUrl}${endPoints.ADMIN_UPDATE_USER_STATUS}`,
                { userId, status: newStatus },
                {
                    headers: {
                        Authorization: AuthStr,
                    },
                }
            );
            
            
            if (response.data.success) {
                toastMessageSuccess('User status updated successfully');
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, isActivated: newStatus } : user
                    )
                );
            } else {
                toastMessageError(response.data.message || 'Failed to update user status');
            }
        } catch (error: any) {
            console.error('Error updating user status:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toastMessageError(error.response.data.message);
            } else {
                toastMessageError('Failed to update user status');
            }
        }
    };

    if (loading) return <p className="admin-user-list-loading">Loading...</p>;
    if (error) return <p className="admin-user-list-error">{error}</p>;

    return (
        <div className="admin-user-list-container">
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Action</th>
                        
                        <th>Profile Image</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.isActivated ? 'Activated' : 'DeActivated'}</td>
                            <td>
                                <button onClick={() => handleUserStatusChange(user._id, user.isActivated)} disabled={loading}>
                                    {user.isActivated ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                            <td>
                                <img
                                    src={user.profileImage || ''}
                                    alt={`${user.username}'s profile`}
                                    className="profile-image"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;
