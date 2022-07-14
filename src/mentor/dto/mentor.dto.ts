import { IsString } from 'class-validator'

export class MentorDto {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsString()
	photo: string
}
