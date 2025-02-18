import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
	selector: "app-login",
	templateUrl: "./login.page.html",
	styleUrls: ["./login.page.scss"],
	standalone: true,
	imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
	constructor () { }

	public ngOnInit () { }
}
