import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmploisComponent } from './edit-emplois.component';

describe('EditEmploisComponent', () => {
  let component: EditEmploisComponent;
  let fixture: ComponentFixture<EditEmploisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmploisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEmploisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
