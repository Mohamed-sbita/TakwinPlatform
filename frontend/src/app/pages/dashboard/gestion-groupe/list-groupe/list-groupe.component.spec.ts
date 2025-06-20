import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupeComponent } from './list-groupe.component';

describe('ListGroupeComponent', () => {
  let component: ListGroupeComponent;
  let fixture: ComponentFixture<ListGroupeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGroupeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
