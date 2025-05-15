import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class KeyboardService {
	public _delete$: Subject<void> = new Subject<void>();
	public _enter$: Subject<void> = new Subject<void>();
	public _input$: Subject<string> = new Subject<string>();

	constructor () { }

	public get delete$ (): Observable<void> {
		return this._delete$.asObservable();
	}

	public get enter$ (): Observable<void> {
		return this._enter$.asObservable();
	}

	public get input$ (): Observable<string> {
		return this._input$.asObservable();
	}

	public input (char: string): void {
		this._input$.next(char);
	}

	public enter (): void {
		this._enter$.next();
	}

	public backspace (): void {
		this._delete$.next();
	}
}
