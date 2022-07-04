import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJWTConfig } from 'src/config/jwt.config'

import { AuthService } from './auth.service'
import { UserModel } from 'src/user/user.model'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	controllers: [AuthController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
	],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
