import express from "express";
import cors from "cors";
import envConfig from "./config/envConfig";
import connectDB from "./database/db";
import { authRoutes } from "./features/auth/routes/authRoutes";
import { productRoutes } from "./features/product/routes/productRoutes";
import { cartRoutes } from "./features/cart/routes/cartRoutes";
import bodyParser from "body-parser";
import { orderRoutes } from "./features/order/routes/orderRoutes";
import { adminRoutes } from "./features/admin/routes/adminRoutes";
import { categoryRotues } from "./features/product_categories/routes/categoryRoutes";
import { reviewRoutes } from "./features/reviews/routes/reviewRoutes";
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));

// app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const env = envConfig();
const port = env.port;
connectDB();
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use("/users", authRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/", categoryRotues);
app.use('/',reviewRoutes)

app.listen(port, () => {
  console.log("server is running on port http://localhost:" + port);
});
