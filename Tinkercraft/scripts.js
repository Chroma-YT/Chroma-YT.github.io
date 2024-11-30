document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const sidebar = document.getElementById('sidebar');
    let hoverTimeout;

    squares.forEach(square => {
        square.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                const text = square.getAttribute('data-text');
                const heading = square.getAttribute('data-heading');
                const image = square.getAttribute('data-image');
                sidebar.querySelector('h1').innerText = heading;
                sidebar.querySelector('p').innerText = text;
                sidebar.querySelector('img').src = image;
            }, 200);
        });

        square.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
        });
    });
});
