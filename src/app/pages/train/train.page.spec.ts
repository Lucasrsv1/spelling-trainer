import { TrainPage } from "./train.page";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("TrainPage", () => {
	let component: TrainPage;
	let fixture: ComponentFixture<TrainPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(TrainPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
