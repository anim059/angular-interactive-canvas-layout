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
        ctx.restore();
        this.addExtraBox(ctx);
        this.createConnectionArea(ctx);
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

    getRotatedExtraBoxPosition(side: 'left' | 'right'): { x: number, y: number } {
        // Determine the position of the extra box relative to the center of the image
        let boxCenterX: number = 0, boxCenterY: number = 0;

        if (side === 'left') {
            boxCenterX = -(this.image.width / 2 + this.sideBoxWidth);
            boxCenterY = 0; // Center vertically relative to the image
        } else if (side === 'right') {
            boxCenterX = this.image.width / 2;
            boxCenterY = 0; // Center vertically relative to the image
        }

        // Apply rotation transformation to the extra box's center
        const radians = (this.rotateAngle * Math.PI) / 180;
        const rotatedBoxX =
            this.x + this.image.width / 2 + // Translate to the center of the image
            boxCenterX * Math.cos(radians) - boxCenterY * Math.sin(radians);
        const rotatedBoxY =
            this.y + this.image.height / 2 + // Translate to the center of the image
            boxCenterX * Math.sin(radians) + boxCenterY * Math.cos(radians);

        return { x: rotatedBoxX, y: rotatedBoxY };
    }

    addExtraBox(ctx: CanvasRenderingContext2D) {
        ctx.save();

        // Translate to the center of the image
        const centerX = this.x + this.image.width / 2;
        const centerY = this.y + this.image.height / 2;

        ctx.translate(centerX, centerY); // Move origin to the center of the image
        ctx.rotate((this.rotateAngle * Math.PI) / 180); // Apply rotation

        if (this.connectionSide === 'left' || this.connectionSide === 'both') {
            // Get the rotated position of the left extra box
            const { x: boxX, y: boxY } = this.getRotatedExtraBoxPosition('left');

            // Draw the left extra box relative to the rotated coordinate system
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(
                -(this.image.width / 2 + this.sideBoxWidth), // Original position
                -(this.image.height / 2) + (this.image.height - this.sideBoxHeight) / 2, // Vertical centering
                this.sideBoxWidth,
                this.sideBoxHeight
            );
        }

        if (this.connectionSide === 'right' || this.connectionSide === 'both') {
            // Get the rotated position of the right extra box
            const { x: boxX, y: boxY } = this.getRotatedExtraBoxPosition('right');

            // Draw the right extra box relative to the rotated coordinate system
            ctx.strokeStyle = 'blue'; // Border color
            ctx.lineWidth = 2; // Border thickness
            ctx.strokeRect(
                this.image.width / 2, // Original position
                -(this.image.height / 2) + (this.image.height - this.sideBoxHeight) / 2, // Vertical centering
                this.sideBoxWidth,
                this.sideBoxHeight
            );
        }

        ctx.restore(); // Restore context after drawing rotated elements
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
            ctx.save();

            // Translate to the center of the image
            const centerX = this.x + this.image.width / 2;
            const centerY = this.y + this.image.height / 2;

            // Apply rotation transformation
            ctx.translate(centerX, centerY);
            ctx.rotate((this.rotateAngle * Math.PI) / 180);

            if (this.shadowSide === 'right') {
                // Calculate the position of the connection area for the right side
                const boxX = this.image.width / 2 + 1; // Offset horizontally
                const boxY = -(this.image.height / 2) + 1; // Center vertically

                ctx.globalAlpha = 0.6; // Set transparency for the shadow
                ctx.fillStyle = 'rgb(0, 255, 0)'; // Green tint with transparency

                // Draw a green rectangle as the shadow background
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);

                // Draw the shadow image beside the original image
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
            } else if (this.shadowSide === 'left') {
                // Calculate the position of the connection area for the left side
                const boxX = -(this.image.width / 2) - this.secondItemInfo.image.width - 1; // Offset horizontally
                const boxY = -(this.image.height / 2) + 1; // Center vertically

                ctx.globalAlpha = 0.6; // Set transparency for the shadow
                ctx.fillStyle = 'rgb(0, 255, 0)'; // Green tint with transparency

                // Draw a green rectangle as the shadow background
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);

                // Draw the shadow image beside the original image
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
            } else if (this.shadowSide === 'bRight') {
                // Calculate the position of the connection area for the bottom-right side
                const boxX = -(this.image.width / 2) - this.secondItemInfo.image.width - 1; // Adjust for rotation
                const boxY = -(this.image.height / 2) + 1; // Center vertically

                ctx.globalAlpha = 0.6; // Set transparency for the shadow
                ctx.fillStyle = 'rgb(0, 255, 0)'; // Green tint with transparency

                // Draw a green rectangle as the shadow background
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);

                // Draw the shadow image beside the original image
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
            } else if (this.shadowSide === 'bLeft') {
                // Calculate the position of the connection area for the bottom-left side
                const boxX = this.image.width / 2 + 1; // Adjust for rotation
                const boxY = -(this.image.height / 2) + 1; // Center vertically

                ctx.globalAlpha = 0.6; // Set transparency for the shadow
                ctx.fillStyle = 'rgb(0, 255, 0)'; // Green tint with transparency

                // Draw a green rectangle as the shadow background
                ctx.fillRect(boxX, boxY, this.secondItemInfo.image.width, this.secondItemInfo.image.height);

                // Draw the shadow image beside the original image
                ctx.drawImage(
                    this.secondItemInfo.image,
                    boxX,
                    boxY,
                    this.secondItemInfo.image.width,
                    this.secondItemInfo.image.height
                );
            }

            ctx.restore(); // Restore context after drawing
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


    detectLeftBoxHover(mouseX: number, mouseY: number): boolean {
        const dx = mouseX - (this.x + this.image.width / 2);
        const dy = mouseY - (this.y + this.image.height / 2);

        // Transform mouse coordinates into the rotated coordinate system
        const rotatedX =
            dx * Math.cos(-this.rotateAngle * Math.PI / 180) -
            dy * Math.sin(-this.rotateAngle * Math.PI / 180);
        const rotatedY =
            dx * Math.sin(-this.rotateAngle * Math.PI / 180) +
            dy * Math.cos(-this.rotateAngle * Math.PI / 180);

        const boxX = -(this.image.width / 2 + this.sideBoxWidth);
        const boxY = -this.sideBoxHeight / 2;

        return (
            rotatedX >= boxX &&
            rotatedX <= boxX + this.sideBoxWidth &&
            rotatedY >= boxY &&
            rotatedY <= boxY + this.sideBoxHeight
        );
    }

    detectRightBoxHover(mouseX: number, mouseY: number): boolean {
        const dx = mouseX - (this.x + this.image.width / 2);
        const dy = mouseY - (this.y + this.image.height / 2);

        // Transform mouse coordinates into the rotated coordinate system
        const rotatedX =
            dx * Math.cos(-this.rotateAngle * Math.PI / 180) -
            dy * Math.sin(-this.rotateAngle * Math.PI / 180);
        const rotatedY =
            dx * Math.sin(-this.rotateAngle * Math.PI / 180) +
            dy * Math.cos(-this.rotateAngle * Math.PI / 180);

        const boxX = this.image.width / 2;
        const boxY = -this.sideBoxHeight / 2;

        return (
            rotatedX >= boxX &&
            rotatedX <= boxX + this.sideBoxWidth &&
            rotatedY >= boxY &&
            rotatedY <= boxY + this.sideBoxHeight
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

    getRotatedExtraBoxBoundingBox(side: 'left' | 'right' | 'top' | 'bottom'): { minX: number, maxX: number, minY: number, maxY: number } {
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
            boxCenterY = 0; // Center vertically
        } else if (side === 'right') {
            boxCenterX = this.image.width / 2;
            boxCenterY = 0; // Center vertically
        } else if (side === 'top') {
            boxCenterX = 0; // Center horizontally
            boxCenterY = -(this.image.height / 2 + this.sideBoxHeight);
        } else if (side === 'bottom') {
            boxCenterX = 0; // Center horizontally
            boxCenterY = this.image.height / 2;
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

    isRotatedBoxOverlapping(
        secondItem: CanvasItem,
        thisSide: 'left' | 'right' | 'top' | 'bottom',
        otherSide: 'left' | 'right' | 'top' | 'bottom'
    ): boolean {
        const thisBox = this.getRotatedExtraBoxBoundingBox(thisSide);
        const otherBox = secondItem.getRotatedExtraBoxBoundingBox(otherSide);

        return !(
            thisBox.maxX <= otherBox.minX || // This box is to the left of the other box
            otherBox.maxX <= thisBox.minX || // This box is to the right of the other box
            thisBox.maxY <= otherBox.minY || // This box is above the other box
            otherBox.maxY <= thisBox.minY    // This box is below the other box
        );
    }

    getAdjustedConnectionSide(): string {
        const adjustedSide = (() => {
            const angle = this.rotateAngle % 360; // Normalize the angle to 0-360 degrees

            if (this.connectionSide === 'left') {
                if (angle === 90) return 'top';
                if (angle === 180) return 'right';
                if (angle === 270) return 'bottom';
                return 'left'; // Default to left for angles between 0 and 90
            } else if (this.connectionSide === 'right') {
                if (angle === 90) return 'bottom';
                if (angle === 180) return 'left';
                if (angle === 270) return 'top';
                return 'right'; // Default to right for angles between 0 and 90
            } else if (this.connectionSide === 'both') {
                return 'both'; // Both sides remain active regardless of rotation
            }

            return ''; // No connection side
        })();

        return adjustedSide;
    }

    isItemExtraBoxOverLapping(secondItem: CanvasItem): { status: boolean, connectionSide: string } {
        const thisAdjustedSide = this.getAdjustedConnectionSide();
        const secondItemAdjustedSide = secondItem.getAdjustedConnectionSide();

        if (thisAdjustedSide === 'both' && secondItemAdjustedSide === 'both') {
            // Check all possible combinations of sides
            if (this.isRotatedBoxOverlapping(secondItem, 'right', 'left')) {
                return { status: true, connectionSide: 'bRight' };
            }
            if (this.isRotatedBoxOverlapping(secondItem, 'left', 'right')) {
                return { status: true, connectionSide: 'bLeft' };
            }
            if (this.isRotatedBoxOverlapping(secondItem, 'top', 'bottom')) {
                return { status: true, connectionSide: 'bTop' };
            }
            if (this.isRotatedBoxOverlapping(secondItem, 'bottom', 'top')) {
                return { status: true, connectionSide: 'bBottom' };
            }

            return { status: false, connectionSide: '' };
        }

        if (thisAdjustedSide === 'right' || thisAdjustedSide === 'both') {
            if (secondItemAdjustedSide === 'left' || secondItemAdjustedSide === 'both') {
                if (this.isRotatedBoxOverlapping(secondItem, 'right', 'left')) {
                    return { status: true, connectionSide: 'right' };
                }
            }
        }

        if (thisAdjustedSide === 'left' || thisAdjustedSide === 'both') {
            if (secondItemAdjustedSide === 'right' || secondItemAdjustedSide === 'both') {
                if (this.isRotatedBoxOverlapping(secondItem, 'left', 'right')) {
                    return { status: true, connectionSide: 'left' };
                }
            }
        }

        if (thisAdjustedSide === 'top' || thisAdjustedSide === 'both') {
            if (secondItemAdjustedSide === 'bottom' || secondItemAdjustedSide === 'both') {
                if (this.isRotatedBoxOverlapping(secondItem, 'top', 'bottom')) {
                    return { status: true, connectionSide: 'top' };
                }
            }
        }

        if (thisAdjustedSide === 'bottom' || thisAdjustedSide === 'both') {
            if (secondItemAdjustedSide === 'top' || secondItemAdjustedSide === 'both') {
                if (this.isRotatedBoxOverlapping(secondItem, 'bottom', 'top')) {
                    return { status: true, connectionSide: 'bottom' };
                }
            }
        }

        return { status: false, connectionSide: '' };
    }


    mergeConnectedItems(otherItem: CanvasItem): void {
        const adjustedSide = this.getAdjustedConnectionSide();
        const otherAdjustedSide = otherItem.getAdjustedConnectionSide();
    
        // Calculate the center of both items
        const thisCenterX = this.x + this.image.width / 2;
        const thisCenterY = this.y + this.image.height / 2;
        const otherCenterX = otherItem.x + otherItem.image.width / 2;
        const otherCenterY = otherItem.y + otherItem.image.height / 2;
    
        if (adjustedSide === 'right' && otherAdjustedSide === 'left') {
            // Align this item's right side with the other item's left side
            this.x = otherCenterX - this.image.width / 2 - this.sideBoxWidth - this.sideBoxPadding;
            this.y = otherCenterY - this.image.height / 2; // Vertically align centers
        } else if (adjustedSide === 'left' && otherAdjustedSide === 'right') {
            // Align this item's left side with the other item's right side
            this.x = otherCenterX + otherItem.image.width / 2 + otherItem.sideBoxPadding;
            this.y = otherCenterY - this.image.height / 2; // Vertically align centers
        } else if (adjustedSide === 'top' && otherAdjustedSide === 'bottom') {
            // Align this item's top side with the other item's bottom side
            this.x = otherCenterX - this.image.width / 2; // Horizontally align centers
            this.y = otherCenterY + otherItem.image.height / 2 + otherItem.sideBoxPadding;
        } else if (adjustedSide === 'bottom' && otherAdjustedSide === 'top') {
            // Align this item's bottom side with the other item's top side
            this.x = otherCenterX - this.image.width / 2; // Horizontally align centers
            this.y = otherCenterY - this.image.height / 2 - this.sideBoxWidth - this.sideBoxPadding;
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
