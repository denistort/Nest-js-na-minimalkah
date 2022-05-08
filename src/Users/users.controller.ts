import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUsers } from './users.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-reg.dto';
import { IUserService } from './userservice-interface';
import { HttpError } from '../errors/http.error';
import { ValidateMiddleware } from '../common/validate-middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { Guard } from '../common/guard.middleware';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersController extends BaseController implements IUsers {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/registration',
				method: 'post',
				func: this.registration,
				middlewares: [new ValidateMiddleware(UserRegistrationDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},

			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new Guard()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'Email or Password is not correct'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('JWTSECRET'));
		this.ok(res, { status: 'Succes', info: 'You are logged in', jwt });
	}

	async registration(
		{ body }: Request<{}, {}, UserRegistrationDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.CreateUser(body);
		if (!result) {
			return next(new HttpError(422, 'This user already exist in your system'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userModel = await this.userService.getUserInfo(user);
		this.ok(res, userModel);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},

				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
