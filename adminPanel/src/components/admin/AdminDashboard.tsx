import React, { useEffect, useState } from 'react'
import "./AdminDashboard.css";
import SalesOverview from './SalesOverview'
import ProductsOverview from './ProductsOverview';
import UsersOverview from './UsersOverview';
import OrdersOverview from './OrdersOverview';
import TopSellingProduct from './TopSellingProduct';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { IUserInfo } from '../../interface/commonInterfaces';
import { RootState } from '../../state_management';
import Loader from '../../commonComponents/Loader';


const AdminDashboard: React.FC = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = "Bearer " + jwtToken;
    const [loading, setLoading] = useState<boolean>(true);
    const [topCustomers, setTopCustomers] = useState<IUserInfo[]>([]);

    const fetchTopCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_TOP_CUSTOMERS}`, {
                headers: {
                    'Authorization': AuthStr
                }
            })
            console.log(response.data.data);
            
            setTopCustomers(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTopCustomers();
    }, []);
    return (
        <>
            <h1>Dashboard Overview</h1>
            <div className='dashboard-container'>
                <div className="dashboard-grid">
                    <div>
                        <SalesOverview />
                    </div>
                    <div>
                        <OrdersOverview />
                    </div>
                    <div>
                        <UsersOverview />
                    </div>
                    <div>
                        <ProductsOverview />
                    </div>
                </div>
                <div className='top-selling-product'>
                    <TopSellingProduct />
                </div>
            </div>
            <div className='user-info-table'>
                <h2>Top Customers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Profile Picture</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Total Orders</th>
                            <th>Total Revenue</th>
                            <th>Revenue Per Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6}><Loader/></td>
                            </tr>
                        ): topCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No data available</td>
                            </tr>
                            ) : (
                                topCustomers.map((user) => (
                                    <tr key={user._id}>
                                        <td><img src={user.userProfile} alt={user.username} /></td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.totalOrders}</td>
                                        <td>Rs {user.totalRevenue}</td>
                                        <td>Rs {user.totalRevenue / user.totalOrders}</td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        
        </>
    )
}

export default AdminDashboard
