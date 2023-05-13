import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedResearchComponent } from './submitted-research.component';

describe('SubmittedResearchComponent', () => {
  let component: SubmittedResearchComponent;
  let fixture: ComponentFixture<SubmittedResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittedResearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
