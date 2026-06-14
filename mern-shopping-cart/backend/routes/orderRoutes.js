import express from "express"; import { checkout, myOrders } from "../controllers/orderController.js"; import { protect } from "../middleware/authMiddleware.js";
const router = express.Router(); router.post("/", protect, checkout); router.get("/my-orders", protect, myOrders); export default router;
