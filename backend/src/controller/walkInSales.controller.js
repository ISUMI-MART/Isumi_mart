import { WalkInSaleService } from "../service/walkInSales.service.js";
import { catchAsync } from "../util/catchAsync.js";

const walkInSaleService = new WalkInSaleService();

export class WalkInSaleController {
  getAllSales = catchAsync(async (req, res) => {
    const sales = await walkInSaleService.getAllSales();

    res.json({
      success: true,
      message: "Walk-in sales retrieved successfully",
      sales,
    });
  });

  getSaleById = catchAsync(async (req, res) => {
    const saleId = req.params.id;

    const sale = await walkInSaleService.getSaleById(saleId);

    if (!sale) {
      throw new Error("Walk-in sale not found");
    }

    res.json({
      success: true,
      message: "Walk-in sale retrieved successfully",
      sale,
    });
  });

  createSale = catchAsync(async (req, res) => {
    const body = req.validated.body;

    const sale = await walkInSaleService.createSale(body);

    res.status(201).json({
      success: true,
      message: "Walk-in sale created successfully",
      sale,
    });
  });
}