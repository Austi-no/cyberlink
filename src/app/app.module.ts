import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { HomeComponent } from './layout/home/home.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { SignupComponent } from './security/signup/signup.component';
import { LoginComponent } from './security/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { TimeagoPipe } from './custompipe/timeago.pipe';
import { EditPostComponent } from './components/edit-post/edit-post.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PublicProfileComponent } from './components/user/public-profile/public-profile.component';
import { ToastrModule } from 'ngx-toastr';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    FooterComponent,
    DashboardComponent,
    SignupComponent,
    LoginComponent,
    UserProfileComponent,
    FeedsComponent,
    TimeagoPipe,
    EditPostComponent,
    PublicProfileComponent,
    UpdateUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0, 0, 0, 0.3)',
      backdropBorderRadius: '4px', fullScreenBackdrop: true,
      primaryColour: '#e83e8c',
      secondaryColour: '#007bff',
      tertiaryColour: '#fd7e14'
    })



  ],


  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {



}

