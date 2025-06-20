import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateurEmploisComponent } from './formateur-emplois.component';

describe('FormateurEmploisComponent', () => {
  let component: FormateurEmploisComponent;
  let fixture: ComponentFixture<FormateurEmploisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormateurEmploisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormateurEmploisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
