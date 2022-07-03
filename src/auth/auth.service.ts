import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { hash, genSalt, compare } from 'bcryptjs'

import { UserModel } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async login(dto: AuthDto) {
		return this.validateUser(dto)
	}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })

		if (oldUser)
			throw new BadRequestException(
				'Это имя пользователя уже занято. Попробуйте другое.'
			)

		const salt = await genSalt(10)
		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		})
		return newUser.save()
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })
		if (!user) throw new UnauthorizedException('Не верный логин или пароль.')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword)
			throw new UnauthorizedException(
				'Не верный логин или пароль. Пароль именно'
			)
		return user
	}
}
