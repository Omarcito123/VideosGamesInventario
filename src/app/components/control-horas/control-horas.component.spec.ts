import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlHorasComponent } from './control-horas.component';

describe('ControlHorasComponent', () => {
  let component: ControlHorasComponent;
  let fixture: ComponentFixture<ControlHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlHorasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
