export class CanvasItem {

    image !: HTMLImageElement;
    x !: number;
    y !: number;
    isDragging !: boolean;
    isSelected !: boolean;
    rotateAngle: number = 0;
    connectionSide: string = '';
    connectedItems: { id: number }[] = [];
    hasCollision: boolean = false;
    isConnectionConditionMatched: boolean = false;
    shadowSide: string = '';

    closeImageIcon !: HTMLImageElement;
    closeImageSize: number = 30;

    rotateImageIcon !: HTMLImageElement;
    rotateImageSize: number = 30;

    constructor(image: HTMLImageElement, x: number, y: number, isDragging: boolean, connectionSide: string = '', connectedItems: { id: number }[] = []) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isDragging = isDragging;
        this.rotateAngle = 0;
        this.isSelected = false;
        this.connectionSide = connectionSide;
        this.connectedItems = connectedItems;
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
        this.addExtraBox(ctx);
        this.createConnectionArea(ctx);
        ctx.restore();
        this.addBorderOnSelectedItem(ctx);
    }

    setMatchConnectionInfo(isMatch: boolean, shadowSide: string) {
        this.isConnectionConditionMatched = isMatch;
        this.shadowSide = shadowSide;
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

    addExtraBox(ctx: CanvasRenderingContext2D) {
        const boxWidth = 40;
        const boxHeight = 40;
        const boxS = 20;
        if (this.connectionSide === 'left') {
            ctx.save();
            const boxX = -this.image.width / 2 - boxS - 20;
            const boxY = -20;
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight); // Draw the border
            // ctx.fillRect(boxX + 1, boxY + 1, boxSize - 2, boxSize - 2); // Fill the box

            // Restore the context state
            ctx.restore();
        }
        if (this.connectionSide === 'right') {
            ctx.save();
            const boxX = this.image.width / 2;
            const boxY = -20;
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight); // Draw the border
            // ctx.fillRect(boxX + 1, boxY + 1, boxSize - 2, boxSize - 2); // Fill the box
            // Restore the context state
            ctx.restore();
        }
        if (this.connectionSide === 'both') {
            ctx.save();
            const boxXR = this.image.width / 2;
            const boxY = -20;
            const boxXL = -this.image.width / 2 - boxS - 20;
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxXL, boxY, boxWidth, boxHeight); // Draw the border LEFT
            ctx.strokeRect(boxXR, boxY, boxWidth, boxHeight); // Draw the border RIGHT
            // ctx.fillRect(boxX + 1, boxY + 1, boxSize - 2, boxSize - 2); // Fill the box

            // Restore the context state
            ctx.restore();
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

    createConnectionArea(ctx: CanvasRenderingContext2D) {
        if (this.isConnectionConditionMatched) {
            if (this.shadowSide === 'right') {
                ctx.save();
                const boxX = - this.image.width - 25;
                const boxY = -this.image.width / 2;
                ctx.strokeStyle = 'transparent';
                ctx.lineWidth = 1;
                ctx.fillStyle = 'lightgreen';
                ctx.strokeRect(boxX, boxY, 100, this.image.height); // Draw the border
                ctx.fillRect(boxX + 1, boxY + 1, 100, this.image.height); // Fill the box
                ctx.restore();
            }
            if (this.shadowSide === 'left') {
                ctx.save();
                const boxX = this.image.width / 2;
                const boxY = -this.image.width / 2;
                ctx.strokeStyle = 'transparent';
                ctx.lineWidth = 1;
                ctx.fillStyle = 'lightgreen';
                ctx.strokeRect(boxX, boxY, 100, this.image.height); // Draw the border
                ctx.fillRect(boxX + 1, boxY + 1, 100, this.image.height); // Fill the box
                ctx.restore();
            }
            if (this.shadowSide === 'both') {
                if (this.connectionSide === 'left') {
                    ctx.save();
                    const boxX = - this.image.width - 25;
                    const boxY = -this.image.width / 2;
                    ctx.strokeStyle = 'transparent';
                    ctx.lineWidth = 1;
                    ctx.fillStyle = 'lightgreen';
                    ctx.strokeRect(boxX, boxY, 100, this.image.height); // Draw the border
                    ctx.fillRect(boxX + 1, boxY + 1, 100, this.image.height); // Fill the box
                    ctx.restore();
                }
                if (this.connectionSide === 'right') {
                    ctx.save();
                    const boxX = this.image.width / 2;
                    const boxY = -this.image.width / 2;
                    ctx.strokeStyle = 'transparent';
                    ctx.lineWidth = 1;
                    ctx.fillStyle = 'lightgreen';
                    ctx.strokeRect(boxX, boxY, 100, this.image.height); // Draw the border
                    ctx.fillRect(boxX + 1, boxY + 1, 100, this.image.height); // Fill the box
                    ctx.restore();
                }
            }
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

    isOverLapping(secondItem: CanvasItem): boolean {
        return !(
            this.x + this.image.width <= secondItem.x ||
            secondItem.x + secondItem.image.width <= this.x ||
            this.y + this.image.height <= secondItem.y ||
            secondItem.y + secondItem.image.height <= this.y
        )
    }

    isCollidingTop(secondItem: CanvasItem): boolean {
        return (
            this.y < secondItem.y + secondItem.image.height &&
            this.y >= secondItem.y + secondItem.image.height - 5 &&
            this.x + this.image.width > secondItem.x &&
            this.x < secondItem.x + secondItem.image.width
        );
    }

    isCollidingBottom(secondItem: CanvasItem): boolean {
        return (
            this.y + this.image.height > secondItem.y &&
            this.y + this.image.height <= secondItem.y + 5 &&
            this.x + this.image.width > secondItem.x &&
            this.x < secondItem.x + secondItem.image.width
        );
    }

    isCollidingLeft(secondItem: CanvasItem): boolean {
        return (
            this.x < secondItem.x + secondItem.image.width &&
            this.x >= secondItem.x + secondItem.image.width - 5 &&
            this.y + this.image.height > secondItem.y &&
            this.y < secondItem.y + secondItem.image.height
        );
    }

    isCollidingRight(secondItem: CanvasItem): boolean {
        return (
            this.x + this.image.width > secondItem.x &&
            this.x + this.image.width <= secondItem.x + 5 &&
            this.y + this.image.height > secondItem.y &&
            this.y < secondItem.y + secondItem.image.height
        );
    }

    isItemExtraBoxOverLapping(secondItem: CanvasItem): boolean {
        const boxWidth = 40;
        const boxHeight = 40;
        const boxS = 20;

        if (this.connectionSide === 'right' || this.connectionSide === 'both') {
            const thisBoxX = this.x + this.image.width / 2;
            const thisBoxY = this.y - 20;
            if (secondItem.connectionSide === 'left' || secondItem.connectionSide === 'both') {
                const secondItemBoxX = secondItem.x - secondItem.image.width / 2 - boxS - 20;
                const secondItemBoxY = secondItem.y - 20;

                // Check for overlap between the two boxes
                return !(
                    thisBoxX + boxWidth <= secondItemBoxX || // This box is to the left of the other box
                    secondItemBoxX + boxWidth <= thisBoxX || // This box is to the right of the other box
                    thisBoxY + boxHeight <= secondItemBoxY || // This box is above the other box
                    secondItemBoxY + boxHeight <= thisBoxY    // This box is below the other box
                );
            }
        }
        if (this.connectionSide === 'left' || this.connectionSide === 'both') {
            const thisBoxX = this.x - this.image.width / 2 - boxS - 20;
            const thisBoxY = this.y - 20;

            // Calculate bounding box for the other item's right connection side box
            if (secondItem.connectionSide === 'right' || secondItem.connectionSide === 'both') {
                const secondItemBoxX = secondItem.x + secondItem.image.width / 2;
                const secondItemBoxY = secondItem.y - 20;

                // Check for overlap between the two boxes
                return !(
                    thisBoxX + boxWidth <= secondItemBoxX || // This box is to the left of the other box
                    secondItemBoxX + boxWidth <= thisBoxX || // This box is to the right of the other box
                    thisBoxY + boxHeight <= secondItemBoxY || // This box is above the other box
                    secondItemBoxY + boxHeight <= thisBoxY    // This box is below the other box
                );
            }
        }
        return false;
    }

}
