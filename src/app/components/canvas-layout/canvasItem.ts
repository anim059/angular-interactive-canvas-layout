export class CanvasItem {

    image !: HTMLImageElement;
    width !: number;
    height !: number;
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

    sideBoxWidth !: number;
    sideBoxHeight !: number;
    sideBoxPadding !: number;

    secondItemInfo !: CanvasItem;

    constructor(image: HTMLImageElement, x: number, y: number, isDragging: boolean, connectionSide: string = '', connectedItems: { id: number }[] = []) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = image.width;
        this.height = image.height;
        this.isDragging = isDragging;
        this.rotateAngle = 0;
        this.isSelected = false;
        this.connectionSide = connectionSide;
        this.connectedItems = connectedItems;
        this.closeImageIcon = new Image();
        this.closeImageIcon.src = 'icons/close-black-2.svg';
        this.rotateImageIcon = new Image();
        this.rotateImageIcon.src = 'icons/rotate-left.svg';
        this.sideBoxWidth = 40;
        this.sideBoxHeight = (this.height * 30) / 100;
        this.sideBoxPadding = this.sideBoxWidth;
    }

    drawItem(ctx: CanvasRenderingContext2D) {
        this.addShadowWhenDragging(ctx);
        // ctx.save();
        // const centerX = this.x + this.image.width / 2;
        // const centerY = this.y + this.image.height / 2;
        // ctx.translate(centerX, centerY);
        // ctx.rotate(this.rotateAngle * Math.PI / 180);
        // ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
        ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
        this.addExtraBox(ctx);
        this.createConnectionArea(ctx);
        ctx.restore();
        this.addBorderOnSelectedItem(ctx);
    }

    mergeConnectedItems(updatedX: number, updatedY: number, otherItemWidth: number, otherItemConnectionSide: string) {
        if (this.connectionSide === 'left') {
            this.x = updatedX + otherItemWidth;
            this.y = updatedY;
        } else if (this.connectionSide === 'right') {
            this.x = updatedX - otherItemWidth;
            this.y = updatedY;
        } else if (this.connectionSide === 'both') {
            if (otherItemConnectionSide === 'left') {
                this.x = updatedX - otherItemWidth;
                this.y = updatedY;
            } else if (otherItemConnectionSide === 'right') {
                this.x = updatedX + otherItemWidth;
                this.y = updatedY;
            }
        }
    }

    setMatchConnectionInfo(isMatch: boolean, secondItemInfo: CanvasItem, shadowSide: string) {
        this.isConnectionConditionMatched = isMatch;
        this.shadowSide = shadowSide;
        this.secondItemInfo = secondItemInfo;
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
        if (this.connectionSide === 'left') {
            ctx.save();
            const boxX = this.x - this.sideBoxWidth;
            const boxY = this.y + this.height / 2 - this.sideBoxPadding / 2;
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxX, boxY, this.sideBoxWidth, this.sideBoxHeight); // Draw the border
            // ctx.fillRect(boxX + 1, boxY + 1, boxSize - 2, boxSize - 2); // Fill the box

            // Restore the context state
            ctx.restore();
        }
        if (this.connectionSide === 'right') {
            ctx.save();
            const boxX = this.x + this.width;
            const boxY = this.y + this.height / 2 - this.sideBoxPadding / 2;
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxX, boxY, this.sideBoxWidth, this.sideBoxHeight); // Draw the border
            // ctx.fillRect(boxX + 1, boxY + 1, boxSize - 2, boxSize - 2); // Fill the box
            // Restore the context state
            ctx.restore();
        }
        if (this.connectionSide === 'both') {
            ctx.save();
            const boxXR = this.x + this.width;
            const boxY = this.y + this.height / 2 - this.sideBoxPadding / 2;
            const boxXL = this.x - this.sideBoxWidth;
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxXL, boxY, this.sideBoxWidth, this.sideBoxHeight); // Draw the border LEFT
            ctx.strokeRect(boxXR, boxY, this.sideBoxWidth, this.sideBoxHeight); // Draw the border RIGHT
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
                const boxX = this.x + this.width;
                const boxY = this.y;
                // ctx.strokeStyle = 'transparent';
                // ctx.lineWidth = 1;
                // ctx.fillStyle = 'lightgreen';
                // ctx.strokeRect(boxX, boxY, 100, this.secondItemInfo.image.height); // Draw the border
                // ctx.fillRect(boxX + 1, boxY + 1, 100, this.secondItemInfo.image.height); // Fill the box
                // Apply a green tint to the image
                ctx.globalAlpha = 0.5; // Set transparency for the shadow
                ctx.fillStyle = 'rgba(0, 87, 0, 0.53)'; // Green tint with transparency
                ctx.fillRect(boxX + 1, boxY + 1, this.secondItemInfo.image.width, this.secondItemInfo.image.height); // Draw a green rectangle as the shadow background
                // Draw the shadow image beside the original image
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX + 1, // Offset horizontally to place the shadow beside the image
                    boxY + 1,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
                ctx.restore();
            } else if (this.shadowSide === 'left') {
                ctx.save();
                const boxX = this.x - this.secondItemInfo.image.width;
                const boxY = this.y;
                // ctx.strokeStyle = 'transparent';
                // ctx.lineWidth = 1;
                // ctx.fillStyle = 'lightgreen';
                // ctx.strokeRect(boxX, boxY, 100, this.secondItemInfo.image.height); // Draw the border
                // ctx.fillRect(boxX + 1, boxY + 1, 100, this.secondItemInfo.image.height); // Fill the box
                ctx.globalAlpha = 0.5; // Set transparency for the shadow
                ctx.fillStyle = 'rgba(0, 87, 0, 0.53)'; // Green tint with transparency
                ctx.fillRect(boxX + 1, boxY + 1, this.secondItemInfo.image.width, this.secondItemInfo.image.height); // Draw a green rectangle as the shadow background
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX + 1, // Offset horizontally to place the shadow beside the image
                    boxY + 1,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
                ctx.restore();
            } else if (this.shadowSide === 'both') {
                if (this.connectionSide === 'left') {
                    ctx.save();
                    const boxX = this.x - this.secondItemInfo.image.width;
                    const boxY = this.y;
                    // ctx.strokeStyle = 'transparent';
                    // ctx.lineWidth = 1;
                    // ctx.fillStyle = 'lightgreen';
                    // ctx.strokeRect(boxX, boxY, 100, this.secondItemInfo.image.height); // Draw the border
                    // ctx.fillRect(boxX + 1, boxY + 1, 100, this.secondItemInfo.image.height); // Fill the box
                    ctx.globalAlpha = 0.5; // Set transparency for the shadow
                    ctx.fillStyle = 'rgba(0, 87, 0, 0.68)'; // Green tint with transparency
                    ctx.fillRect(boxX + 1, boxY + 1, this.secondItemInfo.image.width, this.secondItemInfo.image.height); // Draw a green rectangle as the shadow background
                    // Draw the shadow image beside the original image
                    ctx.drawImage(
                        this.secondItemInfo.image,
                        boxX + 1, // Offset horizontally to place the shadow beside the image
                        boxY + 1,
                        this.secondItemInfo.image.width,
                        this.secondItemInfo.image.height
                    );
                    ctx.restore();
                }
                else if (this.connectionSide === 'right') {
                    ctx.save();
                    const boxX = this.x + this.width;
                    const boxY = this.y;
                    // ctx.strokeStyle = 'transparent';
                    // ctx.lineWidth = 1;
                    // ctx.fillStyle = 'lightgreen';
                    // ctx.strokeRect(boxX, boxY, 100, this.secondItemInfo.image.height); // Draw the border
                    // ctx.fillRect(boxX + 1, boxY + 1, 100, this.secondItemInfo.image.height); // Fill the box
                    ctx.globalAlpha = 0.5; // Set transparency for the shadow
                    ctx.fillStyle = 'rgba(0, 87, 0, 0.68)'; // Green tint with transparency
                    ctx.fillRect(boxX + 1, boxY + 1, this.secondItemInfo.image.width, this.secondItemInfo.image.height); // Draw a green rectangle as the shadow background
                    // Draw the shadow image beside the original image
                    ctx.drawImage(
                        this.secondItemInfo.image,
                        boxX + 1, // Offset horizontally to place the shadow beside the image
                        boxY + 1,
                        this.secondItemInfo.image.width,
                        this.secondItemInfo.image.height
                    );
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

    isItemExtraBoxOverLapping(secondItem: CanvasItem): boolean {

        if (this.connectionSide === 'right' || this.connectionSide === 'both') {
            const thisBoxX = this.x + this.width;
            const thisBoxY = this.y + this.height / 2 - this.sideBoxPadding / 2;
            if (secondItem.connectionSide === 'left' || secondItem.connectionSide === 'both') {
                const secondItemBoxX = secondItem.x - this.sideBoxWidth;
                const secondItemBoxY = secondItem.y + secondItem.height / 2 - this.sideBoxPadding / 2;

                // Check for overlap between the two boxes
                return !(
                    thisBoxX + this.sideBoxWidth <= secondItemBoxX || // This box is to the left of the other box
                    secondItemBoxX + secondItem.sideBoxWidth <= thisBoxX || // This box is to the right of the other box
                    thisBoxY + this.sideBoxHeight <= secondItemBoxY || // This box is above the other box
                    secondItemBoxY + secondItem.sideBoxHeight <= thisBoxY    // This box is below the other box
                );
            }
        }
        if (this.connectionSide === 'left' || this.connectionSide === 'both') {
            const thisBoxX = this.x - this.sideBoxWidth;
            const thisBoxY = this.y + this.height / 2 - this.sideBoxPadding / 2;

            // Calculate bounding box for the other item's right connection side box
            if (secondItem.connectionSide === 'right' || secondItem.connectionSide === 'both') {
                const secondItemBoxX = secondItem.x + secondItem.width;
                const secondItemBoxY = secondItem.y + secondItem.height / 2 - this.sideBoxPadding / 2;

                // Check for overlap between the two boxes
                return !(
                    thisBoxX + this.sideBoxWidth <= secondItemBoxX || // This box is to the left of the other box
                    secondItemBoxX + secondItem.sideBoxWidth <= thisBoxX || // This box is to the right of the other box
                    thisBoxY + this.sideBoxHeight <= secondItemBoxY || // This box is above the other box
                    secondItemBoxY + secondItem.sideBoxHeight <= thisBoxY    // This box is below the other box
                );
            }
        }
        return false;
    }

}



































// isCollidingTop(secondItem: CanvasItem): boolean {
//     return (
//         this.y < secondItem.y + secondItem.image.height &&
//         this.y >= secondItem.y + secondItem.image.height - 5 &&
//         this.x + this.image.width > secondItem.x &&
//         this.x < secondItem.x + secondItem.image.width
//     );
// }

// isCollidingBottom(secondItem: CanvasItem): boolean {
//     return (
//         this.y + this.image.height > secondItem.y &&
//         this.y + this.image.height <= secondItem.y + 5 &&
//         this.x + this.image.width > secondItem.x &&
//         this.x < secondItem.x + secondItem.image.width
//     );
// }

// isCollidingLeft(secondItem: CanvasItem): boolean {
//     return (
//         this.x < secondItem.x + secondItem.image.width &&
//         this.x >= secondItem.x + secondItem.image.width - 5 &&
//         this.y + this.image.height > secondItem.y &&
//         this.y < secondItem.y + secondItem.image.height
//     );
// }

// isCollidingRight(secondItem: CanvasItem): boolean {
//     return (
//         this.x + this.image.width > secondItem.x &&
//         this.x + this.image.width <= secondItem.x + 5 &&
//         this.y + this.image.height > secondItem.y &&
//         this.y < secondItem.y + secondItem.image.height
//     );
// }
