import { TestBed } from "@angular/core/testing";

import { TrainerLoaderService } from "./trainer-loader.service";

describe("TrainerLoaderService", () => {
	let service: TrainerLoaderService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TrainerLoaderService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
