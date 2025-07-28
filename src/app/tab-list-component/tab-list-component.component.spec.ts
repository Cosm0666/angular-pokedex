import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabListComponentComponent } from './tab-list-component.component';

describe('TabListComponentComponent', () => {
  let component: TabListComponentComponent;
  let fixture: ComponentFixture<TabListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
