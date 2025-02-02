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
                item.isSelected = true;
                item.isDragging = true;
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

    moveSelectedItem(mouseX: number, mouseY: number, canvas: HTMLCanvasElement): void {
        if (this.selectedCanvasItem?.isDragging) {
            if (0 <= this.selectedCanvasItem.x && (canvas.width >= (this.selectedCanvasItem.x + this.selectedCanvasItem.image.width))) {
                if ((mouseX - this.selectedItemStartX) > 0 && (mouseX - this.selectedItemStartX) < (canvas.width - this.selectedCanvasItem.image.width)) {
                    this.selectedCanvasItem.x = mouseX - this.selectedItemStartX;
                } else if ((mouseX - this.selectedItemStartX) >= (canvas.width - this.selectedCanvasItem.image.width)) {
                    this.selectedCanvasItem.x = canvas.width - this.selectedCanvasItem.image.width - 1;
                }
                else {
                    this.selectedCanvasItem.x = 0
                }
            }
            if (0 <= this.selectedCanvasItem.y && (canvas.height >= (this.selectedCanvasItem.y + this.selectedCanvasItem.image.height))) {
                if ((mouseY - this.selectedItemStartY) > 0 && (mouseY - this.selectedItemStartY) < (canvas.height - this.selectedCanvasItem.image.height)) {
                    this.selectedCanvasItem.y = mouseY - this.selectedItemStartY;
                } else if ((mouseY - this.selectedItemStartY) >= (canvas.height - this.selectedCanvasItem.image.height)) {
                    this.selectedCanvasItem.y = canvas.height - this.selectedCanvasItem.image.height - 1;
                }
                else {
                    this.selectedCanvasItem.y = 0
                }
            }
        }
        if (this.isCursorOverCloseIcon(mouseX, mouseY) || this.isCursorOverRotateIcon(mouseX, mouseY)) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'move';
        }
        if (this.selectedCanvasItem && this.selectedItemPrevX && this.selectedItemPrevY) {
            for (const item of this.items) {
                if (item !== this.selectedCanvasItem) {
                    if (this.selectedCanvasItem.isCollidingLeft(item) && this.selectedCanvasItem.isDragging) {
                        console.log('Colliding with the left side of item');
                        this.selectedCanvasItem.hasCollision = true;
                        break;
                    } else if (this.selectedCanvasItem.isCollidingRight(item) && this.selectedCanvasItem.isDragging) {
                        console.log('Colliding with the right side of item');
                        this.selectedCanvasItem.hasCollision = true;
                        break;
                    } else if (this.selectedCanvasItem.isCollidingTop(item) && this.selectedCanvasItem.isDragging) {
                        console.log('Colliding with the top side of item');
                        this.selectedCanvasItem.hasCollision = true;
                        break;
                    } else if (this.selectedCanvasItem.isCollidingBottom(item) && this.selectedCanvasItem.isDragging) {
                        console.log('Colliding with the bottom side of item');
                        this.selectedCanvasItem.hasCollision = true;
                        break;
                    }
                } else {
                    this.selectedCanvasItem.hasCollision = false;
                }
            };
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
            this.selectedItemStartX = 0;
            this.selectedItemStartY = 0;
        }
    }

    deselectAllItems(mouseX: number, mouseY: number, ctx: CanvasRenderingContext2D): void {
        if (this.selectedCanvasItem && this.isCursorOverCloseIcon(mouseX, mouseY)) {
            this.items.splice(this.items.indexOf(this.selectedCanvasItem), 1);
        }
        // if (this.selectedCanvasItem) {
        //     const targetAngle = (this.selectedCanvasItem.rotateAngle + 45) % 360;
        //     const animate = () => {
        //         if (this.selectedCanvasItem && Math.abs(this.selectedCanvasItem.rotateAngle - targetAngle) > 1) {
        //             this.selectedCanvasItem.rotateAngle +=
        //                 45 > 0 ? 1 : -1; // Increment towards the target angle
        //             this.drawAll(ctx);
        //             requestAnimationFrame(animate);
        //         } else {
        //             if (this.selectedCanvasItem) {
        //                 this.selectedCanvasItem.rotateAngle = targetAngle; // Snap to the target angle
        //                 this.drawAll(ctx);
        //             }
        //         }
        //     };
        //     animate();
        // }
        if (this.selectedCanvasItem && this.isCursorOverRotateIcon(mouseX, mouseY)) {
            this.selectedCanvasItem.rotate(45);
            this.drawAll(ctx);
            return;
        }
        this.selectedCanvasItem = null;
        this.items.forEach(item => {
            item.isSelected = false;
            item.isDragging = false;
        });
    }

    isCursorOverCloseIcon(mouseX: number, mouseY: number): boolean {
        return (this.selectedCanvasItem?.isSelected && this.selectedCanvasItem.isCloseIconClicked(mouseX, mouseY)) as boolean;
    }

    isCursorOverRotateIcon(mouseX: number, mouseY: number): boolean {
        return (this.selectedCanvasItem?.isSelected && this.selectedCanvasItem.isRotateIconClicked(mouseX, mouseY)) as boolean;
    }

    drawAll(ctx: CanvasRenderingContext2D): void {
        this.items.forEach(item => {
            item.drawItem(ctx);
            ctx.setLineDash([]);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        });
    }
}
