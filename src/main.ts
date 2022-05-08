import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './Users/users.controller';
import { ExeptionFilter } from './errors/exeption.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUsers } from './Users/users.interface';
import { IUserService } from './Users/userservice-interface';
import { UserService } from './Users/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config-service';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './Users/user.repository.interface';
import { UserRepository } from './Users/user.repository';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUsers>(TYPES.UsersController).to(UsersController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBinding);

	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
