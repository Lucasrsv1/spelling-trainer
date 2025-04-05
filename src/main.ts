import { bootstrapApplication } from "@angular/platform-browser";
import { importProvidersFrom } from "@angular/core";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from "@angular/router";

import { Drivers } from "@ionic/storage";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideIonicAngular(),
		importProvidersFrom(IonicModule.forRoot({
			innerHTMLTemplatesEnabled: true
		})),
		importProvidersFrom(IonicStorageModule.forRoot({
			name: "__SpellingTrainerStorage",
			driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
		})),
		provideRouter(routes, withPreloading(PreloadAllModules))
	]
});
