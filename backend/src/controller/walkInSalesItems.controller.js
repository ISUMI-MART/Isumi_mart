import { WalkInSaleItemsService } from "../service/walkInSalesItems.service.js";
import { catchAsync } from "../util/catchAsync.js";

const walkInSaleItemsService = new WalkInSaleItemsService();

export class WalkInSaleItemsController {

    getItemsBySaleId = catchAsync(async (req, res) => {

        const saleId = req.params.saleId;

        const items = await walkInSaleItemsService.getItemsBySaleId(saleId);

        res.json({
            success: true,
            message: "Walk-in sale items retrieved successfully",
            items,
        });
    });

    getItemById = catchAsync(async (req, res) => {

        const itemId = Number(req.params.id);

        const item = await walkInSaleItemsService.getItemById(itemId);

        res.json({
            success: true,
            message: "Walk-in sale item retrieved successfully",
            item,
        });
    });
}