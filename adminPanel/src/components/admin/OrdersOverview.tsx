import React, { useEffect, useState } from 'react'
import { RootState } from '../../state_management'
import { useSelector } from 'react-redux'
import endPoints, { backendApiUrl } from '../../constants/endPoints'
import axios from 'axios'
import "./OrdersOverview.css"

const OrdersOverview: React.FC = () => {

    const [totalOrders, setTotalOrders] = useState<number | null>(0);
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken)
    const AuthStr = "Bearer " + jwtToken;

    const fetchTotalOrders= async () => {
        try {
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_TOTAL_ORDERS}`, {
                headers: {
                    'Authorization': AuthStr
                }
            })

            setTotalOrders(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTotalOrders()
    })

    return (
        <div className='card'>
            <div className='card-title'>Orders</div>
            <h1 className='card-value'> {totalOrders}</h1>
        </div>
    )
}

export default OrdersOverview