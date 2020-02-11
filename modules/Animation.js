export default class Animation {

    constructor(object, config) {
        this.isAnimating = false;
        this.animatingObject = object;
    }

    animate() {
        if (!this.isAnimating)
            return;

        requestAnimationFrame(this.animate());
    }

    startAnimate() {
        this.isAnimating = true;
        this.animate();
    }

    stopAnimate() {
        this.isAnimating = false;
    }

}