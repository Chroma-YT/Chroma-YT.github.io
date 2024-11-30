document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const sidebarHeading = document.querySelector('.sidebar h1');
    const sidebarText = document.querySelector('.sidebar p');
    const sidebarImage = document.querySelector('.sidebar img');
    let hoverTimeout;

    squares.forEach(square => {
        square.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                const text = square.getAttribute('data-text');
                const heading = square.getAttribute('data-heading');
                const image = square.getAttribute('data-image');
                sidebarHeading.innerText = heading;
                sidebarText.innerText = text;
                sidebarImage.src = image;
            }, 200);
        });

        square.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
        });
    });
});
