import React, { useEffect, useState } from 'react';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import './AdminProfile.css'; 
import { RootState } from '../../state_management/index';


interface AdminProfile {
    admin: string;
    email: string;
    phone: string;
    profileImage: string;

}

const AdminProfile: React.FC = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const [userProfile, setUserProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        try {
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            const response = await axios.get(
                `${backendApiUrl}${endPoints.ADMIN_PROFILE}`,
                {
                    headers: {
                        "Authorization": AuthStr,
                    },
                }
            );
            
            const userDetails = response?.data?.data;
            setUserProfile(userDetails);
        } catch (error) {
            setError('Error fetching user profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }



    return (
        <div className="profile-container">
            <h2>Admin Profile</h2>
            {userProfile && (
                <div className="profile-details">
                    <img src={userProfile.profileImage} alt="" />
                    <p><strong>Name:</strong> {userProfile.admin}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Phone:</strong> {userProfile.phone}</p>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
