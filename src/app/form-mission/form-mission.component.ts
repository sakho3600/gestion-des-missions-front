import { Component, OnInit } from '@angular/core';
import { MissionService } from '../shared/service/mission.service'
import { Mission } from '../shared/domain/mission';
import { GoogleMapApiService } from '../shared/service/google-map-api.service'
import { Nature } from '../shared/domain/nature';
import { TransportService } from '../shared/service/transport.service';
import { NatureService } from '../shared/service/nature.service';
import { Transport } from '../shared/domain/transport';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FormGroup, FormBuilder, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';
import * as moment from 'moment-business-days';

@Component({
  selector: 'app-form-mission',
  templateUrl: './form-mission.component.html',
  styleUrls: ['./form-mission.component.css']
})

export class FormMissionComponent implements OnInit {

  constructor(private router: Router, public transportService: TransportService, public natureService: NatureService, public missionService: MissionService,
    public mapApi: GoogleMapApiService, private fb: FormBuilder, private authService: AuthService) {
    this.createForm();
  }

  missionForm: FormGroup

  tabNature: Nature[] = [];
  tabTransport: Transport[] = [];

  prime: number = 0;

  createForm() {
    this.missionForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nature: [null, Validators.required],
      vdd: ['', Validators.required],
      vda: ['', Validators.required],
      transport: [null, Validators.required]
    }, { validator: Validators.compose([this.dateDebutValidator('dateDebut', 'transport'), this.dateFinValidator('dateDebut', 'dateFin', 'nature'), this.dateWeekEndValidator('dateDebut', 'dateFin')]) })
  }

  ngOnInit() {
    this.transportService.listerTransport().subscribe(transports => { this.tabTransport = transports; });
    this.natureService.listerNature().subscribe(natures => { this.tabNature = natures; });
  }

  sauvegarder(): void {
    if (this.missionForm.valid) {
      let dateDebut: Date = new Date(this.dateDebut.value.year, this.dateDebut.value.month, this.dateDebut.value.day)
      let dateFin: Date = new Date(this.dateFin.value.year, this.dateFin.value.month, this.dateFin.value.day)
      let vdd: string
      let vda: string
      if (this.vdd.value.formatted_address == null) {
        vdd = this.vdd.value
      } else {
        vdd = this.vdd.value.formatted_address
      }
      if (this.vda.value.formatted_address == null) {
        vda = this.vda.value
      } else {
        vda = this.vda.value.formatted_address
      }
      let mission: Mission = new Mission(0, dateDebut, dateFin, this.nature.value, vdd, vda, this.transport.value, 0, "INITIALE", 0, this.authService.matricule.toString())
      this.missionService.sauvegarder(mission).subscribe(data => this.router.navigate(['/missions']))
    }
  }

  dateDebutValidator(dateDebutString: string, transportString: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      let success: boolean = true
      let errorMsg: string = ``
      let dateDebut = null
      if (group.controls[dateDebutString].value) {
        dateDebut = new Date(group.controls[dateDebutString].value.year, group.controls[dateDebutString].value.month - 1, group.controls[dateDebutString].value.day)
        let transport: Transport = null
        if (group.controls[transportString].value) {
          transport = group.controls[transportString].value
        }
        if (dateDebut.getTime() <= new Date().getTime()) {
          errorMsg = `La date de debut doit être au minimum demain !`
          success = false
        }
        if (transport != null) {
          if (transport.modeTransport === "Avion") {
            let dateAvion: Date = new Date()
            dateAvion.setDate(dateAvion.getDate() + 7)
            if (dateDebut.getTime() < dateAvion.getTime()) {
              errorMsg = `La date de debut doit être au minimum dans 7 jours (Avion)!`
              success = false
            }
          }
        }
      }
      return success ? null : { 'dateDebutValidator': { value: errorMsg } };
    };
  }

  dateWeekEndValidator(dateDebutString: string, dateFinString: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      let success: boolean = true
      let errorMsg: string = null;
      if (group.controls[dateDebutString].value) {
        let dateDebut = new Date(group.controls[dateDebutString].value.year, group.controls[dateDebutString].value.month - 1, group.controls[dateDebutString].value.day)
        if (dateDebut.getDay() == 6 || dateDebut.getDay() == 0) {
          errorMsg = "La date de debut ne peut pas être le weekend!"
          success = false
        }
      }
      if (group.controls[dateFinString].value) {
        let dateFin = new Date(group.controls[dateFinString].value.year, group.controls[dateFinString].value.month - 1, group.controls[dateFinString].value.day)
        if (dateFin.getDay() == 6 || dateFin.getDay() == 0) {
          success = false
          if (errorMsg == null) {
            errorMsg = "La date de fin ne peut pas être le weekend!"
          } else {
            errorMsg = "La date de début et fin ne peuvent pas être le weekend!"
          }

        }
      }
      return success ? null : { 'dateDebutValidator': { value: errorMsg } };
    }
  }

  dateFinValidator(dateDebutString: string, dateFinString: string, natureString: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      let success: boolean = true
      let errorMsg: string = ``
      if (group.controls[dateDebutString].value && group.controls[dateFinString].value) {

        let dateDebut = new Date(group.controls[dateDebutString].value.year, group.controls[dateDebutString].value.month - 1, group.controls[dateDebutString].value.day)
        let dateFin = new Date(group.controls[dateFinString].value.year, group.controls[dateFinString].value.month - 1, group.controls[dateFinString].value.day)
        if (dateFin < dateDebut) {
          errorMsg = `La date de fin ne peut pas être avant la date de début!`
          success = false
        }
        if (group.controls[natureString].value != null) {
          let nature: Nature = group.controls[natureString].value;
          console.log(nature);
          this.prime = moment(dateFin).businessDiff(moment(dateDebut)) * nature.tauxJournalierMoyen * nature.pourcentagePrime / 100;
        }
      }

      return success ? null : { 'dateFinValidator': { value: errorMsg } };
    };
  }

  byId(item1: any, item2: any): boolean {
    return false
  }

  get dateDebut() { return this.missionForm.get('dateDebut'); }
  get dateFin() { return this.missionForm.get('dateFin'); }
  get nature() { return this.missionForm.get('nature'); }
  get transport() { return this.missionForm.get('transport'); }
  get vdd() { return this.missionForm.get('vdd'); }
  get vda() { return this.missionForm.get('vda'); }
}