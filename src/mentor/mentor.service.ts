import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { MentorDto } from './dto/mentor.dto'
import { MentorModel } from './mentor.model'

@Injectable()
export class MentorService {
	constructor(
		@InjectModel(MentorModel)
		private readonly MentorModel: ModelType<MentorModel>
	) {}

	async bySlug(slug: string) {
		const doc = await this.MentorModel.findOne({ slug }).exec()
		if (!doc) throw new NotFoundException('Ментор не найден.')
		return doc
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
				],
			}

		// Aggregations

		return this.MentorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				localField: '_id',
				foreignField: 'mentors',
				as: 'movies',
			})
			.addFields({
				countMovies: {
					$size: '$movies',
				},
			})
			.project({ __v: 0, updatedAt: 0, movies: 0 })
			.sort({
				createdAt: -1,
			})
			.exec()
	}

	// Admin place
	async byId(_id: string) {
		const mentor = await this.MentorModel.findById(_id)
		if (!mentor) throw new NotFoundException('Ментор не найден.')

		return mentor
	}

	async create() {
		const defaultValue: MentorDto = {
			name: '',
			slug: '',
			photo: '',
		}
		const mentor = await this.MentorModel.create(defaultValue)
		return mentor._id
	}

	async update(_id: string, dto: MentorDto) {
		const updateDoc = await this.MentorModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Жанр не найден.')

		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = this.MentorModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Жанр не найден.')

		return deleteDoc
	}
}
