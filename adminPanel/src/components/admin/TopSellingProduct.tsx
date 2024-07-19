import React, { useEffect, useState } from 'react'
// import { ITopSellingProduct } from '../../interface/commonInterfaces';
import endPoints, { backendApiUrl } from '../../constants/endPoints';

import { Pie } from 'react-chartjs-2';
import { RootState } from '../../state_management';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const TopSellingProduct: React.FC = () => {

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
            },
        ],
    });

    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = "Bearer " + jwtToken;
    const fetchTopSellingProduct = async () => {
        try {
            const response = await axios.get(`${backendApiUrl}${endPoints.ADMIN_TOP_SELLING_PRODUCT}`, {    
                headers: {
                    'Authorization': AuthStr
                }
            })
            const { labels, data } = response.data.data;

            const generateRandomColor = () => {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };

            const backgroundColor = data.map(() => generateRandomColor());

            setChartData({
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor,
                    },
                ],
            });

        } catch (error) {
            console.error(error)
            }   

    }

    useEffect(() => {
        fetchTopSellingProduct();
    }, []);
    return (
        <div>
            <h1>Top Selling Product</h1>
            <Pie data={chartData} />
        </div>
        )
    }

export default TopSellingProduct;