import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarCierreCajaComponent } from './realizar-cierre-caja.component';

describe('RealizarCierreCajaComponent', () => {
  let component: RealizarCierreCajaComponent;
  let fixture: ComponentFixture<RealizarCierreCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealizarCierreCajaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealizarCierreCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
