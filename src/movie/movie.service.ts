import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel)
		private readonly MovieModel: ModelType<MovieModel>
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('mentors genres')
			.exec()
	}

	async bySlug(slug: string) {
		const docs = await this.MovieModel.findOne({ slug })
			.populate('mentors genres')
			.exec()
		if (!docs) throw new NotFoundException('Видео не найдено.')
		return docs
	}

	async byMentor(mentorId: Types.ObjectId) {
		const docs = await this.MovieModel.find({ mentors: mentorId }).exec()
		if (!docs) throw new NotFoundException('Видео не найдены.')
		return docs
	}

	async byGenres(genreIds: string[]) {
		const docs = await this.MovieModel.find({
			genres: { $in: genreIds.map((id) => new Types.ObjectId(id)) },
		}).exec()
		if (!docs) throw new NotFoundException('Видео не найдены.')
		return docs
	}

	async getMostPopular() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 },
			},
			{
				new: true,
			}
		).exec()

		if (!updateDoc) throw new NotFoundException('Видео не найдено.')

		return updateDoc
	}

	// Admin place
	async byId(_id: string) {
		const doc = await this.MovieModel.findById(_id)
		if (!doc) throw new NotFoundException('Видео не найдены.')

		return doc
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			mentors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		// Telegram notification

		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Видео не найдено.')

		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Видео не найдено.')

		return deleteDoc
	}
}
