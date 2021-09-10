import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import { IntroComponent } from './intro.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/features/header/header.module';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [IntroComponent],
  imports: [CommonModule, IntroRoutingModule, TranslateModule, HeaderModule, DropdownModule,
    ConfirmDialogModule,],
})
export class IntroModule { }
