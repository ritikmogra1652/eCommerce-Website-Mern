import React, { useEffect, useState } from 'react';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';

interface OrderItem {
  product_name: string;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
        const AuthStr = 'Bearer '.concat(jwtToken as string);
      const response = await axios.get(
        `${backendApiUrl}${endPoints.ADMIN_GET_ORDERS}`,
        {
            headers: {
                "Authorization": AuthStr,
            },
        }
      ); 
      console.log(response?.data?.data);
      
      setOrders(response?.data?.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  }

  useEffect(() => {
;

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Items</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>
              {order.items.map((item, index) => (
                <div key={index}>
                  {item.product_name} (Quantity: {item.quantity})
                </div>
              ))}
            </td>
            <td>{order.status}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminOrders;
