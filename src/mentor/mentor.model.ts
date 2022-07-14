import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface MentorModel extends Base {}

export class MentorModel extends TimeStamps {
	@prop()
	name: string

	@prop({ unique: true })
	slug: string

	@prop()
	photo: string
}
