export class CanvasItem {

    image !: HTMLImageElement;
    x !: number;
    y !: number;
    isDragging !: boolean;
    isSelected !: boolean;
    rotateAngle: number = 0;
    hasCollision: boolean = false;

    closeImageIcon !: HTMLImageElement;
    closeImageSize: number = 30;

    rotateImageIcon !: HTMLImageElement;
    rotateImageSize: number = 30;

    constructor(image: HTMLImageElement, x: number, y: number, isDragging: boolean) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isDragging = isDragging;
        this.rotateAngle = 0;
        this.isSelected = false;
        this.closeImageIcon = new Image();
        this.closeImageIcon.src = 'icons/close-black-2.svg';
        this.rotateImageIcon = new Image();
        this.rotateImageIcon.src = 'icons/rotate-left.svg';
    }

    drawItem(ctx: CanvasRenderingContext2D) {
        this.addShadowWhenDragging(ctx);
        ctx.save();
        const centerX = this.x + this.image.width / 2;
        const centerY = this.y + this.image.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotateAngle * Math.PI / 180);
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
        ctx.restore();
        this.addBorderOnSelectedItem(ctx);
    }

    addShadowWhenDragging(ctx: CanvasRenderingContext2D) {
        if (this.isDragging && !this.hasCollision) {
            ctx.shadowColor = '#00a814';
            ctx.shadowBlur = 8;
        } else if (this.isDragging && this.hasCollision) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'red';
        }
        else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    }

    addBorderOnSelectedItem(ctx: CanvasRenderingContext2D) {
        if (this.isSelected) {
            ctx.save();
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.x, this.y, this.image.width, this.image.height);
            ctx.drawImage(this.closeImageIcon, this.x - 8, this.y - 24, this.closeImageSize, this.closeImageSize);
            ctx.drawImage(this.rotateImageIcon, this.x + this.image.width - 20, this.y - 24, this.rotateImageSize, this.rotateImageSize);
            ctx.restore();
        } else {
            ctx.strokeStyle = 'transparent';
            ctx.lineWidth = 0;
            ctx.setLineDash([]);
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

    isCloseIconClicked(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x - 8 &&
            mouseX <= this.x - 8 + this.closeImageSize &&
            mouseY >= this.y - 24 &&
            mouseY <= this.y - 24 + this.closeImageSize
        )
    }

    isRotateIconClicked(mouseX: number, mouseY: number) {
        return (
            mouseX >= this.x + this.image.width - 20 &&
            mouseX <= this.x + this.image.width - 20 + this.closeImageSize &&
            mouseY >= this.y - 24 &&
            mouseY <= this.y - 24 + this.closeImageSize
        )
    }

    rotate(degrees: number): void {
        this.rotateAngle += degrees; // Increment the rotation angle
        this.rotateAngle %= 360; // Keep the angle within 0-360 degrees
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
