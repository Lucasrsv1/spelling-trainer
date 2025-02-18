import { Component } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { addIcons } from "ionicons";
import { RouterDirection } from "@ionic/core";
import { bookOutline, closeCircleOutline, homeOutline, logOutOutline, searchOutline, textOutline } from "ionicons/icons";
import { IonApp, IonAvatar, IonBadge, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonSplitPane, IonText } from "@ionic/angular/standalone";

import { StatusBar } from "@capacitor/status-bar";

import { Observable } from "rxjs";
import { RoundProgressModule } from "angular-svg-round-progressbar";

import { IUser } from "./models/user";

import { AuthenticationService } from "./services/authentication/authentication.service";

interface AppLink {
	title: string;
	url: string;
	icon: string;
	direction: RouterDirection;
	current: number;
	max: number;
}

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
	imports: [
		AsyncPipe,
		NgIf,
		NgForOf,
		RouterLink,
		RouterLinkActive,
		IonApp,
		IonAvatar,
		IonBadge,
		IonSplitPane,
		IonMenu,
		IonContent,
		IonList,
		IonListHeader,
		IonMenuToggle,
		IonItem,
		IonIcon,
		IonLabel,
		IonRouterLink,
		IonRouterOutlet,
		IonText,
		RoundProgressModule
	]
})
export class AppComponent {
	public readonly appPages: AppLink[] = [
		{ title: "Common Words", url: "/train/common-words", icon: "text", direction: "forward", current: 13, max: 48 },
		{ title: "All Words", url: "/train/all-words", icon: "book", direction: "forward", current: 24, max: 155 }
	];

	public user$: Observable<IUser | null>;
	public isLoggedIn$: Observable<boolean>;

	constructor (
		private readonly authenticationService: AuthenticationService
	) {
		StatusBar.setBackgroundColor({ color: "#333333" });
		addIcons({ bookOutline, closeCircleOutline, homeOutline, logOutOutline, searchOutline, textOutline });

		this.user$ = this.authenticationService.user$;
		this.isLoggedIn$ = this.authenticationService.isLoggedIn$;
	}

	public get userInitials (): string {
		const names: string[] = (this.authenticationService.user?.name || "").split(" ");
		if (!names.length)
			return "";

		if (names.length === 1)
			return names[0][0].toUpperCase();

		return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
	}

	public logout (): void {
		this.authenticationService.signOut();
	}
}
