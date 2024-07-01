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
const schema = yup.object({
    email: yup.string().email("Email format is not valid").required("Email is Required"),
    password: yup.string().required().min(8, "8 charaters are required"),
})

type FormFields = {
    email: string,
    password: string
}

const Login = () => {

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

        const response =  await axios.post(
            `${backendApiUrl}${endPoints.ADMIN_LOGIN}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        

        const userDetails = response?.data?.data?.user;
        const token = response?.data?.data?.token;


        const authData: IUserData = {
            username:userDetails.username,
            email: userDetails.email,
            jwtToken: token,
        };
        
        

        actions.logInAction(authData)
        navigate(routes.ADMIN_DASHBOARD);
    }
    return (
        <div>
            <h1>Login </h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="email">Email</label>
                <input {...register("email")} type="email" id="email" name="email" />

                <p>{errors.email && (<div>{errors.email.message}</div>)}</p>

                <label htmlFor="password">Password</label>
                <input {...register("password")} type="password" id="password" name="password" />

                <p>{errors.password && (<div>{errors.password.message}</div>)}</p>

                <button>Submit</button>
            </form>
        </div>
    )
}

export default Login;