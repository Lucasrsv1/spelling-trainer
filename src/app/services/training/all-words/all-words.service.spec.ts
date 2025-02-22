import { TestBed } from "@angular/core/testing";

import { AllWordsService } from "./all-words.service";

describe("AllWordsService", () => {
	let service: AllWordsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AllWordsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
