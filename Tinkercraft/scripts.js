document.querySelectorAll('.square').forEach(square => {
    let hoverTimeout;

    square.addEventListener('mouseover', () => {
        hoverTimeout = setTimeout(() => {
            updateSidebar(square);
        }, 200);
    });

    square.addEventListener('mouseout', () => {
        clearTimeout(hoverTimeout);
        square.classList.remove('flash');
    });

    square.addEventListener('mouseenter', () => {
        square.classList.add('flash');
    });

    square.addEventListener('mouseleave', () => {
        square.classList.remove('flash');
    });
});

function updateSidebar(square) {
    document.getElementById('sidebar-title').innerText = square.dataset.title;
    document.getElementById('sidebar-image').src = square.dataset.image;
    document.getElementById('sidebar-text').innerText = square.dataset.text;
}
