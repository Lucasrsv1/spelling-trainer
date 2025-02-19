import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { addIcons } from "ionicons";
import { homeOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonMenuButton, IonRouterLink, IonToolbar } from "@ionic/angular/standalone";

@Component({
	selector: "app-train",
	templateUrl: "./train.page.html",
	styleUrls: ["./train.page.scss"],
	standalone: true,
	imports: [
		RouterLink,
		IonIcon,
		IonButton,
		IonButtons,
		IonContent,
		IonMenuButton,
		IonToolbar,
		IonRouterLink,
		CommonModule,
		FormsModule
	]
})
export class TrainPage implements OnInit {
	constructor () {
		addIcons({ homeOutline });
	}

	public ngOnInit () { }
}
