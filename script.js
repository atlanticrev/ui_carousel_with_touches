/*
* @todo Появляется дерганье при последовательности действий:
*   mousedown -> mouseup -> mousedown -> mousemove
*
* @todo Определить границы слайдера
*
* @todo Сбрасывать скорость при смене направления, потому что
*   не правильно плюсовать скорость по новому направлению к накопленной
*   скорости старого направления
*
* @todo Докрутка слайдера, установка слайда точно во вьюпорте
*
* @todo При движении и долгой остановке в конце не двигать слайдер по инерции (с накопленной скоростью)
* */

window.onload = () => {

    // Dom elements
    const slidesContainer = document.querySelector('.slider-content');
    // const viewport = slidesContainer.parentElement;
    // const slides = slidesContainer.querySelectorAll('.slide');

    // Slider
    const VELOCITY_FIX = 25;
    const VELOCITY_BOTTOM_THRESHOLD = 1;
    const FRICTION = 0.95;

    // Coordinates
    let startXPos = null;
    let currentXPos = null;
    let offsetXPos = 0;

    // Offsets
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

    function animation() {
        if (!isAnimate)
            return;
        // Применить трение, для остановки движения
        let velocityWithFriction = currentVelocity *= FRICTION;
        // logging();
        // Остановить движение при очень маленькой скорости
        if (Math.abs(velocityWithFriction) < VELOCITY_BOTTOM_THRESHOLD) {
            isAnimate = false;
        }
        // Отобразить визульно вычисления
        slidesContainer.style.setProperty('--offset', `${(currentOffset = lastOffset += velocityWithFriction)}px`);
        requestAnimationFrame(animation);
    }

    function logging() {
        console.log('x-offset ->', currentXPos - startXPos);
        console.log('t-offset ->', offsetTime);
        console.log('v-current ->', currentVelocity);
    }

    slidesContainer.ontouchstart = (e) => {
        // Прекратить текущую анимацию
        isAnimate = false;
        startTime = Date.now();
        // Стартовая координата в системе координат viewport-a
        startXPos = e.changedTouches[0].clientX;
    };

    slidesContainer.ontouchmove = (e) => {
        // При смене направления скорости?

        currentTime = Date.now();
        // Общее время движения
        offsetTime = currentTime - startTime;

        // Текущая координата в системе координат viewport-a
        currentXPos = e.changedTouches[0].clientX;

        // Смещение относительно стартовой точки в начале движения
        offsetXPos = currentXPos - startXPos;

        // Перемещение относительно прошлого положения координаты
        currentOffset = lastOffset + offsetXPos;

        // Как передать нужную скорость в rAF?
        // Сколько пикселей за миллисекунду
        currentVelocity = ( offsetXPos ) / offsetTime * VELOCITY_FIX;
        slidesContainer.style.setProperty('--offset', `${currentOffset}px`);
    };

    slidesContainer.ontouchend = (e) => {
        // Определить мгновенную скорость в момент снятия touch

        lastOffset = currentOffset;
        // Если набрали достаточную скорость, то анимируем
        if (Math.abs(currentVelocity) >= 15) {
            isAnimate = true;
            animation();
        }
    };

};