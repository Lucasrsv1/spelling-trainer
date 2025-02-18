import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
	selector: "app-train",
	templateUrl: "./train.page.html",
	styleUrls: ["./train.page.scss"],
	standalone: true,
	imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TrainPage implements OnInit {
	constructor () { }

	public ngOnInit () { }
}
