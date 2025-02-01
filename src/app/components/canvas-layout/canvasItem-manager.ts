import { CanvasItem } from "./canvasItem";

export class CanvasItemManager {
    private items: CanvasItem[] = [];
    private selectedCanvasItem: CanvasItem | null = null;
    selectedItemStartX !: number;
    selectedItemStartY !: number;
    selectedItemPrevX !: number;
    selectedItemPrevY !: number;

    addItem(image: HTMLImageElement, x: number, y: number): void {
        const newItem = new CanvasItem(image, x, y, false);
        this.items.push(newItem);
    }

    getItems(): CanvasItem[] {
        return this.items;
    }

    selectedItem(mouseX: number, mouseY: number): CanvasItem | null {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (item.conatain(mouseX, mouseY)) {
                this.selectedItemStartX = mouseX - item.x;
                this.selectedItemStartY = mouseY - item.y;
                this.selectedItemPrevX = item.x;
                this.selectedItemPrevY = item.y;
                this.selectedCanvasItem = item;
                this.items.splice(i, 1);
                this.items.push(item);
                return item;
            }
        }
        return null;
    }

    moveSelectedItem(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number): void {
        if (this.selectedCanvasItem) {
            if (0 <= this.selectedCanvasItem.x && (canvasWidth >= (this.selectedCanvasItem.x + this.selectedCanvasItem.image.width))) {
                if ((mouseX - this.selectedItemStartX) > 0 && (mouseX - this.selectedItemStartX) < (canvasWidth - this.selectedCanvasItem.image.width)) {
                    this.selectedCanvasItem.x = mouseX - this.selectedItemStartX;
                } else if ((mouseX - this.selectedItemStartX) >= (canvasWidth - this.selectedCanvasItem.image.width)) {
                    this.selectedCanvasItem.x = canvasWidth - this.selectedCanvasItem.image.width - 1;
                }
                else {
                    this.selectedCanvasItem.x = 0
                }
            }
            if (0 <= this.selectedCanvasItem.y && (canvasHeight >= (this.selectedCanvasItem.y + this.selectedCanvasItem.image.height))) {
                if ((mouseY - this.selectedItemStartY) > 0 && (mouseY - this.selectedItemStartY) < (canvasHeight - this.selectedCanvasItem.image.height)) {
                    this.selectedCanvasItem.y = mouseY - this.selectedItemStartY;
                } else if ((mouseY - this.selectedItemStartY) >= (canvasHeight - this.selectedCanvasItem.image.height)) {
                    this.selectedCanvasItem.y = canvasHeight - this.selectedCanvasItem.image.height - 1;
                }
                else {
                    this.selectedCanvasItem.y = 0
                }
            }
            if (this.selectedItemPrevX && this.selectedItemPrevY) {
                for (const item of this.items) {
                    if (item !== this.selectedCanvasItem && this.selectedCanvasItem?.isOverLapping(item)) {
                        this.selectedCanvasItem.hasCollision = true;
                        break;
                    }else{
                        this.selectedCanvasItem.hasCollision = false;
                    }
                };
            }
        }
    }

    deselectItem(): void {
        if (this.selectedCanvasItem) {
            if (this.selectedCanvasItem.hasCollision) {
                this.selectedCanvasItem.x = this.selectedItemPrevX;
                this.selectedCanvasItem.y = this.selectedItemPrevY;
                this.selectedCanvasItem.hasCollision = false;
            }
            this.selectedCanvasItem.isDragging = false;
            this.selectedCanvasItem = null;
            this.selectedItemStartX = 0;
            this.selectedItemStartY = 0;
        }
    }

    drawAll(ctx: CanvasRenderingContext2D): void {
        this.items.forEach(item => item.drawItem(ctx));
    }
}