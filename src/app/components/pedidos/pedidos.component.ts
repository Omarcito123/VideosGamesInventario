import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  userSesion: any;
  rol = '';
  isActive = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
  }

  onTabClick(event): void{
    if(event.index === 0){
      this.isActive = true;
    }else{
      this.isActive = false;
    }
  }
}
