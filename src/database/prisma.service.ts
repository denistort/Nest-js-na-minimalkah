import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('[PrismaService] connected to the database');
		} catch (error) {
			if (error instanceof Error) {
				this.loggerService.error(
					`[PrismaService] Connection attempt ended with errors: ${error.message}`,
				);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.loggerService.log('[PrismaService] connected to the database');
	}
}
