let selected = [];

document.addEventListener("DOMContentLoaded", () => {
    const collapsibles = document.querySelectorAll(".collapsible");

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener("click", () => {
            collapsible.classList.toggle("active");
            const content = collapsible.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");

    squares.forEach(square => {
        if (!square.querySelector('.square-img')) {
            const img = document.createElement("img");
            img.src = square.getAttribute("name") + ".png";
            img.classList.add("square-img");
            square.appendChild(img);
        }

        let hoverTimer;

        square.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
                const content = square.getAttribute('data-sidebar-content');
                sidebarText.innerHTML = content;
                // Reinitialize the range input to ensure it works
                const rangeInput = sidebarText.querySelector('.c-compare input[type="range"]');
                if (rangeInput) {
                    rangeInput.addEventListener('input', function() {
                        this.parentNode.style.setProperty('--value', `${this.value}%`);
                    });
                }
            }, 200);
        });

        square.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimer);
        });

        square.addEventListener("click", () => {
            square.classList.toggle("clicked");

            const toAppend = square.getAttribute("name");
            if (selected.includes(toAppend)) {
                selected = selected.filter(item => item !== toAppend);
            } else {
                selected.push(toAppend);
            }
        });
    });

    // Slider initialization
    const slider = document.getElementById('slider');
    if (slider) {
        console.log('Slider found: ', slider); // Debugging log
        let direction = 1; // 1 for right, -1 for left
        const speed = 0.5; // Slower speed
        let isUserInteracting = false;

        slider.addEventListener('mousedown', () => { isUserInteracting = true; });
        slider.addEventListener('mouseup', () => { isUserInteracting = false; });
        slider.addEventListener('touchstart', () => { isUserInteracting = true; });
        slider.addEventListener('touchend', () => { isUserInteracting = false; });

        const animateSlider = () => {
            if (!isUserInteracting) {
                let value = parseInt(slider.value);
                if (value >= 100) direction = -1;
                if (value <= 0) direction = 1;
                slider.value = value + direction * speed;
                slider.parentNode.style.setProperty('--value', `${slider.value}%`);
                console.log('Slider value: ', slider.value); // Debugging log
            }
            requestAnimationFrame(animateSlider);
        };

        requestAnimationFrame(animateSlider);
    } else {
        console.log('Slider not found'); // Debugging log
    }
});
