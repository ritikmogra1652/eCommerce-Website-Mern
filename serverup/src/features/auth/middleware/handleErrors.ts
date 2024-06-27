import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const HandleErrors =(
    func: (
        arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
        arg1: Response<any, Record<string, any>>,
        arg2: NextFunction
    ) => any
) =>
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        await func(req, res, next);
    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
    };

export default HandleErrors;
