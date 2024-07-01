import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import routes from '../../constants/routes';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
// import "./Login.css";
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

const schema = yup.object({
    username: yup.string().required("User name is required"),
    email: yup.string().email("Email format is not valid").required("Email is required"),
    phone: yup.string().min(10, "Phone number must have 10 digits").max(10, "Phone number can have at most 10 digits").required('Phone number is required').matches(/^\d+$/, 'Invalid phone number'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    profileImage: yup.mixed<FileList>().required("Profile image is required")
});

interface FormFields {
    username: string,
    email: string,
    phone: string,
    password: string,
    profileImage: FileList
}

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });

    const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);

    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<FormFields> = async (data:FormFields) => {
        try {
            const profileImageFile = data.profileImage[0];
            if (profileImageFile) {
                const base64String: string = await convertToBase64(profileImageFile);
                setProfileImageBase64(base64String);
                
            }

            const formData = {
                ...data,
                profileImage: profileImageBase64,
            };
            
            await axios.post(
                `${backendApiUrl}${endPoints.SIGN_UP}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            navigate(routes.HOMEPAGE);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div>
            <h1>Sign Up</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username">username</label>
                <input {...register("username")} type="text" id="username" name="username" />
                <p>{errors.username && (<div>{errors.username.message}</div>)}</p>

                <label htmlFor="phone">Phone Number</label>
                <input type="text" {...register('phone')} />
                <p>{errors.phone && <span>{errors.phone.message}</span>}</p>

                <label htmlFor="email">Email</label>
                <input {...register("email")} type="email" id="email" name="email" />
                <p>{errors.email && (<div>{errors.email.message}</div>)}</p>

                <label htmlFor="password">Password</label>
                <input {...register("password")} type="password" id="password" name="password" />
                <p>{errors.password && (<div>{errors.password.message}</div>)}</p>

                <label htmlFor="profileImage">Profile Image</label>
                <input {...register("profileImage")} type="file" id="profileImage" name="profileImage" accept='image/*' />
                <p>{errors.profileImage && (<div>{errors.profileImage.message}</div>)}</p>

                <button>Submit</button>
            </form>

            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default SignUp;
