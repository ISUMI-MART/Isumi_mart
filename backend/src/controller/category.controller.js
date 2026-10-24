import { CategoryService } from "../service/category.service";
import { catchAsync } from "../util/catchAsync";

const categoryService = new CategoryService();

export class CategoryController {

    create = catchAsync(async (req, res) => {
        const body = req.validated.body;
        const category = await categoryService.createCategory(body);
        res.status(201).json({ success: true, data: category })
    })
    getAll = catchAsync(async (req, res) => {
        const category = await categoryService.getAll();
        res.json({ success: true, date: category })
    })
    getById = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const category = await tagService.getById(id);
        res.json({ success: true, data: category });
    });
    update = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        const body = req.validated.body;
        const category = await categoryService.updateCategory(id, body);
        res.json({ success: true, data: category });
    });

    delete = catchAsync(async (req, res) => {
        const id = req.validated.params.id;
        await categoryService.deleteCategory(id);
        res.json({ success: true, message: "Category deleted successfully" });
    });


}
