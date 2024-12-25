window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('splash-page').style.display = 'none';
        document.getElementById('hidden-content').classList.add('show-content');
        document.body.style.overflow = 'auto';
    }, 3000); // Adjust the delay time as needed
});

document.addEventListener('DOMContentLoaded', function() {
    const text = "All of the code you need. All in one place.";
    const typingText = document.getElementById('typing-text');
    let index = 0;

    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            let delay = Math.random() * 150 + 50; // Random delay between 50ms and 200ms
            if (text.charAt(index - 1) === '.') {
                delay += 300; // Additional delay after a period
            }
            setTimeout(type, delay);
        }
    }

    type();

    // Search bar functionality
    const searchInput = document.querySelector('.sticky-header input[type="text"]');
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const headers = document.querySelectorAll('.hidden-content h1');
        headers.forEach(header => {
            const text = header.textContent || header.innerText;
            const regex = new RegExp(`(${filter})`, 'gi');
            const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
            header.innerHTML = highlightedText;
        });
    });

    // Toggle switch functionality
    const toggleSwitch = document.querySelector('.toggle-switch input');
    let isSwitchOn = toggleSwitch.checked;

    toggleSwitch.addEventListener('change', function() {
        isSwitchOn = toggleSwitch.checked;
        console.log(`Toggle Switch is ${isSwitchOn ? 'ON' : 'OFF'}`);
    });

    // Range slider functionality
    const rangeSlider = document.querySelector('.range-slider');
    const rangeValue = document.querySelector('.range-value');
    let sliderValue = rangeSlider.value;
    rangeSlider.addEventListener('input', function() {
        sliderValue = rangeSlider.value;
        rangeValue.textContent = sliderValue;
        console.log(`Range Slider value: ${sliderValue}`);
    });

    // Popup notification functionality
    const popupButton = document.querySelector('.popup-button');
    const popup = document.querySelector('.popup');
    popupButton.addEventListener('click', function() {
        popup.classList.add('show');
        setTimeout(function() {
            popup.classList.add('hide');
            setTimeout(function() {
                popup.classList.remove('show', 'hide');
            }, 500); // Wait for the glide out animation to complete
        }, 3000); // Popup will disappear after 3 seconds
    });

    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = button.nextElementSibling.innerText;
            navigator.clipboard.writeText(code).then(function() {
                button.textContent = 'Copied!';
                button.disabled = true;
                setTimeout(function() {
                    button.textContent = 'Copy';
                    button.disabled = false;
                }, 2000);
            }).catch(function(error) {
                console.error('Error copying code: ', error);
            });
        });
    });
});

// Sidebar functionality
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}
