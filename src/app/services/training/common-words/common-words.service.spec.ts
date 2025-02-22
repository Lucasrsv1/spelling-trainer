import { TestBed } from "@angular/core/testing";

import { CommonWordsService } from "./common-words.service";

describe("CommonWordsService", () => {
	let service: CommonWordsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CommonWordsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
