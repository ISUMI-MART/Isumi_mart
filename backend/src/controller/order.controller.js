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
      data: order,
    });
  });

  // Get all orders
  getAll = catchAsync(async (req, res) => {
    const { id, role } = req.currentUser;

    const orders = await orderService.getAll(id, role);

    res.status(200).json({
      success: true,
      data: orders,
    });
  });

  // Get a specific order by ID
  getById = catchAsync(async (req, res) => {
    const id = req.validated.params.id;
    const { id: userId, role } = req.currentUser;

    const order = await orderService.getById(id, userId, role);

    res.status(200).json({
      success: true,
      data: order,
    });
  });

  // Update order status

  updateStatus = catchAsync(async (req, res) => {
    const id = req.validated.params.id;

    const { status, deliveryFailureReason, deliveryFailureNote } =
      req.validated.body;

    const { id: userId, role } = req.currentUser;

    const order = await orderService.updateStatus(id, status, userId, role, {
      deliveryFailureReason,
      deliveryFailureNote,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  });

  assignAgent = catchAsync(async (req, res) => {
    const id = req.validated.params.id;
    const { deliveryAgentId } = req.validated.body;

    const order = await orderService.assignAgent(id, deliveryAgentId);

    res.status(200).json({
      success: true,
      message: "Delivery agent assigned successfully.",
      data: order,
    });
  });
}
