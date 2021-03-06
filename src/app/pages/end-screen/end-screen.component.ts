import { Component, OnInit } from '@angular/core';
import { EvolutionService } from '../evaluation/evolution.service';
import { v4 as uuidv4 } from 'uuid';
import { DataService } from 'src/app/shared/shared/data.service';
import { environment } from 'src/environments';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss'],
})
export class EndScreenComponent implements OnInit {
  recording: boolean;
  cancel = false;
  isEndScreen: boolean;
  constructor(
    private evolutionService: EvolutionService,
    private dataservice: DataService
  ) {}

  ngOnInit(): void {
    this.recording = true;
    this.cancel = this.evolutionService.cancelValue;
    this.isEndScreen = true;
    this.postData();
  }

  postData() {
    if (this.cancel === true) {
      this.dataservice.setLoader(true);
      const finalObj = {
        Id: uuidv4(),
        ActualSceneIdentifier: this.appData.identifier,
        SceneIdentifier: this.appData.identifier,
        SceneNameLanguageKey: this.appData.nameLanguageKey,
        SceneSectionLanguageKey: this.appData.sceneSectionNameLanguageKey,
        ActualSceneNameLanguageKey: this.appData.nameLanguageKey,
        StartDate: new Date().toISOString(),
        EndDate: new Date().toISOString(),
        Status: 20,
        UserSession: uuidv4(),
        SimulatorIdentifier: 'cc43f6cb-d382-4783-a337-6532e3b2cdb1',
        SimulatorVersion: environment.version,
        UserInterfaceVersion: 'N/A',
        Score: 0,
        MaxScore: 0,
        SelfAssesmentRating: 0,
      };

      this.dataservice
        .submitData('f3cefa4a-83c9-473c-8883-3a46f2ff4f2c', finalObj)
        .subscribe(
          (res) => {
            this.dataservice.setLoader(false);
          },
          () => {
            this.dataservice.setLoader(false);
            this.dataservice.showError(
              'Some issue occured. Please contact your administrator!'
            );
          }
        );
    }
  }

  get appData() {
    return this.dataservice.appData;
  }

  closeTab(e) {
    window.close();
  }
}
