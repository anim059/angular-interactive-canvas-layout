export class CanvasItem {

    image !: HTMLImageElement;
    x !: number;
    y !: number;
    isDragging !: boolean;
    hasCollision: boolean = false;

    constructor(image: HTMLImageElement, x: number, y: number, isDragging: boolean) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isDragging = isDragging;
    }

    drawItem(ctx: CanvasRenderingContext2D) {
        this.addShadowOnItemDrag(ctx);
        ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }

    addShadowOnItemDrag(ctx: CanvasRenderingContext2D) {
        if (this.isDragging && !this.hasCollision) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'green';
        } else if (this.isDragging && this.hasCollision) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'red';
        }
        else {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'transparent';
        }
    }

    conatain(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.image.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.image.height
        );
    }

    isOverLapping(secondItem: CanvasItem) {
        return !(
            this.x + this.image.width <= secondItem.x ||
            secondItem.x + secondItem.image.width <= this.x ||
            this.y + this.image.height <= secondItem.y ||
            secondItem.y + secondItem.image.height <= this.y
        )
    }

}