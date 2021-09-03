import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RecordingScreenRoutingModule } from './recording-screen-routing.module';
import { RecordingScreenComponent } from './recording-screen.component';
import { HeaderModule } from 'src/app/features/header/header.module';

@NgModule({
  declarations: [RecordingScreenComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RecordingScreenRoutingModule,
    HeaderModule,
  ],
})
export class RecordingScreenModule {}
