import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './AdminOrders.css';

interface ProductItem {
  product_name: string;
  product_quantity: number;
  product_price: number;
}

interface Order {
  order_id: string;
  user_name: string;
  products: ProductItem[];
  status: 'Pending' | 'Shipped' | 'Delivered';
  created_at: string;
  total: number;
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

  const updateOrderStatus = async (orderId: string, newStatus: 'Pending' | 'Shipped' | 'Delivered') => {
    try {
      const AuthStr = 'Bearer '.concat(jwtToken as string);
      await axios.patch(
        `${backendApiUrl}${endPoints.ADMIN_UPDATE_STATUS}/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status', err);
      setError('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [jwtToken]);

  if (loading) return <p className="admin-orders-loading">Loading...</p>;
  if (error) return <p className="admin-orders-error">{error}</p>;

  if (!orders || orders.length === 0) {
    return (
      <>
        <h2>Admin Orders</h2>
        <p>You have no orders.</p>
      </>
    );
  }

  return (
    <div className="admin-orders-container">
      <h2>All Orders</h2>
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Total Price</th>
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
              <td>{order.total}</td>
              <td>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.product_name} (Quantity: {product.product_quantity}, Price: {product.product_price})
                    </li>
                  ))}
                </ul>
              </td>
              <td className={`status-${order.status.toLowerCase()}`}>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.order_id, e.target.value as 'Pending' | 'Shipped' | 'Delivered')}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
