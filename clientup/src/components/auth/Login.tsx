import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
// import "./Login.css";
import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getProfile } from '../state_management/Actions/actions';
import routes from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { IUserData } from '../../interface/commonInterfaces';
import { logInAction } from '../../state_management/actions/authAction';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
const schema = yup.object({
    email: yup.string().email("Email format is not valid").required("Email is Required"),
    password: yup.string().required().min(8, "8 charaters are required"),
})

type FormFields = {
    email: string,
    password: string
}

const Login = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const actions = bindActionCreators(
        {
            logInAction,
        },
        dispatch
    );

    const onSubmit: SubmitHandler<FormFields> = async (data:FormFields) => {

        try {
            const response = await axios.post(
                `${backendApiUrl}${endPoints.LOGIN}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const userDetails = response?.data?.data?.userExists;
            const token = response?.data?.data?.token;
            const authData: IUserData = {
                username: userDetails.username,
                email: userDetails.email,
                role: userDetails.role,
                jwtToken: token,
            };
            actions.logInAction(authData)
            navigate(routes.HOMEPAGE);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setErrorMessage("Invalid email or password. Please try again.");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    }
    return (
        <div className="container">
            <h1>Login </h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="email">Email</label>
                <input {...register("email")} type="email" id="email" name="email" />

                <p className="error-message">{errors.email && (<div>{errors.email.message}</div>)}</p>

                <label htmlFor="password">Password</label>
                <input {...register("password")} type="password" id="password" name="password" />

                <p className="error-message">{errors.password && (<div>{errors.password.message}</div>)}</p>
                {errorMessage && <p className="error-message">{errorMessage}</p>} 
                <button>Submit</button>
            </form>
        </div>
    )
}

export default Login;