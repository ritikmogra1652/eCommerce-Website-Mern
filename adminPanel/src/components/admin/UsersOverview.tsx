import React, { useEffect, useState } from 'react'
import { RootState } from '../../state_management'
import { useSelector } from 'react-redux'
import endPoints, { backendApiUrl } from '../../constants/endPoints'
import axios from 'axios'

const UsersOverview: React.FC = () => {

    const [totalUsers, setTotalUsers] = useState<number | null>(0);

    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken)
    const AuthStr = "Bearer " + jwtToken;

    const fetchTotalUsers = async () => {
        try {
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_TOTAL_USERS}`, {
                headers: {
                    'Authorization': AuthStr
                }
            })

            setTotalUsers(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTotalUsers()
    })

    return (
        <div className='card'>
            <div className='card-title'>Total Users</div>
            <h1 className='card-value'> {totalUsers}</h1>
        </div>
    )
}

export default UsersOverview