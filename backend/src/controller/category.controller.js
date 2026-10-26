import { CategoryService } from "../service/category.service.js";
import { catchAsync } from "../util/catchAsync.js";

const categoryService = new CategoryService();

export class CategoryController {

    create = catchAsync(async (req, res) => {
        const body = req.body;
        const category = await categoryService.createCategory(body);
        res.status(201).json({ success: true, data: category })
    })
    getAll = catchAsync(async (req, res) => {
        const categories  = await categoryService.getAllCategory();
        res.json({ success: true, data: categories  })
    })
     getBySlug = catchAsync(async (req, res) => {
    const slug = req.params.slug;
    const category = await categoryService.getCategoryBySlug(slug);
    res.json({ success: true, data: category });
  });
    update = catchAsync(async (req, res) => {

        const slug = req.params.slug;
        const body = req.body;
        const category = await categoryService.updateCategory(slug, body);
        res.json({ success: true, data: category });
    });

    delete = catchAsync(async (req, res) => {
        const slug = req.params.slug;
        await categoryService.deleteCategory(slug);
        res.json({ success: true, message: "Category deleted successfully" });
    });


}
