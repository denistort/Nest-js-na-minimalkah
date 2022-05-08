import request from 'supertest';
import { App } from '../src/app';
import { boot } from '../src/main';
let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('user e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/registration').send({
			name: 'de',
			email: 'denis@mail.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(422);
	});
	//LOGIN
	it('Login - Succes', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'denis@mail.ru',
			password: '123456',
		});
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Login - Wrong Email', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'deniqeqweqs@mail.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(401);
	});
	it('Login - Wrong Password', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'denis@mail.ru',
			password: '123456w',
		});
		expect(res.statusCode).toBe(401);
	});

	/* USER INFO ROUTE */

	it('UserInfo - Succes', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'denis@mail.ru',
			password: '123456',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.body.email).toBe('denis@mail.ru');
	});

	it('UserInfo - Error', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'denwwis@mail.ru',
			password: '123456',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.statusCode).toBe(401);
	});
});
afterAll(() => {
	application.close();
});
