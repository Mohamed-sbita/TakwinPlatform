import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicActualiteComponent } from './public-actualite.component';

describe('PublicActualiteComponent', () => {
  let component: PublicActualiteComponent;
  let fixture: ComponentFixture<PublicActualiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicActualiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
