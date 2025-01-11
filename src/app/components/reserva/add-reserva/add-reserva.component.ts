import { venta } from '../../../models/venta';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { categoria } from '../../../models/categoria';
import { Component, OnInit } from '@angular/core';
import { lista } from '../../../models/lista';
import { ApiService } from '../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-reserva',
  templateUrl: './add-reserva.component.html',
  styleUrl: './add-reserva.component.css'
})

export class AddReservaComponent implements OnInit {
  ventaInv = new venta();
  addReservaForm: FormGroup;
  categoriasList: categoria[];
  tipoPagoList: lista[];
  tipoPostList: lista[];
  comprobantesList: lista[];
  selectedComprobante: string;
  userSesion: any;
  ventaList: Array<venta> = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.addReservaForm = this.fb.group({
      nombreproducto: ['', [Validators.required, Validators.maxLength(500)]],
      categoria: ['', [Validators.required, Validators.maxLength(100)]],
      cantidad: ['', [Validators.required, Validators.max(999)]],
      preciounitario: ['', [Validators.required, Validators.max(999999)]],
      descuento: ['', [Validators.required, Validators.max(999999)]],
      preciototal: ['', [Validators.required, Validators.max(999999)]],
      tipopago: ['', [Validators.required, Validators.maxLength(100)]],
      post: ['', ''],
      comprobanteS: ['', [Validators.required, Validators.maxLength(100)]],
      factura: ['', ''],
      recibo: ['', ''],
    });
  }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getCategoriasList();
    this.getComprobanteList();
    this.getPostList();
    this.getTipoPagoList();
    this.ventaInv.cantidad = 1;
    this.ventaInv.preciounitario = 0;
    this.ventaInv.descuento = 0;
    this.ventaInv.preciototal = 0;
  }

  getCategoriasList(): void {
    this.SpinnerService.show();
    this.api.getCategoriasList().subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.categoriasList = response.data;
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
        if (error.includes('403')) {
          this.authService.logout();
        }
      }
    );
  }

  calcularTotalProd(): void {
    this.ventaInv.preciototal =
      this.ventaInv.cantidad * this.ventaInv.preciounitario -
      this.ventaInv.descuento;
  }

  getTipoPagoList(): void {
    this.tipoPagoList = [
      { value: 1, description: 'Tarjeta' },
      { value: 2, description: 'Efectivo' },
      { value: 3, description: 'QR o Transferencias' },
      { value: 4, description: 'Pago en linea retira en sucursal' },
    ];
  }

  getPostList(): void {
    this.tipoPostList = [
      { value: 1, description: 'Agricola' },
      { value: 2, description: 'Credomatic' },
      { value: 3, description: 'Davivienda' },
      { value: 4, description: 'Cuscatlan' },
    ];
  }

  getComprobanteList(): void {
    this.comprobantesList = [
      { value: 1, description: 'Factura' },
      { value: 2, description: 'Sin Recibo' },
      { value: 3, description: 'Recibo' },
    ];
  }

  agregarReserva(): void {
    this.ventaList = [];
    if (this.addReservaForm.valid) {
      this.SpinnerService.show();
      if (
        this.selectedComprobante === 'Factura'
      ) {
        if (
          this.ventaInv.factura == null ||
          this.ventaInv.factura === undefined ||
          this.ventaInv.factura === ''
        ) {
          this.api.openSnackBar(
            'Ingrese el numero de la factura',
            'X',
            'error'
          );
          return;
        }
      }
      if (
        this.selectedComprobante === 'Recibo'
      ) {
        if (
          this.ventaInv.recibo == null ||
          this.ventaInv.recibo === undefined ||
          this.ventaInv.recibo === ''
        ) {
          this.api.openSnackBar(
            'Ingrese el numero del recibo',
            'X',
            'error'
          );
          return;
        }
      }
      if (
        this.selectedComprobante === 'Factura'
      ) {
        this.ventaInv.recibo = '';
      }
      if (
        this.selectedComprobante === 'Recibo'
      ) {
        this.ventaInv.factura = '';
      }
      if (
        this.selectedComprobante === 'Sin Recibo'
      ) {
        this.ventaInv.factura = '';
        this.ventaInv.recibo = '';
      }
      this.ventaInv.tipoventa = 'Reserva';
      this.ventaInv.estadoreserva = 'Reserva';
      this.ventaInv.idproducto = 0;
      this.ventaInv.idsucursal = this.userSesion.idsucursal;
      this.ventaInv.iduseradd = this.userSesion.iduser;
      this.ventaInv.idusermod = 0;
      this.ventaList.push(this.ventaInv);
      this.api.createVenta(this.ventaList).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.clearReserva();
              this.api.openSnackBar(
                'Reserva realizada exitosamente',
                'X',
                'success'
              );
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
          if (error.includes('403')) {
            this.authService.logout();
          }
        }
      );
    } else {
      this.api.openSnackBar('Todos los campos son requeridos', 'X', 'error');
    }
  }

  clearReserva(): void {
    this.ventaInv = new venta();
    this.ventaList = [];
  }
}