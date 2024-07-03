import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as yup from 'yup';
import { IRootState } from '../../state_management/reducers/authReducer';
import routes from '../../constants/routes';

// Define Yup validation schema
const schema = yup.object().shape({
    fullName: yup.string()
        .min(3, "Full name must be at least 3 characters")
        .required("Full name is required"),
    email: yup.string()
        .email("Invalid email format")
        .required("Email is required"),
});

const UpdateUser: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, email, fullName } = useSelector((state: IRootState) => state.userProfile);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {

        setValue("fullName", fullName);
        setValue("email", email);
    }, [email, fullName, setValue]);

    const onSubmit = async (data: unknown) => {
        try {
            const responce = await axios.patch(`http://localhost:3002/api/v1/user/update-profile`, data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const update_data = responce.data.data
            update_data.token = token;
            dispatch(UpdateProfile(update_data))
            navigate(routes.MYPROFILE);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div>
            <h2>Update User Data</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row-data">
                    <label>Email:</label>
                    <input
                        type="email"
                        {...register("email")}
                        disabled
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div className="row-data">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        {...register("fullName")}
                    />
                    {errors.fullName && <p>{errors.fullName.message}</p>}
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UpdateUser;