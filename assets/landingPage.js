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

const keyCatcher = document.getElementById("secret-key-catcher");
const infoIcon = document.getElementById("info-icon");
const hintToast = document.getElementById("hint-toast");

function evaluateKey(char) {
    if (!char) return;

    const key = char.toLowerCase();

    switch (key) {
        case 'x':
            if (isRedirecting) return;
            isRedirecting = true;
            showToast("HAHAHAHA GOTCHA!!! YOU FALL FOR THE TRAP", 3000);
            setTimeout(() => {
                window.location.href = "error_pages/landingPageErrorX.html";
            }, 3000);
            return;

        case 'q':
            if (isRedirecting) return;
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
            return;

        default:
            if (key === 'enter') {
                if (typeof enterBtn !== 'undefined' && enterBtn) {
                    enterBtn.click();
                }
                return;
            }

            if (keyCatcher && key !== 'undefined') {
                keyCatcher.value = "";
                // Optional: Handle other keys if needed
                showToast(randomMessage(), 1000);
                break;
            } else {
                showToast(randomMessage(), 1000);
            }
            return;
    }
}

// Keyboard Navigation & Secret Easter Egg
document.addEventListener('keydown', (event) => {
    // Ignore keys while the hidden secret input is focused on mobile.
    if (document.activeElement === keyCatcher) {
        return;
    }

    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === 'Enter') {
        evaluateKey('enter');
        return;
    }

    if (event.key.length === 1) {
        evaluateKey(event.key);
    }
});

// --- MOBILE HANDLING ---
// Tapping the ⓘ icon triggers the soft keyboard and shows a subtle prompt
infoIcon.addEventListener("click", function () {
    // 1. Display hint prompt
    hintToast.style.display = "block";

    // Auto-hide hint toast after 3 seconds
    setTimeout(() => {
        hintToast.style.display = "none";
    }, 3000);

    // 2. Focus invisible input to summon mobile virtual keyboard
    keyCatcher.value = "";
    keyCatcher.focus();
});

// Listens to character input on mobile soft keyboard instantly
keyCatcher.addEventListener("input", function () {
    const enteredChar = keyCatcher.value.slice(-1);
    keyCatcher.value = "";
    evaluateKey(enteredChar);
});

// Run as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    const warningSeen = sessionStorage.getItem('arg_warning_dismissed');
    const modal = document.getElementById('warning-modal');

    if (warningSeen === 'true') {
        // Player already dismissed it this session; hide instantly without animation
        modal.style.display = 'none';
        focusKeyCatcher();
    }
});

function dismissWarning() {
    const modal = document.getElementById('warning-modal');
    modal.classList.add('hidden');

    // Store flag in sessionStorage so it persists during redirects
    sessionStorage.setItem('arg_warning_dismissed', 'true');

    focusKeyCatcher();
}

function focusKeyCatcher() {
    const keyCatcher = document.getElementById('secret-key-catcher');
    if (keyCatcher) keyCatcher.focus();
}