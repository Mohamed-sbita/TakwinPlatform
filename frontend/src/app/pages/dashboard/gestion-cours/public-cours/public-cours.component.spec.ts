import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCoursComponent } from './public-cours.component';

describe('PublicCoursComponent', () => {
  let component: PublicCoursComponent;
  let fixture: ComponentFixture<PublicCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
