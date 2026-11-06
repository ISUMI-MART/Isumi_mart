
import { StockMovementService } from "../service/stockMovement.service.js";
import { catchAsync } from "../util/catchAsync.js";

const stockMovementService = new StockMovementService();

export class StockMovementController {

  getAllMovements = catchAsync(async (req, res) => {

    const movements =
      await stockMovementService.getAllMovements();

    res.status(200).json({
      success: true,
      message: "Stock movements retrieved successfully",
      count: movements.length,
      movements,
    });
  });

  getMovementsByProduct = catchAsync(async (req, res) => {

    const productId = Number(req.params.productId);

    const movements =
      await stockMovementService.getMovementsByProduct(productId);

    res.status(200).json({
      success: true,
      message: "Product stock movements retrieved successfully",
      count: movements.length,
      movements,
    });
  });

  createMovement = catchAsync(async (req, res) => {

    const { productId, quantity, note } = req.validated.body;

    const result = await stockMovementService.createMovement({
      productId,
      quantity,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Stock movement recorded successfully",
      movement: result.movement,
      currentStock: result.stock.quantity,
    });
  });
}
