import { DashboardPage } from "./dashboard.page";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("DashboardPage", () => {
	let component: DashboardPage;
	let fixture: ComponentFixture<DashboardPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
