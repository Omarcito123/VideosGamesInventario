import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasMensualesComponent } from './compras-mensuales.component';

describe('ComprasMensualesComponent', () => {
  let component: ComprasMensualesComponent;
  let fixture: ComponentFixture<ComprasMensualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasMensualesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprasMensualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
