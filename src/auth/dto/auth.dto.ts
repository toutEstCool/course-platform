import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail({
		message: 'Вероятно, вы ввели не корректный email.',
	})
	email: string

	@MinLength(6, {
		message: 'Пароль не может быть короче 8 символов.',
	})
	@IsString()
	password: string
}
