import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmploisComponent } from './user-emplois.component';

describe('UserEmploisComponent', () => {
  let component: UserEmploisComponent;
  let fixture: ComponentFixture<UserEmploisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEmploisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserEmploisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
