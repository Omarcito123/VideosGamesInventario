import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCierreCajaComponent } from './historial-cierre-caja.component';

describe('HistorialCierreCajaComponent', () => {
  let component: HistorialCierreCajaComponent;
  let fixture: ComponentFixture<HistorialCierreCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialCierreCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCierreCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
