document.querySelectorAll('.grid-item').forEach(item => {
    let hoverTimeout;

    item.addEventListener('mouseover', () => {
        item.style.backgroundColor = 'darkgray';
        hoverTimeout = setTimeout(() => {
            document.getElementById('sidebar-title').innerText = item.dataset.title;
            document.getElementById('sidebar-image').src = item.dataset.image;
            document.getElementById('sidebar-text').innerText = item.dataset.text;
        }, 200);
    });

    item.addEventListener('mouseout', () => {
        item.style.backgroundColor = 'lightgray';
        clearTimeout(hoverTimeout);
    });
});
