import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNotaComponent } from './add-edit-nota.component';

describe('AddEditNotaComponent', () => {
  let component: AddEditNotaComponent;
  let fixture: ComponentFixture<AddEditNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditNotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
