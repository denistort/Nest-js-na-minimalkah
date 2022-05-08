import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-reg.dto';

export interface IUserService {
	CreateUser: (dto: UserRegistrationDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
