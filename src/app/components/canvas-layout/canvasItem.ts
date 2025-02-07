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
    closeImageSize: number = 25;

    rotateImageIcon !: HTMLImageElement;
    rotateImageSize: number = 25;

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
        this.sideBoxHeight = (this.height * 65) / 100;
        this.sideBoxPadding = this.sideBoxWidth;
    }

    drawItem(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.addShadowWhenDragging(ctx);
        const centerX = this.x + this.image.width / 2;
        const centerY = this.y + this.image.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((this.rotateAngle * Math.PI) / 180);
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
        // ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
        this.addExtraBox(ctx);
        this.createConnectionArea(ctx);
        ctx.restore();
        this.addBorderOnSelectedItem(ctx, centerX, centerY);
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
        const boxWidth = this.sideBoxWidth;
        const boxHeight = this.sideBoxHeight;

        if (this.connectionSide === 'left' || this.connectionSide === 'both') {
            const boxX = -(this.image.width / 2 + boxWidth); // Position relative to the center
            const boxY = -boxHeight / 2; // Center vertically
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight); // Draw the left box
        }

        if (this.connectionSide === 'right' || this.connectionSide === 'both') {
            const boxX = this.image.width / 2; // Position relative to the center
            const boxY = -boxHeight / 2; // Center vertically
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight); // Draw the right box
        }
    }

    addBorderOnSelectedItem(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
        if (this.isSelected) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((this.rotateAngle * Math.PI) / 180);

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(-(this.image.width / 2), -(this.image.height / 2), this.image.width, this.image.height);

            // Draw close icon
            const closeIconX = -(this.image.width / 2) - this.closeImageSize + 10;
            const closeIconY = -(this.image.height / 2) - this.closeImageSize;
            ctx.drawImage(
                this.closeImageIcon,
                closeIconX,
                closeIconY,
                this.closeImageSize,
                this.closeImageSize
            );

            // Draw rotate icon
            const rotateIconX = this.image.width / 2 - 10;
            const rotateIconY = -(this.image.height / 2) - this.closeImageSize;
            ctx.drawImage(
                this.rotateImageIcon,
                rotateIconX,
                rotateIconY,
                this.rotateImageSize,
                this.rotateImageSize
            );

            ctx.restore();
        }
    }

    createConnectionArea(ctx: CanvasRenderingContext2D) {
        if (this.isConnectionConditionMatched) {
            if (this.shadowSide === 'right') {
                const boxX = this.image.width / 2 + 1;
                const boxY = -(this.image.height / 2) + 1;
                // ctx.strokeStyle = 'transparent';
                // ctx.lineWidth = 1;
                // ctx.fillStyle = 'lightgreen';
                // ctx.strokeRect(boxX, boxY, 100, this.secondItemInfo.image.height); // Draw the border
                // ctx.fillRect(boxX + 1, boxY + 1, 100, this.secondItemInfo.image.height); // Fill the box
                // Apply a green tint to the image
                ctx.globalAlpha = 0.6; // Set transparency for the shadow
                ctx.fillStyle = 'rgb(0, 255, 0)'; // Green tint with transparency
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height); // Draw a green rectangle as the shadow background
                // Draw the shadow image beside the original image
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX, // Offset horizontally to place the shadow beside the image
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
            } else if (this.shadowSide === 'left') {
                const boxX = -(this.image.width / 2) - this.secondItemInfo.image.width - 1;
                const boxY = -(this.image.height / 2) + 1;
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'rgb(0, 255, 0)';
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
            } else if (this.shadowSide === 'bRight') {
                const boxX = -(this.image.width / 2) - this.secondItemInfo.image.width - 1;
                const boxY = -(this.image.height / 2) + 1;
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'rgb(0, 255, 0)';
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
                ctx.restore();
            } else if (this.shadowSide === 'bLeft') {
                const boxX = this.image.width / 2 + 1;
                const boxY = -(this.image.height / 2) + 1;
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'rgb(0, 255, 0)';
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
                ctx.restore();
            }
        }
    }

    conatain(mouseX: number, mouseY: number) {
        const dx = mouseX - (this.x + this.image.width / 2);
        const dy = mouseY - (this.y + this.image.height / 2);

        const rotatedX = dx * Math.cos(-this.rotateAngle * Math.PI / 180) - dy * Math.sin(-this.rotateAngle * Math.PI / 180);
        const rotatedY = dx * Math.sin(-this.rotateAngle * Math.PI / 180) + dy * Math.cos(-this.rotateAngle * Math.PI / 180);
        return (
            rotatedX >= -this.image.width / 2 &&
            rotatedX <= this.image.width / 2 &&
            rotatedY >= -this.image.height / 2 &&
            rotatedY <= this.image.height / 2
        );
    }

    isCloseIconClicked(mouseX: number, mouseY: number): boolean {
        const dx = mouseX - (this.x + this.image.width / 2);
        const dy = mouseY - (this.y + this.image.height / 2);

        // Transform mouse coordinates into the rotated coordinate system
        const rotatedX =
            dx * Math.cos(-this.rotateAngle * Math.PI / 180) -
            dy * Math.sin(-this.rotateAngle * Math.PI / 180);
        const rotatedY =
            dx * Math.sin(-this.rotateAngle * Math.PI / 180) +
            dy * Math.cos(-this.rotateAngle * Math.PI / 180);

        const closeIconX = -(this.image.width / 2) - this.closeImageSize + 10;
        const closeIconY = -(this.image.height / 2) - this.closeImageSize;

        return (
            rotatedX >= closeIconX &&
            rotatedX <= closeIconX + this.closeImageSize &&
            rotatedY >= closeIconY &&
            rotatedY <= closeIconY + this.closeImageSize
        );
    }

    isRotateIconClicked(mouseX: number, mouseY: number): boolean {
        const dx = mouseX - (this.x + this.image.width / 2);
        const dy = mouseY - (this.y + this.image.height / 2);

        // Transform mouse coordinates into the rotated coordinate system
        const rotatedX =
            dx * Math.cos(-this.rotateAngle * Math.PI / 180) -
            dy * Math.sin(-this.rotateAngle * Math.PI / 180);
        const rotatedY =
            dx * Math.sin(-this.rotateAngle * Math.PI / 180) +
            dy * Math.cos(-this.rotateAngle * Math.PI / 180);

        const rotateIconX = this.image.width / 2 - 10;
        const rotateIconY = -(this.image.height / 2) - this.closeImageSize;

        return (
            rotatedX >= rotateIconX &&
            rotatedX <= rotateIconX + this.closeImageSize &&
            rotatedY >= rotateIconY &&
            rotatedY <= rotateIconY + this.closeImageSize
        );
    }

    rotate(degrees: number): void {
        this.rotateAngle += degrees; // Increment the rotation angle
        this.rotateAngle %= 360; // Keep the angle within 0-360 degrees
    }

    isOverLapping(secondItem: CanvasItem): boolean {
        const itemBox = this.getRotatedBoundingBox();
        const secondItemBox = secondItem.getRotatedBoundingBox();

        return !(
            itemBox.maxX <= secondItemBox.minX ||
            secondItemBox.maxX <= itemBox.minX ||
            itemBox.maxY <= secondItemBox.minY ||
            secondItemBox.maxY <= itemBox.minY
        )
    }

    getRotatedBoundingBox(): { minX: number, maxX: number, minY: number, maxY: number } {

        const halfWidth = this.image.width / 2;
        const halfHeight = this.image.height / 2;

        const corners = [
            { x: -halfWidth, y: -halfHeight },
            { x: halfWidth, y: -halfHeight },
            { x: halfWidth, y: halfHeight },
            { x: -halfWidth, y: halfHeight }
        ];

        const centerX = this.x + halfWidth;
        const centerY = this.y + halfHeight;
        const radians = (this.rotateAngle * Math.PI) / 180;

        const transformedCorners = corners.map(corner => {
            const x = corner.x * Math.cos(radians) - corner.y * Math.sin(radians);
            const y = corner.x * Math.sin(radians) + corner.y * Math.cos(radians);
            return { x: x + centerX, y: y + centerY };
        });

        // Find the min and max bounds of the transformed corners
        const minX = Math.min(...transformedCorners.map(corner => corner.x));
        const maxX = Math.max(...transformedCorners.map(corner => corner.x));
        const minY = Math.min(...transformedCorners.map(corner => corner.y));
        const maxY = Math.max(...transformedCorners.map(corner => corner.y));

        return { minX, maxX, minY, maxY };

    }

    isItemExtraBoxOverLapping(secondItem: CanvasItem): { status: boolean, connectionSide: string } {
        if (this.connectionSide === 'both' && secondItem.connectionSide === 'both') {
            // Check if the right box of this item overlaps with the left box of the other item
            if (this.isExtraBoxOverlappingWithRotation(secondItem, 'right', 'left')) {
                return { status: true, connectionSide: 'bRight' };
            }

            // Check if the left box of this item overlaps with the right box of the other item
            if (this.isExtraBoxOverlappingWithRotation(secondItem, 'left', 'right')) {
                return { status: true, connectionSide: 'bLeft' };
            }

            return { status: false, connectionSide: '' };
        }

        if (this.connectionSide === 'right' || this.connectionSide === 'both') {
            // Check if the right box of this item overlaps with the left box of the other item
            if (secondItem.connectionSide === 'left' || secondItem.connectionSide === 'both') {
                if (this.isExtraBoxOverlappingWithRotation(secondItem, 'right', 'left')) {
                    return { status: true, connectionSide: 'right' };
                }
            }
        }

        if (this.connectionSide === 'left' || this.connectionSide === 'both') {
            // Check if the left box of this item overlaps with the right box of the other item
            if (secondItem.connectionSide === 'right' || secondItem.connectionSide === 'both') {
                if (this.isExtraBoxOverlappingWithRotation(secondItem, 'left', 'right')) {
                    return { status: true, connectionSide: 'left' };
                }
            }
        }

        return { status: false, connectionSide: '' };
    }

    isExtraBoxOverlappingWithRotation(otherItem: CanvasItem, side: 'left' | 'right', otherSide: 'left' | 'right'): boolean {
        const box1 = this.getRotatedExtraBoxBoundingBox(side);
        const box2 = otherItem.getRotatedExtraBoxBoundingBox(otherSide);

        // Check for overlap using AABB logic
        return !(
            box1.maxX <= box2.minX || // This box is to the left of the other box
            box2.maxX <= box1.minX || // This box is to the right of the other box
            box1.maxY <= box2.minY || // This box is above the other box
            box2.maxY <= box1.minY    // This box is below the other box
        );
    }

    getRotatedExtraBoxBoundingBox(side: 'left' | 'right'): { minX: number, maxX: number, minY: number, maxY: number } {
        const halfSideBoxWidth = this.sideBoxWidth / 2;
        const halfSideBoxHeight = this.sideBoxHeight / 2;
    
        // Calculate the four corners of the extra box relative to its center
        const corners = [
            { x: -halfSideBoxWidth, y: -halfSideBoxHeight },
            { x: halfSideBoxWidth, y: -halfSideBoxHeight },
            { x: halfSideBoxWidth, y: halfSideBoxHeight },
            { x: -halfSideBoxWidth, y: halfSideBoxHeight }
        ];
    
        // Determine the position of the extra box based on the specified side
        let boxCenterX: number, boxCenterY: number;
    
        if (side === 'left') {
            boxCenterX = -(this.image.width / 2 + this.sideBoxWidth);
            boxCenterY = 0; // Center vertically relative to the image
        } else if (side === 'right') {
            boxCenterX = this.image.width / 2;
            boxCenterY = 0; // Center vertically relative to the image
        }
    
        // Transform the corners into screen coordinates using rotation
        const radians = (this.rotateAngle * Math.PI) / 180;
        const transformedCorners = corners.map(corner => ({
            x:
                this.x + this.image.width / 2 + // Translate to the center of the image
                corner.x * Math.cos(radians) - corner.y * Math.sin(radians) + boxCenterX,
            y:
                this.y + this.image.height / 2 + // Translate to the center of the image
                corner.x * Math.sin(radians) + corner.y * Math.cos(radians) + boxCenterY
        }));
    
        // Find the min and max bounds of the transformed corners
        const minX = Math.min(...transformedCorners.map(corner => corner.x));
        const maxX = Math.max(...transformedCorners.map(corner => corner.x));
        const minY = Math.min(...transformedCorners.map(corner => corner.y));
        const maxY = Math.max(...transformedCorners.map(corner => corner.y));
    
        return { minX, maxX, minY, maxY };
    }

    mergeConnectedItems(updatedX: number, updatedY: number, otherItemWidth: number, otherItemConnectionSide: string) {
        if (this.connectionSide === 'left') {
            this.x = updatedX + otherItemWidth;
            this.y = updatedY;
        } else if (this.connectionSide === 'right') {
            this.x = updatedX - this.width;
            this.y = updatedY;
        } else if (this.connectionSide === 'both') {
            if (otherItemConnectionSide === 'left') {
                this.x = updatedX - this.width;
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
