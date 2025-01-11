import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  userSesion: any;
  rol = '';

  constructor(public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
  }

  openDialogLogout(): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '400px',
      data: {mensaje: '¿Estas seguro que quieres cerrar la sesion?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.authService.logout();
      }
    });
  }
}