export enum TopLevelCourse {
	Main,
	UseFull,
	Practice
}
export class CoursePageModel {
	firstLevelCourse: TopLevelCourse;
	secondCategory: string;
	title: string
	category: string;
	hh?: {
		count: number;
		juniorSalary: number;
		middleSalary: number;
		seniorSalary: number;
	};
	documentation: {
		title: string;
		description: string;
	}[];
	seoText: string;
	tagsTitle: string;
	tags: string[]
}
