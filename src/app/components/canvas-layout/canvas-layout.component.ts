import { Component, ElementRef, PLATFORM_ID, ViewChild, inject } from '@angular/core';

import { CanvasItem } from './canvasItem';
import { CanvasItemManager } from './canvasItem-manager';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'canvas-layout',
  standalone: true,
  imports: [],
  templateUrl: './canvas-layout.component.html',
  styleUrl: './canvas-layout.component.css'
})
export class CanvasLayoutComponent {
 @ViewChild('imageCanvas') private canvasRef!: ElementRef;

  private canvas!: HTMLCanvasElement;

  private ctx!: CanvasRenderingContext2D;

  private itemManager = new CanvasItemManager();

  plateformId = inject(PLATFORM_ID);


  ngAfterViewInit() {
    if (isPlatformBrowser(this.plateformId)) {
      this.canvas = this.canvasRef.nativeElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          let image = img;
          image.width = 120;
          image.height = 120;
          this.itemManager.addItem(img, this.canvas.width / 2 - img.width / 2, this.canvas.height / 2 - img.height / 2);
          this.drawCanvas();
        };
      };

      reader.readAsDataURL(file);
    }
  }

  drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.itemManager.drawAll(this.ctx);
  }

  onMouseDown(event: MouseEvent) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    this.itemManager.deselectAllItems(mouseX, mouseY, this.ctx);
    const selectedItem = this.itemManager.selectedItem(mouseX, mouseY);
    // if (selectedItem) {
    //   selectedItem.isDragging = true;
    // }
    this.drawCanvas();
  }

  onMouseMove(event: MouseEvent) {
    this.canvas.style.cursor = 'move';
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    this.itemManager.moveSelectedItem(mouseX, mouseY, this.canvas);
    this.drawCanvas();
  }

  onMouseUp() {
    this.itemManager.deselectItem();
  }

}
