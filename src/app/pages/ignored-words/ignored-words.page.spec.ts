import { IgnoredWordsPage } from "./ignored-words.page";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("IgnoredWordsPage", () => {
	let component: IgnoredWordsPage;
	let fixture: ComponentFixture<IgnoredWordsPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(IgnoredWordsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
