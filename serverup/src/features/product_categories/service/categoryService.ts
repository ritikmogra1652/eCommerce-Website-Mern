import envConfig from "../../../config/envConfig";
import CategoryModel, { ICategory } from "../models/category";

interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}

const response: IResponse = { message: "", success: false };

class CategoryService {
    static async addCategory(data: Partial<ICategory>): Promise<IResponse> {
        const categoryExist = await CategoryModel.find({ categoryName:  { 
        $regex: new RegExp(data.categoryName!, 'i') 
    }  });
        if (categoryExist.length > 0) {
            response.message = "Category already exists";
            response.data = [];
            response.success = false;
            return response;
        };

        const newCategory = new CategoryModel({ ...data });
        await newCategory.save();

        response.message = "Category created successfully";
        response.success = true;
        return response;
    };

    
    static async getAllCategories(): Promise<IResponse> {
        try {

        const categories = await CategoryModel.find();

        if (!categories || categories.length === 0) {
            response.message = "No Category Found";
            response.success = true;
            response.data = [];
        } else {
            response.success = true;
            response.message = "Categories Displayed Successfully";
            response.data = categories;
        }
        } catch (error) {
        response.message = "No Product Found";
        }

    return response;
    }
    

}



export default CategoryService;