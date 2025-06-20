import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSessionComponent } from './list-session.component';

describe('ListSessionComponent', () => {
  let component: ListSessionComponent;
  let fixture: ComponentFixture<ListSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
