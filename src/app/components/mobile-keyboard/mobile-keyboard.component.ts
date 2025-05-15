import { Component, Input } from "@angular/core";

import { IonButton } from "@ionic/angular/standalone";

import { KeyboardService } from "src/app/services/keyboard/keyboard.service";

@Component({
	selector: "app-mobile-keyboard",
	templateUrl: "./mobile-keyboard.component.html",
	styleUrls: ["./mobile-keyboard.component.scss"],
	imports: [IonButton]
})
export class MobileKeyboardComponent {
	@Input()
	public isTraining: boolean = false;

	@Input()
	public wordConfirmed: boolean = false;

	constructor (public readonly keyboardService: KeyboardService) { }
}
