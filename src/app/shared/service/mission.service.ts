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

  refresh():void{
    this.http.get<Mission[]>(environment.apiUrl + '/missions/').subscribe(missions => this.subject.next(missions))
  }

  sauvegarder(mission:Mission):void {
    console.log("entrée dans la méthode sauvegarder mission" + mission.villeDepart)
    this.http.post<Mission>(`${environment.apiUrl}/missions`, mission, httpOptions).subscribe(data => {console.log(data)}, error=>{console.log(error)})

   }

   lister():Observable<Mission[]>{
     this.refresh()
    return this.subject.asObservable();
   }

  supprimerMission(id:number):void{
    this.http.delete<Mission[]>(environment.apiUrl + `/missions/${id}`, httpOptions).subscribe(missions => {this.subject.next(missions)})

  }
}
