import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { MentorService } from './mentor.service'
import { MentorController } from './mentor.controller'
import { MentorModel } from './mentor.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MentorModel,
				schemaOptions: {
					collection: 'Mentor',
				},
			},
		]),
	],
	providers: [MentorService],
	controllers: [MentorController],
})
export class MentorModule {}
