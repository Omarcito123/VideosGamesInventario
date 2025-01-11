import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReparacionComponent } from './add-edit-reparacion.component';

describe('AddEditReparacionComponent', () => {
  let component: AddEditReparacionComponent;
  let fixture: ComponentFixture<AddEditReparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditReparacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
