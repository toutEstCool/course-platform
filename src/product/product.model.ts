export class ProductModel {
	image: string;
	title: string;
	price: number;
	oldPrice: number;
	calculatedRating: number;
	description: string;
	advantages: string;
	categories: string[];
	tags: string;
	characteristics: {
		[key: string]: string;
	}
}


