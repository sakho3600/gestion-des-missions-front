import { Component, OnInit } from '@angular/core';
import { MissionService } from '../shared/service/mission.service';
import { AuthService } from '../shared/service/auth.service';
import { Mission } from '../shared/domain/mission';
import * as sha1 from 'sha1';

@Component({
  selector: 'app-validation-mission',
  templateUrl: './validation-mission.component.html',
  styleUrls: ['./validation-mission.component.css']
})
export class ValidationMissionComponent implements OnInit {
  public missions: Mission[] = [];

  /* Méthode sortDate */
  public dateDebutAsc: number = 1;
  public dateFinAsc: number = 1;

  /* Méthode sortStatut */
  public statutAsc: number = 1;

  constructor(private missionService: MissionService, public auth: AuthService) {
  }

  ngOnInit() {
    this.missionService.lister().subscribe(listeMissions => { this.missions = listeMissions; console.log(this.missions) })
  }

  /*Méthode validation*/
  validerMission(id: number) {
    this.missionService.validerMission(id);
    return false;
  }

  /*Méthode rejeteMission*/
  rejeterMission(id: number) {
    this.missionService.rejeterMission(id);
  }

  /* Méthode sort Date ( trie ) */
  sortMissionsDateDebut(): void {
    this.dateDebutAsc *= -1;
    this.missions.sort((a: Mission, b: Mission) => {
      return this.dateDebutAsc * (a.dateDebut.getTime() - b.dateDebut.getTime());
    });
  }

  sortMissionsDateFin(): void {
    this.dateFinAsc *= -1;
    this.missions.sort((a: Mission, b: Mission) => {
      return this.dateFinAsc * (a.dateFin.getTime() - b.dateFin.getTime());
    });
  }

  /* Méthode sort Statut */
  sortMissionStatut(): void {

    this.statutAsc *= -1;
    this.missions.sort((statutA: Mission, statutB: Mission) => {

      if (statutA.statut < statutB.statut) {
        return 1 * this.statutAsc;
      }

      if (statutA.statut > statutB.statut) {
        return -1 * this.statutAsc;
      }
      return 0;
    });
  }

  checkManager():boolean{
    return this.auth.role == sha1('manager')
  }



}
