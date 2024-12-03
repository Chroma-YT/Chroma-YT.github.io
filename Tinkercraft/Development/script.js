document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.image-comparison-slider');
    const handle = slider.querySelector('.slider-handle');
    const beforeImage = slider.querySelector('img:first-child');
    const afterImage = slider.querySelector('img:last-child');

    function onDrag(event) {
        const sliderRect = slider.getBoundingClientRect();
        const offsetX = event.clientX ? event.clientX - sliderRect.left : event.touches[0].clientX - sliderRect.left;
        const percent = Math.max(0, Math.min(offsetX / sliderRect.width, 1));  // Ensure percent is between 0 and 1

        handle.style.left = `${percent * 100}%`;
        beforeImage.style.clipPath = `inset(0 ${100 - percent * 100}% 0 0)`;
    }

    function endDrag() {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', endDrag);
    }

    handle.addEventListener('mousedown', function () {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
    });

    handle.addEventListener('touchstart', function () {
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', endDrag);
    });
});
