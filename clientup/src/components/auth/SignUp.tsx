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
            
            const response = await axios.post(
                `${backendApiUrl}${endPoints.SIGN_UP}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            navigate(routes.HOMEPAGE);
            console.log('Server response:', response.data);
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


// import {  SubmitHandler, useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { Link } from 'react-router-dom';
// import { useState } from 'react';

// // Define yup schema for form validation
// const schema = yup.object({
//     userName: yup.string().required('User name is required'),
//     email: yup.string().email('Email format is not valid').required('Email is required'),
//     phoneNumber: yup.string().min(10, 'Phone number must have 10 digits').max(10, 'Phone number can have at most 10 digits').required('Phone number is required').matches(/^\d+$/, 'Invalid phone number'),
//     password: yup.string().required().min(8, '8 characters are required'),
//     profileImage: yup.mixed().test('fileSize', 'File size too large', (value) => {
//         if (!value) return true; // Allow null or undefined values
//         const file = value as FileList;
//         return file[0].size <= 2000000; // Validate file size (e.g., max 2MB)
//     }).test('fileType', 'Unsupported file format', (value) => {
//         if (!value) return true; // Allow null or undefined values
//         const file = value as FileList;
//         return file[0].type.includes('image'); // Validate file type (e.g., only images)
//     }).required('Profile image is required')
// });

// // Define type for form fields
// type FormFields = {
//     userName: string;
//     email: string;
//     phoneNumber: string;
//     password: string;
//     profileImage: FileList; // Ensure profileImage is typed as FileList or null
// };

// const SignUp = () => {
//     // Use useForm hook with resolver set to yupResolver(schema)
//     const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
//         resolver: yupResolver(schema) as never
//     });

//     // State to hold base64 string of profile image
//     const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);

//     // Form submit handler
//     const onSubmit: SubmitHandler<FormFields> = async (data) => {
//         const profileImageFile = data.profileImage ? data.profileImage[0] : null; // Get the first file from FileList if exists
//         if (profileImageFile) {
//             const base64String = await convertToBase64(profileImageFile);
//             setProfileImageBase64(base64String);
//         }

//         // Construct form data with base64 profile image
//         const formData = {
//             ...data,
//             profileImage: profileImageBase64, // Assign base64 string to profileImage
//         };

//         console.log(formData);
//     };

//     // Function to convert File to base64 string
//     const convertToBase64 = (file: File): Promise<string> => {
//         return new Promise<string>((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => resolve(reader.result as string);
//             reader.onerror = (error) => reject(error);
//         });
//     };

//     return (
//         <div>
//             <h1>Sign Up</h1>

//             <form onSubmit={handleSubmit(onSubmit)}>
//                 {/* Input fields for user details */}
//                 <label htmlFor="userName">UserName</label>
//                 <input {...register('userName')} type="text" id="userName" name="userName" />
//                 <p>{errors.userName && <div>{errors.userName.message}</div>}</p>

//                 <label htmlFor="phoneNumber">Phone Number</label>
//                 <input {...register('phoneNumber')} type="text" id="phoneNumber" name="phoneNumber" />
//                 <p>{errors.phoneNumber && <div>{errors.phoneNumber.message}</div>}</p>

//                 <label htmlFor="email">Email</label>
//                 <input {...register('email')} type="email" id="email" name="email" />
//                 <p>{errors.email && <div>{errors.email.message}</div>}</p>

//                 <label htmlFor="password">Password</label>
//                 <input {...register('password')} type="password" id="password" name="password" />
//                 <p>{errors.password && <div>{errors.password.message}</div>}</p>

//                 {/* Input field for profile image */}
//                 <label htmlFor="profileImage">Profile Image</label>
//                 <input {...register('profileImage')} type="file" id="profileImage" name="profileImage" accept="image/*" />
//                 <p>{errors.profileImage && <div>{errors.profileImage.message}</div>}</p>

//                 <button type="submit">Submit</button>
//             </form>

//             <p>Already have an account? <Link to="/login">Login</Link></p>
//         </div>
//     );
// };

// export default SignUp;
