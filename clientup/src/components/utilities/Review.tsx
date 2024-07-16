import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IProduct, IReview } from '../../interface/commonInterfaces';
// import './ReviewPage.css';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';

const Review: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [newReview, setNewReview] = useState<string>('');
    const [rating, setRating] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = 'Bearer ' + jwtToken;

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
                const response = await axios.get(`${backendApiUrl}${endPoints.GET_REVIEW}/${location.state.productId}`);
                setReviews(response.data.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchProduct();
        fetchReviews();
        setLoading(false);
    }, [location.state.productId]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${backendApiUrl}${endPoints.ADD_REIVEW}/${location.state.productId}`, {
                productId,
                comment: newReview,
                rating,
            }, {
                headers: {
                    Authorization: AuthStr,
                },
            });
            setNewReview('');
            setRating(1);
           
            
            const response = await axios.get(`${backendApiUrl}${endPoints.GET_REVIEW}/${location.state.productId}`);
            setReviews(response.data.data);
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="review-page">
            <h1>Reviews for {product?.product_name}</h1>
            <div className="review-form">
                <h2>Leave a Review</h2>
                <form onSubmit={handleSubmitReview}>
                    <label>
                        Rating:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>
                                    {star} {star === 1 ? 'Star' : 'Stars'}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Review:
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            rows={4}
                            required
                        />
                    </label>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
            <div className="reviews-list">
                <h2>Existing Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-rating">Rating: {review.rating} {review.rating === 1 ? 'Star' : 'Stars'}</div>
                            <div className="review-text">{review.comment}</div>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default Review;
