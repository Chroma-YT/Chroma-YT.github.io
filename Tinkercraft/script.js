let selected = [];

document.addEventListener("DOMContentLoaded", () => {
    // Collapsible Section Toggle
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

    // Hover Effect for Squares
    const squares = document.querySelectorAll(".square");
    const sidebarText = document.getElementById("sidebar").querySelector("p");

    squares.forEach(square => {
        const img = document.createElement("img");
        img.src = square.getAttribute("name") + ".png";
        img.classList.add("square-img");
        square.appendChild(img);

        let hoverTimer;

        square.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
                sidebarText.innerHTML = square.innerHTML;
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
                return;
            }
            selected.push(toAppend);
        });
    });
});

//Image slider
function initComparisons() {
    var x, i;
    /* Find all elements with an "overlay" class: */
    x = document.getElementsByClassName("img-comp-overlay");
    for (i = 0; i < x.length; i++) {
        /* Once for each "overlay" element: pass the "overlay" element as a parameter when executing the compareImages function: */
        compareImages(x[i]);
    }
}

function compareImages(img) {
    var slider, img, clicked = 0, w, h;
    /* Get the width and height of the img element */
    w = img.offsetWidth;
    h = img.offsetHeight;
    /* Set the width of the img element to 50%: */
    img.style.width = (w / 2) + "px";
    /* Create slider: */
    slider = document.createElement("DIV");
    slider.setAttribute("class", "img-comp-slider");
    /* Insert slider */
    img.parentElement.insertBefore(slider, img);
    /* Position the slider in the middle: */
    slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
    slider.style.left = (w / 2) - (slider.offsetWidth / 2) + "px";
    /* Execute a function when the mouse button is pressed: */
    slider.addEventListener("mousedown", slideReady);
    /* And another function when the mouse button is released: */
    window.addEventListener("mouseup", slideFinish);
    /* Or touched (for touch screens: */
    slider.addEventListener("touchstart", slideReady);
    /* And released (for touch screens: */
    window.addEventListener("touchend", slideFinish);
}

function slideReady(e) {
    /* Prevent any other actions that may occur when moving over the image: */
    e.preventDefault();
    /* The slider is now clicked and ready to move: */
    clicked = 1;
    /* Execute a function when the slider is moved: */
    window.addEventListener("mousemove", slideMove);
    window.addEventListener("touchmove", slideMove);
}

function slideFinish() {
    /* The slider is no longer clicked: */
    clicked = 0;
}

function slideMove(e) {
    var pos;
    /* If the slider is no longer clicked, exit this function: */
    if (clicked == 0) return false;
    /* Get the cursor's x position: */
    pos = getCursorPos(e);
    /* Prevent the slider from being positioned outside the image: */
    if (pos < 0) pos = 0;
    if (pos > img.offsetWidth) pos = img.offsetWidth;
    /* Execute a function that will resize the overlay image according to the cursor: */
    img.style.width = pos + "px";
}

function getCursorPos(e) {
    var a, x = 0;
    e = e || window.event;
    a = e.pageX || e.touches[0].pageX;
    return a;
}

initComparisons();
