document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.image-comparison-slider');
    const handle = slider.querySelector('.slider-handle');
    const beforeImage = slider.querySelector('img:first-child');
    const afterImage = slider.querySelector('img:last-child');

    function onDrag(event) {
        const sliderRect = slider.getBoundingClientRect();
        const offsetX = event.clientX - sliderRect.left;
        const percent = offsetX / sliderRect.width;

        handle.style.left = `${percent * 100}%`;
        beforeImage.style.clipPath = `inset(0 ${100 - percent * 100}% 0 0)`;
    }

    handle.addEventListener('mousedown', function () {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onDrag);
        });
    });

    handle.addEventListener('touchstart', function () {
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', function () {
            document.removeEventListener('touchmove', onDrag);
        });
    });
});
