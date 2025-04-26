import { TestBed } from "@angular/core/testing";

import { IgnoredWordsService } from "./ignored-words.service";

describe("IgnoredWordsService", () => {
	let service: IgnoredWordsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(IgnoredWordsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
