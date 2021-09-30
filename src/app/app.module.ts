import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomePageModule } from './pages/home-page/home-page.module';
import { HeaderModule } from './features/header/header.module';
import { SelfAssesmentModule } from './pages/self-assesment/self-assesment.module';
import { SelfassesmentQuestionsModule } from './pages/selfassesment-questions/selfassesment-questions.module';
import { EvaluationModule } from './pages/evaluation/evaluation.module';
import { EndScreenModule } from './pages/end-screen/end-screen.module';
import { RecordingScreenModule } from './pages/recording-screen/recording-screen.module';
import { ChooseScreenshotModule } from './pages/choose-screenshot/choose-screenshot.module';
import { IntroModule } from './pages/intro/intro.module';
import { TakescreenshotModule } from './pages/takescreenshot/takescreenshot.module';
import { VideoscreenModule } from './pages/videoscreen/videoscreen.module';
import { SharedModule } from '../app/shared/shared/shared.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHeaderInterceptor } from './shared/shared/auth-header.interceptor';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    InputSwitchModule,
    HttpClientModule,
    HeaderModule,
    HomePageModule,
    EndScreenModule,
    EvaluationModule,
    RecordingScreenModule,
    SelfAssesmentModule,
    SelfassesmentQuestionsModule,
    ChooseScreenshotModule,
    IntroModule,
    TakescreenshotModule,
    VideoscreenModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule, HeaderModule],
})
export class AppModule {}
