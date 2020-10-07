import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './security/login/login.component';
import { SignupComponent } from './security/signup/signup.component';
import { AuthGuard } from "../app/security/auth/auth.guard";
import { NoauthGuard } from "../app/security/auth/noauth.guard";
import { FeedsComponent } from './components/feeds/feeds.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { PublicProfileComponent } from './components/user/public-profile/public-profile.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignupComponent, canActivate: [NoauthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoauthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'update-user', component: UpdateUserComponent, canActivate: [AuthGuard] },
  { path: 'user/:username', component: PublicProfileComponent, canActivate: [AuthGuard] },
  { path: 'feeds', component: FeedsComponent, canActivate: [AuthGuard] },
  { path: 'edit-feed/:id', component: EditPostComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
