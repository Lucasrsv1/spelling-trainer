import { Injectable } from "@angular/core";

import { NavController, Platform } from "@ionic/angular";

import { BehaviorSubject, map, Observable } from "rxjs";

import { IUser } from "src/app/models/user";

import { LocalStorageKey, LocalStorageService } from "../local-storage/local-storage.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
	private _user$ = new BehaviorSubject<IUser | null>(null);

	constructor (
		private readonly navController: NavController,
		private readonly platform: Platform,
		private readonly localStorage: LocalStorageService
	) {
		this.platform.ready().then(() => {
			// Usa usuário já logado por meio valor armazenado no Local Storage (caso exista)
			const user = this.localStorage.parse<IUser>(LocalStorageKey.USER);
			this._user$.next(user);
		});
	}

	/**
	 * Retorna verdadeiro quando o usuário está logado
	 */
	public get isLoggedIn (): boolean {
		return this.user !== null && Boolean(this.user.uuid);
	}

	/**
	 * Retorna um observable notificado como verdadeiro quando o usuário está logado, e falso quando não está
	 */
	public get isLoggedIn$ (): Observable<boolean> {
		return this._user$.pipe(
			map(user => user !== null && Boolean(user.uuid))
		);
	}

	/**
	 * Retorna o usuário atual
	 */
	public get user (): IUser | null {
		return this._user$.getValue();
	}

	/**
	 * Retorna um observable notificado sempre que o usuário muda
	 */
	public get user$ (): Observable<IUser | null> {
		return this._user$.asObservable();
	}

	public signOut () {
		this.localStorage.delete(LocalStorageKey.USER);
		this._user$.next(null);
		this.navController.navigateRoot(["home"]);
	}

	public saveLoggedUser (user: IUser): void {
		this.localStorage.set(JSON.stringify(user), LocalStorageKey.USER);
		this._user$.next(user);
		this.navController.navigateRoot(["dashboard"]);
	}
}
