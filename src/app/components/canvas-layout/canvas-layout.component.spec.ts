import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasLayoutComponent } from './canvas-layout.component';

describe('CanvasLayoutComponent', () => {
  let component: CanvasLayoutComponent;
  let fixture: ComponentFixture<CanvasLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
