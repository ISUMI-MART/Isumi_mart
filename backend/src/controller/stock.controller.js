
import { StockService } from "../service/stock.service.js";
import { catchAsync } from "../util/catchAsync.js";

const stockService = new StockService();

export class StockController {
    create = catchAsync(async (req, res) => {
        const body = req.validated.body;

        const stock = await stockService.createStock(body);

        res.status(201).json({
            success: true,
            data: stock
        });
    });

    getAll = catchAsync(async (req, res) => {
        const stock = await stockService.getAllStock();

        res.json({
            success: true,
            data: stock
        });
    });

    getById = catchAsync(async (req, res) => {
        const id = req.validated.params.id;

        const stock = await stockService.getStockById(id);

        res.json({
            success: true,
            data: stock
        });
    });

    update = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const body = req.validated.body;

        const stock = await stockService.updateStock(id, body);

        res.json({
            success: true,
            data: stock
        });
    });

    delete = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        await stockService.deleteStock(id);

        res.json({
            success: true,
            message: "Stock deleted successfully"
        });
    });
}
