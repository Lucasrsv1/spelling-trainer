import { TestBed } from "@angular/core/testing";

import { WordsToReviewService } from "./words-to-review.service";

describe("WordsToReviewService", () => {
	let service: WordsToReviewService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WordsToReviewService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
