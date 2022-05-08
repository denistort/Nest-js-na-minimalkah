import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsString({ message: 'Password is not correct' })
	password: string;

	@IsEmail({}, { message: 'Email is not correct' })
	email: string;
}
