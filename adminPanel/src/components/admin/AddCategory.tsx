import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from 'react';
import axios from "axios";
import routes from '../../constants/routes';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import "./AddCategory.css"
import { toastMessageSuccess } from '../utilities/CommonToastMessage';

const schema = yup.object({
    categoryName: yup.string().required("Category name is required").trim(),
});

interface FormFields {
    categoryName: string,
}

const AddCategory = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit,reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            await axios.post(
                `${backendApiUrl}${endPoints.ADMIN_ADD_CATEGORY}`,
                data,
                {
                    headers: {
                        Authorization: AuthStr,
                    },
                }
            );

            navigate(routes.ADMIN_ADD_PRODUCTS);
            toastMessageSuccess("Category added successfully");
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setErrorMessage("Category Already Registered");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className="add-category-container">
            <h1 className="add-category-title">Add Category</h1>
            <form className="add-category-form" onSubmit={handleSubmit(onSubmit)}>
                <label className="add-category-label" htmlFor="categoryName">Category</label>
                <input {...register("categoryName")} type="text" id="categoryName" className="add-category-input" name="categoryName" />
                {errors.categoryName && (<p className="add-category-error">{errors.categoryName.message}</p>)}

                {errorMessage && <p className="add-category-error">{errorMessage}</p>}

                <button type="submit" className="add-category-submit">Submit</button>
            </form>
        </div>
    );
}

export default AddCategory;
