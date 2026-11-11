import { OrderService } from "../service/order.service.js";
import { catchAsync } from "../util/catchAsync.js";

const orderService = new OrderService();

export class OrderController {
    // Create a new order
    create = catchAsync(async (req, res) => {
        const data = req.validated.body;
        const userId = req.currentUser.id; 

        const order = await orderService.create(userId, data);

        res.status(201).json({
            success: true,
            data: order
        });
    });

    // Get all orders 
    getAll = catchAsync(async (req, res) => {
        const orders = await orderService.getAll();

        res.status(200).json({
            success: true,
            data: orders
        });
    });

    // Get a specific order by ID
    getById = catchAsync(async (req, res) => {
        const id = req.validated.params.id;

        const order = await orderService.getById(id);

        res.status(200).json({
            success: true,
            data: order
        });
    });

    // Update order status (PATCH)
    updateStatus = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const status = req.validated.body.status;

        const order = await orderService.updateStatus(id, status);

        res.status(200).json({
            success: true,
            data: order
        });
    });
}