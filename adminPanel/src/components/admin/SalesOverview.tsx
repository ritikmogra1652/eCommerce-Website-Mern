import React, { useEffect, useState } from 'react'
import { RootState } from '../../state_management'
import { useSelector } from 'react-redux'
import endPoints, { backendApiUrl } from '../../constants/endPoints'
import axios from 'axios'
import './SalesOverview.css'


const SalesOverview: React.FC = () => {

    const [totalSales, setTotalSales] = useState<number| null>(0);

    const jwtToken = useSelector((state:RootState) => state.AuthReducer.authData?.jwtToken)
    const AuthStr = "Bearer " + jwtToken;
    
    const fetchTotalSales = async() => {
        try {
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_TOTAL_SALES}`, {
                headers: {
                    'Authorization': AuthStr
                }
            })
            
            setTotalSales(response.data.data.totalSales)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTotalSales()
    })

    return (
        <div className='card'>
            <div className='card-title'>Sales</div>
            <h1 className='card-value'> {totalSales}</h1>
        </div>
    )
}

export default SalesOverview