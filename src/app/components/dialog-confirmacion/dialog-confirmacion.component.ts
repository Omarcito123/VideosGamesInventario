import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacion',
  templateUrl: './dialog-confirmacion.component.html',
  styleUrls: ['./dialog-confirmacion.component.css']
})
export class DialogConfirmacionComponent implements OnInit {

  mensaje: string;
  btn = 'aceptar';

  constructor(public dialogRef: MatDialogRef<DialogConfirmacionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.mensaje = data.mensaje;
              }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
