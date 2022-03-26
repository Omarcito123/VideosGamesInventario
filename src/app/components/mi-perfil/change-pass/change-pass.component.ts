import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {

  actual = '';
  nueva = '';
  confirma = '';
  hide = true;
  hide2 = true;
  hide3 = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showHidenPass(){
    this.hide = !this.hide;
  }

  showHidenPass2(){
    this.hide2 = !this.hide2;
  }

  showHidenPass3(){
    this.hide3 = !this.hide3;
  }

  changePass(){
    if(this.actual == '' || this.nueva == '' || this.confirma == ''){
      this.api.openSnackBar('Todos los campos son requeridos', 'X', 'error');
    }else{
      if(this.nueva != this.confirma){
        this.api.openSnackBar('La nueva contraseña y la confirmacion no coinciden', 'X', 'error');
      }else{
        this.SpinnerService.show();
        this.api.changePass(this.actual, this.nueva).subscribe(
          (response) => {
            if (response != null) {            
              if (response.state == "Success") {
                this.api.openSnackBar(response.message, 'X', 'success');
                this.onNoClick();
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
            if(error.includes("403")){
              this.authService.logout();
            }
          }
        );      
      }
    }
  }
}
