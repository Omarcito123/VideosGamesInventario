import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditComisionComponent } from './add-edit-comision.component';

describe('AddEditComisionComponent', () => {
  let component: AddEditComisionComponent;
  let fixture: ComponentFixture<AddEditComisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditComisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
