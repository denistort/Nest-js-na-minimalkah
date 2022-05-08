import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-reg.dto';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './userservice-interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	async CreateUser({ email, name, password }: UserRegistrationDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		return await this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const userIsExist = await this.userRepository.find(email);
		if (!userIsExist) {
			return false;
		}
		const newUser = new User(userIsExist.email, userIsExist.name, userIsExist.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
