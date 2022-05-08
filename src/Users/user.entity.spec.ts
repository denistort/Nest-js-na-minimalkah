import { User } from './user.entity';

describe('User Entity', () => {
	it('created user - succes', () => {
		const createdUser = new User('email@email.ru', 'denis');
		expect(createdUser).toBeInstanceOf(User);
	});

	it('getter name - succes', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		expect(createdUser.name).toBe('denis');
	});
	it('getter name - error', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		expect(createdUser.name).not.toBeUndefined();
	});
	//GETTER EMAIL
	it('getter email - succes', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		expect(createdUser.email).toBe('email@email.ru');
	});
	it('getter email - error', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		expect(createdUser.email).not.toBeUndefined();
	});
	//GETTER PASS
	it('getter password - succes', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		expect(createdUser.password).not.toBe('123456');
	});
	it('getter password - error', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		expect(createdUser.password).not.toBeUndefined();
	});
	/*  */

	it('compare password - succes', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		const res = await createdUser.comparePassword('123456');
		expect(res).toBeTruthy();
	});
	it('compare password - wrong pass', async () => {
		const createdUser = new User('email@email.ru', 'denis');
		await createdUser.setPassword('123456', Number('10'));
		const res = await createdUser.comparePassword('123456w');
		expect(res).toBeFalsy();
	});
});
