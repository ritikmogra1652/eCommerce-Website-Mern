import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IProduct, IReview } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Rating } from 'react-simple-star-rating';
import "./Review.css";
import { toastMessageError, toastMessageSuccess } from './CommonToastMessage';

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
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [rating, setRating] = useState<number>(0);
    const location = useLocation();
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = 'Bearer ' + jwtToken;

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
                setReviews(response.data.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchProduct();
        fetchReviews();
        setLoading(false);
    }, [location.state.productId]);

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
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
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Reviews </h1>
            <div className="review-page">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={product?.images[0].imageUrl} alt="" />
                    <h1>{product?.product_name}</h1>
                    {/* <h2>{product?.description}</h2> */}
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
                                {/* {errors.rating && <p>{errors.rating.message}</p>} */}
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
            <div className="reviews-list">
                <h2>Existing Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        review.comment ? (
                            <div key={review._id} className="review-item">
                                {/* <div className="review-rating">
                                    Rating: {review.rating} {review.rating === 1 ? 'Star' : 'Stars'}
                                </div> */}
                                <div className="review-text">{review.comment}</div>
                            </div>
                        ) : null
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div></>

    );
};

export default Review;
