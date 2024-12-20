import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management/index';
import routes from '../../constants/routes';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { Link } from 'react-router-dom';
import './MyProfile.css'; // Import the CSS file
import { useForm } from 'react-hook-form';

interface UserProfile {
    username: string;
    email: string;
    phone: string;
    profileImage: string;
}

const MyProfile: React.FC = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer?.authData?.jwtToken);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const AuthStr = 'Bearer ' + jwtToken;
            await axios.post(
                `${backendApiUrl}${endPoints.REQUEST_MEETING}`,
                data,
                { headers: { Authorization: AuthStr } }
            );
            alert('Meeting request submitted!');
            setModalOpen(false); // Close the modal after successful submission
        } catch (error) {
            alert('Failed to request meeting');
        }
    };

    

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const AuthStr = 'Bearer ' + jwtToken;
                const response = await axios.get(
                    `${backendApiUrl}${endPoints.MY_PROFILE}`,
                    {
                        headers: {
                            Authorization: AuthStr,
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

        if (jwtToken) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [jwtToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <div className="profile-details">
                <img src={userProfile?.profileImage} alt="Profile" />
                <p><strong>Name:</strong> {userProfile?.username}</p>
                <p><strong>Email:</strong> {userProfile?.email}</p>
                <p><strong>Phone:</strong> {userProfile?.phone}</p>
            </div>
            <div>
                <Link to={routes.EDIT_PROFILE}>Edit Profile</Link>
            </div>
            <div>
                <Link to={routes.UPDATE_PASSWORD}>UPDATE PASSWORD</Link>
            </div>
            <div>
                <button onClick={() => {setModalOpen(true)}}>Request a Meet</button>
            </div>


            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <h3>Request a Meeting</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="text"
                                placeholder="User ID"
                                {...register("userId", { required: "User ID is required" })}
                            />
                            {/* {errors.userId && <span>{errors?.userId?.message}</span>} */}

                            <input
                                type="text"
                                placeholder="Topic"
                                {...register("topic", { required: "Meeting topic is required" })}
                            />
                            {/* {errors.topic && <span>{errors.topic.message}</span>} */}

                            <input
                                type="datetime-local"
                                {...register("start_time", { required: "Start time is required" })}
                            />
                            {/* {errors.start_time && <span>{errors.start_time.message}</span>} */}

                            <input
                                type="number"
                                placeholder="Duration (minutes)"
                                {...register("duration", { required: "Duration is required" })}
                            />
                            {/* {errors.duration && <span>{errors.duration.message}</span>} */}

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyProfile;
