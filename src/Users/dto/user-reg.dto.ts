import { IsEmail, IsString, Length } from 'class-validator';

export class UserRegistrationDto {
	@Length(0, 30, { message: 'Name cant be empry string and cant be longer than 30 characters' })
	@IsString()
	name: string;

	@Length(6, 25, { message: 'Password length must from 6 characters to 25' })
	@IsString({ message: 'Password is not correct' })
	password: string;

	@IsEmail({}, { message: 'Email is not correct' })
	email: string;
}
