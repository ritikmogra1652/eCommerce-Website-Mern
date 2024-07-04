import  { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import {  useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import { bindActionCreators } from 'redux';
import { updateAuth } from '../../state_management/actions/authAction';

const schema = yup.object({
    username: yup.string().required("User name is required"),
    phone: yup.string().min(10, "Phone number must have 10 digits").max(10, "Phone number can have at most 10 digits").required('Phone number is required').matches(/^\d+$/, 'Invalid phone number'),
    password: yup.string()
        .optional()
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
});


interface FormFields {
    username: string,
    phone: string,
    password?: string,
}
export interface UserProfile {
    username: string;
    phone: string;
    password?: string;
}


const EditProfile = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const [profile, setProfile] = useState < UserProfile |null  >(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit,reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });
    const AuthStr = 'Bearer ' + jwtToken;
    const actions = bindActionCreators(
        {
            updateAuth,
        },
        dispatch
    );
    const fetchProfile = async () => {
        try {

            const response = await axios.get(
                `${backendApiUrl}${endPoints.MY_PROFILE}`,
                {
                    headers: {
                        Authorization: AuthStr,
                    },
                }
            );
            console.log(response.data?.data);

            setProfile(response.data?.data);
            reset(response.data?.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };
    

    
    useEffect(() => {
        fetchProfile();
    }, [reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            await axios.patch(`${backendApiUrl}${endPoints.UPDATE_MYPROFILE}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: AuthStr,
                    },
                }
            );
            toastMessageSuccess("Profile updated successfully");
            actions.updateAuth( data.username);
            
            navigate(routes.MYPROFILE);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div>
            <h2>Edit Profile</h2>
            {profile ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label  htmlFor="username">Username</label>
                        <input  {...register("username")} type="text" id="username" name="username" defaultValue={profile.username} />
                        {errors.username && (<p>{errors.username.message}</p>)}
                    </div>
                    <div>
                        <label  htmlFor="phone">Phone Number</label>
                        <input type="text" {...register('phone')} id="phone" defaultValue={profile.phone} />
                        {errors.phone && <p>{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label  htmlFor="password">Password</label>
                        <input  {...register("password")} type="password" id="password" name="password" />
                        {errors.password && (<p>{errors.password.message}</p>)}
                    </div>
                    {/* <div>
                        <label htmlFor="profileImage">Profile Image</label>
                        <input  {...register("profileImage")} type="file" id="profileImage" name="profileImage" accept='image/*' defaultValue={profile.profileImage}/>
                        {errors.profileImage && (<p>{errors.profileImage.message}</p>)}
                    </div> */}
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditProfile;
