import { TestBed } from "@angular/core/testing";

import { KnownCommonWordsService } from "./known-common-words.service";

describe("KnownCommonWordsService", () => {
	let service: KnownCommonWordsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(KnownCommonWordsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
