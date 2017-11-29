import { Component, OnInit } from '@angular/core';
import { MissionService } from '../shared/service/mission.service';
import { Mission } from '../shared/domain/mission';
import { NotesService } from '../shared/service/notes.service';
import { Note } from '../shared/domain/note';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-tableau-note-mission-view',
  templateUrl: './tableau-note-mission-view.component.html',
  styleUrls: ['./tableau-note-mission-view.component.css','../../assets/font-awesome-4.7.0/css/font-awesome.min.css']
})
export class TableauNoteMissionViewComponent implements OnInit {

  idmission:number;
  mission:Mission = null;

  constructor(private missionService:MissionService, private noteService:NotesService, route:ActivatedRoute) {
    route.params.subscribe(params => {this.idmission = params['idmission'];
   });
  }

  ngOnInit() {

    this.missionService.trouverMission(this.idmission).subscribe(miss => {console.log(miss);this.mission = miss});
  }

}