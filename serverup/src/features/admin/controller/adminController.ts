import { Request, Response } from 'express';
import AdminService from "../service/adminService";
import { AuthRequest } from '../../auth/controller/authController';

export const adminLogin = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const data = await AdminService.adminLogin(body);
  
      if (data.success) {
        res.status(200).json({
          ...data,
          code: 200,
        });
      } else {
        res.status(401).json({
          ...data,
          code: 401,
        });
      }
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || 'Internal Server Error';
      res.status(statusCode).json({ error: errorMessage });
    }
  };

  export const getAdminProfile = async (req: AuthRequest, res: Response) => {
    try {
        const body = {
        email: req.email,
        };
        
        const data = await AdminService.getAdminProfile(body);

        if (data.success) {
        res.status(200).json({
            ...data,
            code: 200,
        });
        } else {
        res.status(400).json({
            ...data,
            code: 400,
        });
        }
    } catch (error: any) {
        const statusCode = error.output?.statusCode ?? 500;
        const errorMessage = error.message ?? "Internal Server Error";
        res.status(statusCode).json({ error: errorMessage });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const email = req.email;
    const body = {
      ...req.body,
    };

    const data = await AdminService.updateProfile(email!, body);

    if (data.success) {
      res.status(200).json({
        ...data,
        code: 200,
      });
    } else {
      res.status(400).json({
        ...data,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
      const { username = '', status =''} = req.query;

      const orders = await AdminService.getAllOrders(
        username as string,
        status as string
      );
    if (orders.success) {
      res.status(200).json({
          ...orders,
          code: 200,
      });
      } else {
      res.status(400).json({
          ...orders,
          code: 400,
      });
      }
  } catch (error: any) {
      const statusCode = error.output?.statusCode ?? 500;
      const errorMessage = error.message ?? "Internal Server Error";
      res.status(statusCode).json({ error: errorMessage });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const email = req.email;
    const body = {
      ...req.body,
    };

    const data = await AdminService.updatePassword(email!, body);

    if (data.success) {
      res.status(200).json({
        ...data,
        code: 200,
      });
    } else {
      res.status(400).json({
        ...data,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AdminService.getUsers();
    if (users.success) {
      res.status(200).json({
        ...users,
        code: 200,
      });
    } else {
      res.status(400).json({
        ...users,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};


export const updateUserStatus = async (req: Request, res: Response) => { 
  try {
    const { userId, status } = req.body;
    const data = await AdminService.updateUserStatus(userId, status as boolean);

    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json({
        message: data.message,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode?? 500;
    const errorMessage = error.message?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
}


export const getReview = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const review = await AdminService.getReview(productId);
    if (review.success) {
      res.status(200).json({
        ...review,
        code: 200,
      });
    } else {
      res.status(400).json({
        ...review,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const data = await AdminService.updateReviewStatus(req.params.reviewId, status );
    // const data = await AdminService.updateUserStatus(userId, status as boolean);

    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json({
        message: data.message,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};