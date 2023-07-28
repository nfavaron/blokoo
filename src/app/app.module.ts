import { BrowserModule, provideProtractorTestingSupport } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideRouter, RouterModule } from '@angular/router';
import routerConfig from './config/router.config';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './component/message/message.component';
import { ClipboardModule as NgxClipboardModule } from 'ngx-clipboard';

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
    MessageComponent,

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
