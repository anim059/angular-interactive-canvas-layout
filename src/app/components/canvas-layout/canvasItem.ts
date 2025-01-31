export class CanvasItem {

    image !: HTMLImageElement;
    x !: number;
    y !: number;
    isDragging !: boolean;

    constructor(image: HTMLImageElement, x: number, y: number, isDragging: boolean) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isDragging = isDragging;
    }

    drawItem(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }

    conatain(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.image.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.image.height
        );
    }

}