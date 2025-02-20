import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { IonicModule } from "@ionic/angular";

import { SpellingInputComponent } from "./spelling-input.component";

describe("SpellingInputComponent", () => {
	let component: SpellingInputComponent;
	let fixture: ComponentFixture<SpellingInputComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SpellingInputComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(SpellingInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
