import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthenticationService } from "src/app/services/authentication/authentication.service";

export const authenticationGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authenticationService = inject(AuthenticationService);

	if (!authenticationService.isLoggedIn) {
		router.navigate(["home"]);
		return false;
	}

	return true;
};
