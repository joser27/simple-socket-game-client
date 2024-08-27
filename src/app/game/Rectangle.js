class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isSolid = true;
    }

    intersects(other) {
        return !(
            this.x + this.width <= other.x ||
            other.x + other.width <= this.x ||
            this.y + this.height <= other.y ||
            other.y + other.height <= this.y
        );
    }

    contains(point) {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        );
    }
        // Get the x coordinate of the center of the rectangle
        centerX() {
            return this.x + this.width / 2;
        }
    
        // Get the y coordinate of the center of the rectangle
        centerY() {
            return this.y + this.height / 2;
        }
}


export default Rectangle;