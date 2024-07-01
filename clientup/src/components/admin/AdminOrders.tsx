import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './AdminOrders.css';

interface ProductItem {
  product_name: string;
  product_quantity: number;
}

interface Order {
  order_id: string;
  user_name: string;
  products: ProductItem[];
  status: 'Pending' | 'Shipped' | 'Delivered';
  created_at: string;
}

const AdminOrders: React.FC = () => {
  const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const AuthStr = 'Bearer '.concat(jwtToken as string);
      const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_GET_ORDERS}`, {
        headers: {
          Authorization: AuthStr,
        },
      });

      if (response?.data?.data) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [jwtToken]);

  if (loading) return <p className="admin-orders-loading">Loading...</p>;
  if (error) return <p className="admin-orders-error">{error}</p>;

  return (
    <div className="admin-orders-container">
      <h2>Admin Orders</h2>
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Items</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.user_name}</td>
              <td>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.product_name} (Quantity: {product.product_quantity})
                    </li>
                  ))}
                </ul>
              </td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
