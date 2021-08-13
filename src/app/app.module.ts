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

export function HttpLoaderFactory(http: HttpClient) {
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

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [TranslateModule, HeaderModule],
})
export class AppModule {}
