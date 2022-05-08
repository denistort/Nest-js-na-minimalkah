import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { UserService } from './user.service';
import { IUserService } from './userservice-interface';
import { UserRepository } from './user.repository';

const configServiceMock: IConfigService = {
	get: jest.fn(),
};
const userRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};
const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(userRepositoryMock);

	userService = container.get<IUserService>(TYPES.UserService);
	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
});
let createdUser: UserModel | null;
describe('UserService', () => {
	it('createUser', async () => {
		configServiceMock.get = jest.fn().mockReturnValueOnce('1');
		userRepositoryMock.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				id: 1,
				name: user.name,
				email: user.email,
				password: user.password,
			};
		});

		createdUser = await userService.CreateUser({
			email: 'wewe@we.ru',
			name: 'boris',
			password: 'qweasd123',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('qweasd1232');
	});

	it('validateUser - succes', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'wewe@we.ru',
			password: 'qweasd123',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong pass', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'wewe@we.ru',
			password: 'qweasd123w',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await userService.validateUser({
			email: 'wewe321313@we.ru',
			password: 'qweasd123w',
		});
		expect(res).toBeFalsy();
	});
});
