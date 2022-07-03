import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

import { AuthDto } from '../../server/src/auth/dto/auth.dto'

const testDto: AuthDto = {
	password: '112233',
	email: 'test@gmail.com',
}

describe('AppController (e2e)', () => {
	let app: INestApplication
	let createdId: string

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('/auth/register (POST)', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id
				expect(createdId).toBeDefined()
				done()
			})
	})
})
function done() {
	throw new Error('Function not implemented.')
}
