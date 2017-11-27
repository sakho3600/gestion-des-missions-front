import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Mission } from '../domain/mission';
import { environment } from '../../../environments/environment'
import {Observable, BehaviorSubject} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


@Injectable()
export class MissionService {

  subject:BehaviorSubject<Mission[]>  = new BehaviorSubject([])

  constructor(private http: HttpClient) { }

  sauvegarder(mission:Mission):void {
    console.log("entrée dans la méthode sauvegarder mission" + mission.villeDepart)
    this.http.post<Mission>(`${environment.apiUrl}/missions`, mission, httpOptions).subscribe(data => {console.log(data)}, error=>{console.log(error)})
   }
}
