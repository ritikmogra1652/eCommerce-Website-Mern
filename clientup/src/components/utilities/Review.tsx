import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IProduct, IReviewData } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Rating } from 'react-simple-star-rating';
import "./Review.css";
import { toastMessageError, toastMessageSuccess } from './CommonToastMessage';
import routes from '../../constants/routes';
import Loader from '../../commonComponenets/Loader';

const schema = yup.object().shape({
    // rating: yup.number().min(0).max(5).required('Rating is required'),
    comment: yup.string().max(255),
});

interface FormFields {
    // rating: number,
    comment?: string
}

const Review: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [reviews, setReviews] = useState<IReviewData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [rating, setRating] = useState<number>(0);
    const location = useLocation();
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = 'Bearer ' + jwtToken;
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            // rating: 0,
            comment: '',
        },
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${backendApiUrl}${endPoints.GET_PRODUCT}/${location.state.productId}`);
                setProduct(response.data.data);
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${backendApiUrl}${endPoints.GET_REVIEW}/${location.state.productId}`, {
                    headers: {
                        Authorization: AuthStr,
                    },
                });
                console.log(response.data.data);
                
                setReviews(response.data.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchProduct();
        fetchReviews();
        setLoading(false);
    }, [location.state.productId]);


    const averageRating =  reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        if (!jwtToken) { navigate(routes.LOGIN) }
        try {
            const res = await axios.post(`${backendApiUrl}${endPoints.ADD_REIVEW}/${location.state.productId}`, {
                productId,
                comment: data.comment,
                rating: rating,
            }, {
                headers: {
                    Authorization: AuthStr,
                },
            });
            toastMessageSuccess(res.data.message);
            reset({});
            setRating(0);

            const response = await axios.get(`${backendApiUrl}${endPoints.GET_REVIEW}/${location.state.productId}`, {
                headers: {
                    Authorization: AuthStr,
                },
            });
            setReviews(response.data.data);
        } catch (err: any) {
            toastMessageError(err.response.data.message);
            reset();
            setRating(0);

        }
    };

    const handleRating = (rate: number) => {
        setRating(rate);
    };

    if (loading) {
        <Loader />;
    }

    return (
        <>
            <h1>Reviews</h1>
            <div className="review-page">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={product?.images[0].imageUrl} alt="" />
                    <h1>{product?.product_name}</h1>
                </div>
                <div>
                    <div className="review-form">
                        <h2>Leave a Review</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor='rating'>Rating</label>
                                <Rating
                                    onClick={handleRating}
                                    initialValue={rating}
                                    size={50}
                                    allowFraction={true}
                                    transition
                                    fillColor='orange'
                                    emptyColor='gray'
                                    className='foo'
                                />
                            </div>

                            <div>
                                <label htmlFor="comment">Comment</label>
                                <textarea {...register('comment')} id="comment" name="comment" />
                                {errors.comment && <p>{errors.comment.message}</p>}
                            </div>
                            <button type="submit">Submit Review</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='rating and review'>
                <div className='average-rating'>
                    <h2>Average Rating</h2>
                    <Rating
                        initialValue={averageRating}
                        size={25}
                        allowFraction={true}
                        readonly={true}
                        transition
                        fillColor='orange'
                        emptyColor='gray'
                    />
                </div>
                <div className="reviews-list">

                    <div>
                        <h2>Reviews</h2>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                review.comment ? (
                                    <div key={review._id} className="review-item">
                                        <div style={{float: 'left',margin:'auto'}}>
                                            <img src={review.user?.profileImage} alt="" />
                                        </div>
                                        <div>
                                            <p className="review-text">{review.user?.username}</p>
                                            <Rating
                                                initialValue={review.rating}
                                                size={18}
                                                allowFraction={true}
                                                readonly={true}
                                                transition
                                                fillColor='orange'
                                                emptyColor='gray'
                                            />
                                            <div className="review-text">{review.comment}</div>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Review;
