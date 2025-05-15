import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { IonicModule } from "@ionic/angular";

import { MobileKeyboardComponent } from "./mobile-keyboard.component";

describe("MobileKeyboardComponent", () => {
	let component: MobileKeyboardComponent;
	let fixture: ComponentFixture<MobileKeyboardComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [MobileKeyboardComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(MobileKeyboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
