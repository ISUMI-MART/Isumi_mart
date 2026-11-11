import { OrderItemService } from "../service/orderItem.service.js";
import { catchAsync } from "../util/catchAsync.js";

const orderItemService = new OrderItemService();

export class OrderItemController {
    // Add a new item to an order
    create = catchAsync(async (req, res) => {
        const data = req.validated.body;

        const item = await orderItemService.create(data);

        res.status(201).json({
            success: true,
            data: item
        });
    });

    getAll = catchAsync(async (req, res) => {
        const item = await orderItemService.getAll();
        res.json({ success: true, data: item })
    })

    // Update an existing order item
    update = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const data = req.validated.body;

        const item = await orderItemService.update(id, data);

        res.status(200).json({
            success: true,
            data: item
        });
    });

    // Delete an order item
    delete = catchAsync(async (req, res) => {
        const id = req.validated.params.id;

        await orderItemService.delete(id);

        res.status(200).json({
            success: true,
            message: "Order item deleted successfully"
        });
    });
}