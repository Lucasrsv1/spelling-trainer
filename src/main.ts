import { bootstrapApplication } from "@angular/platform-browser";
import { importProvidersFrom } from "@angular/core";
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from "@angular/router";

import { Drivers } from "@ionic/storage";
import { IonicStorageModule } from "@ionic/storage-angular";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideIonicAngular(),
		importProvidersFrom(IonicStorageModule.forRoot({
			name: "__SpellingTrainerStorage",
			driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
		})),
		provideRouter(routes, withPreloading(PreloadAllModules))
	]
});
