import { Component, Input } from "@angular/core";

import { addIcons } from "ionicons";
import { chevronDownOutline, chevronUpOutline } from "ionicons/icons";
import { IonButton, IonIcon } from "@ionic/angular/standalone";

import { KeyboardService } from "src/app/services/keyboard/keyboard.service";

@Component({
	selector: "app-mobile-keyboard",
	templateUrl: "./mobile-keyboard.component.html",
	styleUrls: ["./mobile-keyboard.component.scss"],
	imports: [IonIcon, IonButton]
})
export class MobileKeyboardComponent {
	@Input()
	public isTraining: boolean = false;

	@Input()
	public wordConfirmed: boolean = false;

	public hidden: boolean = false;

	constructor (public readonly keyboardService: KeyboardService) {
		addIcons({ chevronDownOutline, chevronUpOutline });
	}
}
