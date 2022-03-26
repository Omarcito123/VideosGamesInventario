export class productoCar {
    idprodinv: number;
    categoria: string;
    dateadd: string;
    datemod: string;
    estado: string;
    existencia: number;
    idsucursal: number;
    iduseradd: number;
    idusermod: number;
    nombre: string;
    preciocosto: number;
    preciooferta: number;
    precioregular: number;
    serie: string;
    cantidad: number;
    precioTotal: number;
    descuento: number;

    constructor(idprodinv: number, categoria: string, dateadd: string, datemod: string, estado: string, existencia: number, idsucursal: number, iduseradd: number, idusermod: number, nombre: string, preciocosto: number, preciooferta: number, precioregular: number, serie: string, cantidad: number, precioTotal: number, descuento: number){
        this.idprodinv = idprodinv;
        this.categoria = categoria;
        this.dateadd = dateadd;
        this.datemod = datemod;
        this.estado = estado;
        this.existencia = existencia;
        this.idsucursal = idsucursal;
        this.iduseradd = iduseradd;
        this.idusermod = idusermod;
        this.nombre = nombre;
        this.preciocosto = preciocosto;
        this.preciooferta = preciooferta;
        this.precioregular = precioregular;
        this.serie = serie;
        this.cantidad = cantidad;
        this.precioTotal = precioTotal;
        this.descuento = descuento;
    }
}