import { BrowserModule, provideProtractorTestingSupport } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter, RouterModule } from '@angular/router';
import routerConfig from './config/router.config';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './component/message/message.component';
import { ClipboardModule as NgxClipboardModule } from 'ngx-clipboard';
import { LogoComponent } from './component/logo/logo.component';
import { BlokooComponent } from './component/blokoo/blokoo.component';
import { IconComponent } from './component/icon/icon.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [

    // Modules
    BrowserModule,
    FormsModule,
    RouterModule,
    CommonModule,

    // Components
    IconComponent,
    LogoComponent,
    BlokooComponent,
    MessageComponent,
    HeaderComponent,
    FooterComponent,

    // Firestore (has to be imported in AppModule, doesn't work with standalone component in Angular 16.1.0)
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // Ngx
    NgxClipboardModule,
  ],
  providers: [
    provideProtractorTestingSupport(),
    provideRouter(routerConfig),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
