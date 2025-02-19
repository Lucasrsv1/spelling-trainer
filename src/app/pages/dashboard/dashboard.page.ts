import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { RoundProgressModule } from "angular-svg-round-progressbar";

import { IonBadge, IonButton, IonButtons, IonContent, IonLabel, IonMenuButton, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.page.html",
	styleUrls: ["./dashboard.page.scss"],
	standalone: true,
	imports: [
		IonButtons,
		IonToolbar,
		IonButton,
		IonBadge,
		IonMenuButton,
		IonLabel,
		IonRouterLink,
		IonText,
		IonContent,
		CommonModule,
		FormsModule,
		RouterLink,
		RoundProgressModule
	]
})
export class DashboardPage implements OnInit {
	constructor () { }

	public ngOnInit () { }
}
