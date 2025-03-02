import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"],
	standalone: true,
	imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
	constructor () { }

	public ngOnInit () { }
}
