import { NextFunction, Response, Request } from 'express';

export interface IUsers {
	login: (req: Request, res: Response, next: NextFunction) => void;
	registration: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
}
