import UserModel from "../../../auth/models/user";
import { OrderModel } from "../../../order/models/order";
import ProductModel from "../../../product/models/product";
import { ITotalSales } from "../interface/interface";

interface IResponse{
    message: string;
    data?: unknown;
    success: boolean;
}

const response: IResponse = { message: "", success: false };
class DashboardService {
    static async totalSales(): Promise<IResponse> {
        try {
            const totalSales = await OrderModel.aggregate([
                {
                    $match: {
                        status: "Delivered",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: {
                            $sum: "$total",
                        },
                    },
                },
                {
                    $project: {
                        totalSales: 1,
                        _id: 0,
                    },
                },
            ]);

            if (totalSales.length > 0) {
                response.message = "Total Sales has been fetched successfully";
                response.success = true;
                response.data = totalSales[0];
            } else {
                response.message = "No sales data found";
            }
        } catch (error: any) {
            response.message = `Error fetching total sales: ${error.message}`;
        }

        return response;
    }

    static async totalProducts(): Promise<IResponse> {
        try {
            const totalProducts = await ProductModel.find({
                stock: { $ne: 0 },
            }).countDocuments();

            if (!totalProducts) {
                response.message = "No products found";
                return response;
            }

            response.message = "Total Products has been fetched successfully";
            response.success = true;
            response.data = totalProducts;
        } catch (error: any) {
            response.message = `Error fetching total products: ${error.message}`;
        }
        return response;
    }

    static async totalUsers(): Promise<IResponse> {
        try {
            const totalUsers = await UserModel.find({
                role: "user",
                isActivated: true,
            }).countDocuments();

            if (!totalUsers) {
                response.message = "No users found";
                return response;
            }

            response.message = "Total Users has been fetched successfully";
            response.success = true;
            response.data = totalUsers;
        } catch (error: any) {
            response.message = `Error fetching total users: ${error.message}`;
        }
        return response;
    }

    static async totalOrders(): Promise<IResponse> {
        try {
            const totalOrders = await OrderModel.find({
                status: "Delivered",
            }).countDocuments();

            if (!totalOrders) {
                response.message = "No orders found";
                return response;
            }

            response.message = "Total Orders has been fetched successfully";
            response.success = true;
            response.data = totalOrders;
        } catch (error: any) {
            response.message = `Error fetching total orders: ${error.message}`;
        }
        return response;
    }

    static async topProducts(): Promise<IResponse> {
        const revenueData = await OrderModel.aggregate([
            { $unwind: "$items" }, // Deconstruct the items array
            {
                $group: {
                    _id: "$items.productId", // Group by productId
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, // Calculate total revenue per product
                }
            },
            {
                $lookup: {
                    from: 'products', // Match with the products collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: "$productDetails" // Deconstruct productDetails array
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: "$productDetails.product_name",
                    totalRevenue: 1
                }
            }
        ]);

        // Prepare data for the chart
        const labels = revenueData.map(item => item.productName);
        const data = revenueData.map(item => item.totalRevenue);

        if (labels.length && data.length > 0) {
            response.message = "Top Selling Products has been fetched successfully";
            response.success = true;
            response.data = { labels, data };
        } else {
            response.message = "No top selling products found";
        }   

        return response;
    }

    static async topCustomers(): Promise<IResponse> {
        try {
            const topCustomers = await OrderModel.aggregate([
                {
                    $group: {
                    _id: "$userId",
                    totalRevenue: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails",
                    },
                },
                {
                    $unwind: "$userDetails",
                },
                {
                    $project: {
                    _id: 0,
                    userId: "$_id",
                    userProfile: "$userDetails.profileImage",
                    username: "$userDetails.username",
                    email: "$userDetails.email",
                    phone: "$userDetails.phone",
                    totalRevenue: 1,
                    totalOrders: 1,
                    },
                },
                {
                    $sort: { totalRevenue: -1 },
                },
                {
                    $limit: 5,
                },
            ]);

            if (topCustomers.length > 0) {
                response.message = "Top Customers has been fetched successfully";
                response.success = true;
                response.data = topCustomers;
            } else {
                response.message = "No top customers found";
            }
        } catch (error: any) {
            response.message = `Error fetching top customers: ${error.message}`;
        }

        return response;
    }
}
export default DashboardService;