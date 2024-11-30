document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.backgroundColor = 'darkgray';
    });
    item.addEventListener('mouseout', () => {
        item.style.backgroundColor = 'lightgray';
    });
    item.addEventListener('mouseenter', () => {
        setTimeout(() => {
            document.getElementById('sidebar-title').innerText = item.dataset.title;
            document.getElementById('sidebar-image').src = item.dataset.image;
            document.getElementById('sidebar-text').innerText = item.dataset.text;
        }, 200);
    });
});

