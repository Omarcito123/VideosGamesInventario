import { lista } from './../../models/lista';
import { reparacionEnc } from './../../models/reparacionEnc';
import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { AddEditReparacionComponent } from './add-edit-reparacion/add-edit-reparacion.component';
import { MatDialog } from '@angular/material/dialog';
import { reparacionDet } from '../../models/reparacionDet';
import { AddEditDetalleRepComponent } from './add-edit-detalle-rep/add-edit-detalle-rep.component';
import { userInv } from '../../models/userInv';
import { venta } from '../../models/venta';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reparaciones',
  templateUrl: './reparaciones.component.html',
  styleUrl: './reparaciones.component.css'
})

export class ReparacionesComponent implements OnInit {
  reparacionesList: Array<reparacionEnc> = [];
  reparacionDetList: Array<reparacionDet> = [];
  isDetalle = false;
  usersList: userInv[];
  repEncabezado = new reparacionEnc();
  payProductCarForm: FormGroup;
  comprobantesList: lista[];
  selectedComprobante: string;
  selectedVendedor: number;
  numberFactura: string;
  numberRecibo: string;
  userSesion: any;
  ventaList: Array<venta> = [];
  rol = '';

  displayedColumns: string[] = [
    'cliente',
    'telefono',
    'dui',
    'descripcion',
    'fecha',
    'options',
  ];
  dataSource = new MatTableDataSource<any>();

  displayedColumns2: string[] = [
    'cantidad',
    'nombre',
    'nota',
    'precio',
    'total',
    'options',
  ];
  dataSource2 = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private api: ApiService,
    private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.payProductCarForm = this.fb.group({
      vendedorS: ['', [Validators.required]],
      comprobanteS: ['', [Validators.required]],
      facturaS: ['', ''],
      reciboS: ['', ''],
    });
  }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.getReparacionesInvList();
    this.getComprobanteList();
    this.getUserList();
  }

  getComprobanteList(): void {
    this.comprobantesList = [
      { value: 1, description: 'Factura' },
      { value: 2, description: 'Sin Recibo' },
      { value: 3, description: 'Recibo' },
    ];
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getReparacionesInvList(): void {
    this.SpinnerService.show();
    const reparacion = new reparacionEnc();
    this.api.getReparacionesInvList(reparacion).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.reparacionesList = response.data;
            this.dataSource = new MatTableDataSource(this.reparacionesList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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

  addReparacion(): void {
    const dialogRef = this.dialog.open(AddEditReparacionComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getReparacionesInvList();
    });
  }

  editReparacion(reparacionEdit: any): void {
    const dialogRef = this.dialog.open(AddEditReparacionComponent, {
      data: reparacionEdit,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getReparacionesInvList();
    });
  }

  addRepuestos(reparacionEdit: any): void {
    this.isDetalle = true;
    this.repEncabezado = reparacionEdit;
    this.numberRecibo = this.repEncabezado.recibo;
    this.getReparacionDetallesInvList();
  }

  deleteReparacion(reparacionDe: any): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: { mensaje: 'Esta seguro que desea eliminar al usuario?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.logicDeleteReparacion(reparacionDe).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.getReparacionesInvList();
                this.api.openSnackBar(
                  'El registro fue eliminado con exito!',
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
            this.api.openSnackBar(error, 'X', 'error');
          }
        );
      }
    });
  }

  /* Detalles de las reparaciones */
  getReparacionDetallesInvList(): void {
    this.SpinnerService.show();
    const repDet = new reparacionDet();
    repDet.idreparacionenc = this.repEncabezado.idreparacionenc;
    this.api.getReparacionDetallesInvList(repDet).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.reparacionDetList = response.data;
            this.dataSource2 = new MatTableDataSource(this.reparacionDetList);
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
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

  addDetalle(): void {
    const dialogRef = this.dialog.open(AddEditDetalleRepComponent, {
      data: this.repEncabezado,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getReparacionDetallesInvList();
    });
  }

  editDetalle(detalleEdit: any): void {
    const dialogRef = this.dialog.open(AddEditDetalleRepComponent, {
      data: detalleEdit,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getReparacionDetallesInvList();
    });
  }

  goBackRepEnc(): void {
    this.isDetalle = false;
  }

  getUserList(): void {
    this.SpinnerService.show();
    this.api.getUsersBodegaList().subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            this.usersList = response.data;
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

  entregarRep(): void {
    this.ventaList = [];
    if (this.payProductCarForm.valid) {
      if (this.selectedComprobante === 'Factura') {
        if (
          this.numberFactura == null ||
          this.numberFactura === undefined ||
          this.numberFactura === ''
        ) {
          this.api.openSnackBar(
            'Ingrese el numero de la factura',
            'X',
            'error'
          );
          return;
        }
      }
      if (this.selectedComprobante === 'Recibo') {
        if (
          this.numberRecibo === null ||
          this.numberRecibo === undefined ||
          this.numberRecibo === ''
        ) {
          this.api.openSnackBar(
            'Ingrese el numero del recibo',
            'X',
            'error'
          );
          return;
        }
      }
      this.SpinnerService.show();
      const iduseradd = this.selectedVendedor;
      this.reparacionDetList.forEach((ventaObj) => {
        const ventaCar = new venta();
        ventaCar.tipopago = 'Efectivo';
        ventaCar.tipoventa = 'Reparacion';
        ventaCar.post = '';
        ventaCar.factura = this.numberFactura;
        ventaCar.idproducto = ventaObj.idproducto;
        ventaCar.categoria = ventaObj.categoriaproducto;
        ventaCar.nombreproducto = ventaObj.nombreproducto;
        ventaCar.cantidad = ventaObj.cantidad;
        ventaCar.preciounitario = ventaObj.precioregular;
        ventaCar.preciototal = ventaObj.preciototal;
        ventaCar.descuento = 0;
        ventaCar.idsucursal = this.userSesion.idsucursal;
        ventaCar.iduseradd = iduseradd;
        ventaCar.idusermod = 0;
        this.ventaList.push(ventaCar);
      });
      this.api.createVenta(this.ventaList).subscribe(
        (response) => {
          if (response != null) {
            if (response.state === 'Success') {
              this.bajaReparacionPorEntrega();
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
      $('#vendedorSelect').trigger('focus');
      $('#vendedorSelect').trigger('focusout');
      $('#vendedorSelect').trigger('blur');
      $('#comprobanteSelect').trigger('focus');
      $('#comprobanteSelect').trigger('focusout');
      $('#comprobanteSelect').trigger('blur');
    }
  }

  bajaReparacionPorEntrega(): void {
    this.repEncabezado.estado = false;
    this.api.updateReparaionInv(this.repEncabezado).subscribe(
      (response) => {
        if (response != null) {
          if (response.state === 'Success') {
            location.reload();
            this.api.openSnackBar(
              'Reparacion finalizada exitosamente',
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
  }

  deleteReparacionDet(reparacionDe: any): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: { mensaje: 'Esta seguro que desea eliminar el repuesto?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.deleteReparacionDet(reparacionDe).subscribe(
          (response) => {
            if (response != null) {
              if (response.state === 'Success') {
                this.getReparacionDetallesInvList();
                this.api.openSnackBar(
                  'El registro fue eliminado con exito!',
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
            this.api.openSnackBar(error, 'X', 'error');
          }
        );
      }
    });
  }
}