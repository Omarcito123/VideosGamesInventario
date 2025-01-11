import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialControlHorasComponent } from './historial-control-horas.component';

describe('HistorialControlHorasComponent', () => {
  let component: HistorialControlHorasComponent;
  let fixture: ComponentFixture<HistorialControlHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialControlHorasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialControlHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
