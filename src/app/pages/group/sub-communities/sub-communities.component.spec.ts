import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCommunitiesComponent } from './sub-communities.component';

describe('SubCommunitiesComponent', () => {
  let component: SubCommunitiesComponent;
  let fixture: ComponentFixture<SubCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCommunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
