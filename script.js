// import observer from './modules/intersectionObserver.js';

window.onload = () => {
    // Dom elements
    const slidesContainer = document.querySelector('.slider-content');
    const viewport = slidesContainer.parentElement;
    const slides = slidesContainer.querySelectorAll('.slide');

    // observer(viewport, slides);

    // Slider
    const VELOCITY_FIX = 16.999;
    const FRICTION = 0.95;

    // Coordinates
    let startXPos = null;
    let currentXPos = null;

    let currentOffset = 0;
    let lastOffset = 0;

    // Time
    let startTime = 0;
    let currentTime = 0;
    let offsetTime = 0;

    // Velocity
    let startVelocity = 0;
    let currentVelocity = 0;

    let isAnimate = false;

    slidesContainer.ontouchstart = (e) => {
        isAnimate = false;
        startTime = Date.now();
        startXPos = e.changedTouches[0].clientX;
    };

    slidesContainer.ontouchmove = (e) => {
        currentTime = Date.now();
        offsetTime = currentTime - startTime;

        currentXPos = e.changedTouches[0].clientX;
        currentOffset = lastOffset + currentXPos - startXPos;

        // Как передать нужную скорость в requestAnimationFrame?
        currentVelocity = ( currentXPos - startXPos ) / offsetTime * VELOCITY_FIX;

        slidesContainer.style.setProperty('--offset', `${currentOffset}px`);

        isAnimate = true;
    };

    slidesContainer.ontouchend = (e) => {
        // Определить мгновенную скорость в момент снятия touch
        lastOffset = currentOffset;

        console.log('x ->', currentXPos - startXPos);
        console.log('t ->', offsetTime);
        console.log('v1 ->', currentVelocity);

        animation();
    };

    function animation() {
        if (!isAnimate)
            return;
        let velocityWithFriction = currentVelocity *= FRICTION;
        slidesContainer.style.setProperty('--offset', `${(lastOffset += velocityWithFriction)}px`);
        requestAnimationFrame(animation);
    }
};