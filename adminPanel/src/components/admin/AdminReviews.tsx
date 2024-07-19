import React, { useEffect, useState } from 'react';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import "./AdminReviews.css";
import { IReviewWithDetails } from '../../interface/commonInterfaces';
import { Rating } from 'react-simple-star-rating';
import { toastMessageError, toastMessageSuccess } from '../utilities/CommonToastMessage';
import Loader from '../../commonComponents/Loader';

const AdminReview: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [reviews, setReviews] = useState<IReviewWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = 'Bearer ' + jwtToken;
    const location = useLocation();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_GET_REVIEWS}/${location.state.id}`, {
                    headers: {
                        Authorization: AuthStr,
                    },
                });
                setReviews(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, AuthStr, location.state.id]);

    const handleStatusChange = async (reviewId: string, newStatus: "approved" | "rejected") => {
        try {
            const response = await axios.patch(
                `${backendApiUrl}${endPoints.ADMIN_UPDATE_REVIEW_STATUS}/${reviewId}`,
                { status: newStatus },
                { headers: { Authorization: AuthStr } }
            );
            toastMessageSuccess(response.data.message);
            setReviews(prevReviews =>
                prevReviews.map(review =>
                    review._id === reviewId ? { ...review, status: newStatus } : review
                )
            );
        } catch (err: any) {
            toastMessageError(err.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="admin-review-page">
            <h1>Admin Reviews For {reviews.length > 0 && reviews[0]?.product.product_name}</h1>
            <table className="reviews-table">
                <thead>
                    <tr>
                        <th>User Email</th>
                        <th>Username</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        {/* <th>Product</th> */}
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <Loader />
                    ) :(
                    reviews.length > 0 ? (
                        reviews.map((review) => (
                            <tr key={review._id}>
                                <td>{review.user?.email}</td>
                                <td>{review.user?.username}</td>
                                <td>
                                    <Rating
                                        initialValue={review.rating}
                                        size={18}
                                        allowFraction={true}
                                        readonly={true}
                                        transition
                                        fillColor='orange'
                                        emptyColor='gray'
                                    />
                                </td>
                                <td>{review.comment}</td>
                                {/* <td>{review.product?.product_name}</td> */}
                                <td>
                                    <select
                                        value={review.status}
                                        onChange={(e) => handleStatusChange(review._id, e.target.value as "approved" | "rejected")}
                                    >
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No reviews yet.</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminReview;
