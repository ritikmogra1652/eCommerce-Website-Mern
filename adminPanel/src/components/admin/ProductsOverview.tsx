import React, { useEffect, useState } from 'react'
import { RootState } from '../../state_management'
import { useSelector } from 'react-redux'
import endPoints, { backendApiUrl } from '../../constants/endPoints'
import axios from 'axios'
import './ProductsOverview.css' // Import the CSS file

const ProductsOverview: React.FC = () => {

    const [totalProducts, setTotalProducts] = useState<number | null>(0);

    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken)
    const AuthStr = "Bearer " + jwtToken;

    const fetchTotalProducts = async () => {
        try {
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_TOTAL_PRODUCTS}`, {
                headers: {
                    'Authorization': AuthStr
                }
            })

            setTotalProducts(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTotalProducts()
    }, []) 

    return (
        <div className="card">
            <div className="card-title">Total Products</div>
            <h1 className="card-value">{totalProducts}</h1>
        </div>
    )
}

export default ProductsOverview;
