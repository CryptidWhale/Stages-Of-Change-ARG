// Prevent multiple redirects and show toast helper
let isRedirecting = false;

function showToast(message, duration = 3000) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    // show
    toast.classList.add('show');
    // clear any previous hide timer
    if (toast._hideTimer) clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function randomMessage() {
    const messages = [
        "wrong key babes!!!",
        "try again, you can do it!",
        "oops! not that one.",
        "keep trying, you'll get it!",
        "relax, one by one",
        "nope, that's not the right key.",
        "almost there, give it another shot!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "don't just spam it, bro!",
        "DON'T JUST SPAM IT, BRO!",
        "DON'T JUST SPAM IT, BRO!",
        "DON'T JUST SPAM IT, BRO!",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
        "maybe you should watch back the video again.",
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Keyboard Navigation & Secret Easter Egg
document.addEventListener('keydown', (event) => {
    // Prevent default scroll behavior for arrow keys if needed
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    switch (event.key) {
        case 'x':
        case 'X':
            // Secret trap: show toast then redirect after 3 seconds
            if (isRedirecting) break;
            isRedirecting = true;
            showToast("HAHAHAHA GOTCHA!!! YOU FALL FOR THE TRAP", 3000);
            setTimeout(() => {
                window.location.href = "error_pages/landingPageErrorX.html";
            }, 3000);
            break;

        case 'q':
        case 'Q':
            // Show two messages in sequence, then redirect.
            if (isRedirecting) break;
            isRedirecting = true;
            setTimeout(() => {
                showToast("alright, hang on tight!!!", 3000);

                setTimeout(() => {
                    showToast("wait... there is one more thing!!!", 2000);

                    setTimeout(() => {
                        showToast("WAIT!!!!!!!!!", 1000);

                        setTimeout(() => {
                            window.location.href = "stages/shock.html";
                        }, 1000);
                    }, 2000);
                }, 3000);
            }, 0);
            break;

        case 'Enter':
            // Optional: Hit Enter key to trigger the 'enter' button
            enterBtn.click();
            break;

        default:
            // Optional: Handle other keys if needed
            showToast(randomMessage(), 1000);
            break;
    }
});