import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialReservaComponent } from './historial-reserva.component';

describe('HistorialReservaComponent', () => {
  let component: HistorialReservaComponent;
  let fixture: ComponentFixture<HistorialReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialReservaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
