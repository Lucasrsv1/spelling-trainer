import { Routes } from "@angular/router";

import { authenticationGuard } from "./guards/authentication/authentication.guard";
import { loginGuard } from "./guards/login/login.guard";

export const routes: Routes = [
	// Public
	{ path: "home", loadComponent: () => import("./pages/home/home.page").then(m => m.HomePage) },
	{ path: "login", canActivate: [loginGuard], loadComponent: () => import("./pages/login/login.page").then(m => m.LoginPage) },

	// Restricted
	{ path: "dashboard", canActivate: [authenticationGuard], loadComponent: () => import("./pages/dashboard/dashboard.page").then(m => m.DashboardPage) },
	{ path: "train/:word-list", canActivate: [authenticationGuard], loadComponent: () => import("./pages/train/train.page").then(m => m.TrainPage) },
	{ path: "ignored-words", canActivate: [authenticationGuard], loadComponent: () => import("./pages/ignored-words/ignored-words.page").then(m => m.IgnoredWordsPage) },

	// No match
	{ path: "", redirectTo: "dashboard", pathMatch: "full" },
	{ path: "**", redirectTo: "dashboard" }
];
