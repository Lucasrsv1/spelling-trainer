import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AsyncPipe, CommonModule } from "@angular/common";

import { addIcons } from "ionicons";
import { globeOutline, homeOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonImg, IonMenuButton, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

import { Capacitor } from "@capacitor/core";

import { Observable } from "rxjs";

import { AuthenticationService } from "src/app/services/authentication/authentication.service";

const androidUrl = "https://play.google.com/store/apps/details?id=appId";
const donationUrl = "https://www.buymeacoffee.com/lucasrv";

@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"],
	standalone: true,
	imports: [
		AsyncPipe,
		IonButton,
		IonButtons,
		IonContent,
		IonIcon,
		IonImg,
		IonMenuButton,
		IonRouterLink,
		IonText,
		IonToolbar,
		CommonModule,
		FormsModule,
		RouterLink
	]
})
export class HomePage {
	public isLoggedIn$: Observable<boolean>;

	constructor (private readonly authenticationService: AuthenticationService) {
		addIcons({ globeOutline, homeOutline });
		this.isLoggedIn$ = this.authenticationService.isLoggedIn$;
	}

	public openPlayStore (): void {
		if (Capacitor.isNativePlatform())
			window.open(androidUrl, "_system"); // Opens using external browser or Play Store
		else
			window.open(androidUrl, "_blank"); // Opens in new tab
	}

	public openDonationLink (): void {
		if (Capacitor.isNativePlatform())
			window.open(donationUrl, "_system"); // Opens using external browser
		else
			window.open(donationUrl, "_blank"); // Opens in new tab
	}
}
