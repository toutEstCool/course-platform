import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { MentorDto } from './dto/mentor.dto'
import { MentorService } from './mentor.service'

@Controller('mentors')
export class MentorController {
	constructor(private readonly mentorService: MentorService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.mentorService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.mentorService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.mentorService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.mentorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: MentorDto
	) {
		return this.mentorService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.mentorService.delete(id)
	}
}
