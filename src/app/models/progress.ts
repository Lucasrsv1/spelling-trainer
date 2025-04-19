export class Progress {
	public all = 0;
	public common = 0;
	public inReview = 0;
	public misspelled = 0;

	public known = {
		common: { value: 0, progress: 0 },
		all: { value: 0, progress: 0 }
	};
}
