import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { sucursales } from '../../../models/sucursales';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css'
})

export class SucursalesComponent implements OnInit {

  sucursalesList: sucursales[];
  selectedSucursal: number;
  userSesion: any;

  constructor(
    public dialogRef: MatDialogRef<SucursalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getSucursalesList();
  }

  getSucursalesList(): void {
    this.SpinnerService.show();
    this.api.getSucursales().subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.sucursalesList = response.data;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar(response.message, 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
          if (error.includes('403')){
            this.authService.logout();
          }
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  seleccionarSucursal(): void{
    if (this.selectedSucursal == null){
      this.api.openSnackBar('Selecciona una sucursal', 'X', 'error');
    }else if (this.selectedSucursal === undefined){
      this.api.openSnackBar('Selecciona una sucursal', 'X', 'error');
    }else{
      this.userSesion.idsucursal = this.selectedSucursal;
      this.userSesion.sucursal = this.sucursalesList.find(x => x.idsucursal === this.selectedSucursal).nombre;
      this.authService.setJwt(this.userSesion);
      this.onNoClick();
    }
  }
}