import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedResearchComponent } from './assigned-research.component';

describe('AssignedResearchComponent', () => {
  let component: AssignedResearchComponent;
  let fixture: ComponentFixture<AssignedResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedResearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
