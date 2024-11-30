// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const squares = document.querySelectorAll('.square');
    let hoverTimeout;

    squares.forEach(square => {
        square.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#555'; // Flash dark gray

            hoverTimeout = setTimeout(() => {
                const title = this.getAttribute('data-title');
                const image = this.getAttribute('data-image');
                const text = this.getAttribute('data-text');

                document.getElementById('sidebar-title').innerText = title;
                document.getElementById('sidebar-image').src = image;
                document.getElementById('sidebar-text').innerText = text;
            }, 200);
        });

        square.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#d3d3d3'; // Revert to light gray
            clearTimeout(hoverTimeout);
        });
    });
});