import { LoginPage } from "./login.page";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("LoginPage", () => {
	let component: LoginPage;
	let fixture: ComponentFixture<LoginPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
