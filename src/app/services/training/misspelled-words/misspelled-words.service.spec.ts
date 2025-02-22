import { TestBed } from "@angular/core/testing";

import { MisspelledWordsService } from "./misspelled-words.service";

describe("MisspelledWordsService", () => {
	let service: MisspelledWordsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MisspelledWordsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
