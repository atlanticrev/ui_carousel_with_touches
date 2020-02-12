/*
* @todo Появляется дерганье при последовательности действий:
*   mousedown -> mouseup -> mousedown -> mousemove
*
* @todo Определить границы слайдера
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
    const VELOCITY_FIX = 16.999;
    const VELOCITY_BOTTOM_THRESHOLD = 1;
    const FRICTION = 0.95;

    // Coordinates
    let startXPos = null;
    let currentXPos = null;
    let offsetXPos = 0;
    let prevXPos = 0;

    // Offsets
    let currentOffset = 0;
    let lastOffset = 0;

    // Time
    let startTime = 0;
    let currentTime = 0;
    let offsetTime = 0;
    let prevTime = 0;

    // Velocity
    let currentVelocity = 0;

    let isAnimate = false;

    function animation() {

        if (!isAnimate)
            return;

        // Применить трение, для остановки движения
        let velocityWithFriction = currentVelocity *= FRICTION;

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
        currentXPos = e.changedTouches[0].clientX;

        currentVelocity = ( currentXPos - prevXPos ) / (currentTime - prevTime) * VELOCITY_FIX;
        console.log(currentVelocity);

        prevTime = currentTime;
        prevXPos = currentXPos;

        // Общее время движения
        offsetTime = currentTime - startTime;

        // Текущая координата в системе координат viewport-a
        // currentXPos = e.changedTouches[0].clientX;
        // console.log(currentXPos - prevXPos);
        // prevXPos = currentXPos;

        // Смещение относительно стартовой точки в начале движения
        offsetXPos = currentXPos - startXPos;

        // Перемещение относительно прошлого положения координаты
        currentOffset = lastOffset + offsetXPos;

        // Как передать нужную скорость в rAF?
        // Сколько пикселей за миллисекунду
        // currentVelocity = ( offsetXPos ) / offsetTime * VELOCITY_FIX;
        slidesContainer.style.setProperty('--offset', `${currentOffset}px`);
    };

    slidesContainer.ontouchend = (e) => {
        // Определить мгновенную скорость в момент снятия touch

        lastOffset = currentOffset;
        // Если набрали достаточную скорость, то анимируем
        if (Math.abs(currentVelocity) >= 5) {
            isAnimate = true;
            animation();
        }
    };

};