import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ButtonComponent } from './components/button/button.component';

const routes: Routes = [
  { path: "", component: HomeComponent }, 
  { path: "settings", component: SettingsComponent},
  { path: "leaderboard", component: LeaderboardComponent},
  { path: "game", component: GameComponent }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, SettingsComponent, LeaderboardComponent, GameComponent, ButtonComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
