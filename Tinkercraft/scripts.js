document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.rounded-square img');
    let hoverTimeout;

    squares.forEach(square => {
        square.addEventListener('mouseover', function() {
            this.classList.add('hovered'); /* Add class for hover effect */

            hoverTimeout = setTimeout(() => {
                const parentDiv = this.parentElement;
                const title = parentDiv.getAttribute('data-title');
                const image = parentDiv.getAttribute('data-image');
                const body = parentDiv.getAttribute('data-body');

                // Update sidebar content
                document.getElementById('sidebar-title').textContent = title;
                document.getElementById('sidebar-image').src = image;
                document.getElementById('sidebar-body').innerHTML = `<p>${body}</p>`;
            }, 200); // 200 ms delay
        });

        square.addEventListener('mouseout', function() {
            clearTimeout(hoverTimeout); /* Clear the timeout if mouse out before 200 ms */
            this.classList.remove('hovered'); /* Remove hover effect class */
        });
    });
});
