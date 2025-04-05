import { Injectable } from "@angular/core";

import { Color } from "@ionic/core";
import { AlertButton, AlertController, LoadingController, ToastController } from "@ionic/angular";

@Injectable({ providedIn: "root" })
export class UtilsService {
	constructor (
		private readonly alertController: AlertController,
		private readonly loadingController: LoadingController,
		private readonly toastController: ToastController
	) { }

	public async alert (title: string, msg: string): Promise<void> {
		const buttons: AlertButton[] = [{ text: "Close" }];

		const alert = await this.alertController.create({
			header: title,
			message: msg,
			buttons
		});

		alert.present();
	}

	public async toast (message: string, color: Color = "dark", duration: number = 3000, buttons = ["OK"], animated: boolean = true): Promise<HTMLIonToastElement> {
		const toast = await this.toastController.create({ message, duration, buttons, color, animated });
		toast.present();
		return toast;
	}

	public async presentLoading (message: string = "Loading..."): Promise<HTMLIonLoadingElement> {
		const loading = await this.loadingController.create({ message });
		loading.present();
		return loading;
	}

	public prompt (title: string, msg: string, cancelBtn: string = "Cancel", backdropDismiss: boolean = false): Promise<boolean> {
		return new Promise<boolean>(async resolve => {
			const alert = await this.alertController.create({
				header: title,
				message: msg,
				backdropDismiss,
				buttons: [{
					text: cancelBtn,
					role: "cancel",
					handler: _ => {
						resolve(false);
					}
				}, {
					text: "Confirm",
					role: "confirm",
					handler: _ => {
						resolve(true);
					}
				}]
			});

			alert.present();
		});
	}

	public readTextFile (file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = e => {
				if (e.target?.result)
					resolve(e.target.result.toString());
				else
					reject(new Error("Failed to read file."));
			};

			reader.readAsText(file);
		});
	}
}
