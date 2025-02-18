import { HomePage } from "./home.page";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("HomePage", () => {
	let component: HomePage;
	let fixture: ComponentFixture<HomePage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HomePage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
