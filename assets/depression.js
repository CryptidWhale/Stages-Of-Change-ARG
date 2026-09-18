const stages = [
    { name: "DEPRESSION", color: "#4a556822", circleUrl: "passages/depressionPassage.html", enterUrl: "passages/depressionPassage.html" }
];

const total = stages.length;
let currentStep = 0;

const stageTitle = document.getElementById('stageTitle');
const wheel = document.getElementById('wheel');
const enterBtn = document.getElementById('enterBtn');

let isRedirecting = false;
let failedAttempts = 0; // Track failed passcode attempts

function showToast(message, duration = 3000) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (toast._hideTimer) clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function createNodes() {
    wheel.innerHTML = '';
    const radius = wheel.offsetWidth / 2;

    stages.forEach((stage, index) => {
        const node = document.createElement('div');
        node.className = 'node';
        node.dataset.stage = index;
        node.style.setProperty('--node-color', stage.color);

        const angleDeg = (index * (360 / total)) - 90;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);

        node.dataset.x = x;
        node.dataset.y = y;

        node.addEventListener('click', () => {
            const activeIndex = ((currentStep % total) + total) % total;
            if (index === activeIndex) {
                window.location.href = stages[index].circleUrl;
            } else {
                goToStage(index);
            }
        });

        wheel.appendChild(node);
    });
    updateCarousel();
}

function updateCarousel() {
    const targetAngle = -(currentStep * (360 / total));
    wheel.style.transform = `rotate(${targetAngle}deg)`;

    const activeIndex = ((currentStep % total) + total) % total;

    const nodes = wheel.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        const x = parseFloat(node.dataset.x);
        const y = parseFloat(node.dataset.y);

        if (index === activeIndex) {
            node.classList.add('active');
            node.style.transform = `translate(${x}px, ${y}px) rotate(${-targetAngle}deg) scale(1.35)`;
            node.style.zIndex = "10";
        } else {
            node.classList.remove('active');
            node.style.transform = `translate(${x}px, ${y}px) rotate(${-targetAngle}deg) scale(0.85)`;
            node.style.zIndex = "1";
        }
    });

    stageTitle.textContent = stages[activeIndex].name;
}

function goToStage(targetIndex) {
    const activeIndex = ((currentStep % total) + total) % total;
    let diff = targetIndex - activeIndex;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff -= total;

    currentStep += diff;
    updateCarousel();
}

enterBtn.addEventListener('click', () => {
    const activeIndex = ((currentStep % total) + total) % total;
    window.location.href = stages[activeIndex].enterUrl;
});


document.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    switch (event.key) {
        case 'Enter':
            enterBtn.click();
            break;
    }
});

window.addEventListener('resize', createNodes);
createNodes();

function randomMessage() {
    const messages = [
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "wrong",
        "wrong",
        "wrong",
        "wrong",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "why are you still here?",
        "",
        "",
        "",
        "",
        "",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "wrong",
        "wrong",
        "wrong",
        "wrong",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "just give up...",
        "",
        "",
        "",
        "",
        "",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
        "no",
        "no",
        "no",
        "no",
        "no",
        "",
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

const keyCatcher = document.getElementById("secret-key-catcher");
const infoIcon = document.getElementById("info-icon");
const hintToast = document.getElementById("hint-toast");

// --- POPUP MODAL FUNCTIONALITY ---
function createAndShowCodeModal() {
    let modal = document.getElementById('codePathModal');
    if (!modal) {
        // Create modal overlay
        modal = document.createElement('div');
        modal.id = 'codePathModal';
        modal.innerHTML = `
            <div class="modal-container">
                <h2 class="modal-title">so, are you ready to move on from this stage?</h2>
                <div class="code-boxes-wrapper">
                    <input type="text" id="nameSaw" class="code-box-input" placeholder="what is your answer?" autocomplete="off" />
                </div>
                <button id="pathSubmitBtn" class="path-submit-btn">enter</button>
            </div>
        `;
        document.body.appendChild(modal);

        const nameSaw = document.getElementById('nameSaw');
        const submitBtn = document.getElementById('pathSubmitBtn');

        // Prevent document keydown listeners from interfering while typing inside modal
        modal.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        // Validation logic
        submitBtn.addEventListener('click', () => {
            const name = nameSaw.value.trim().toLowerCase();

            if (name === 'maybe') {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("well, good enough. ready?", 1500);
                setTimeout(() => {
                    window.location.href = "waypoint/ItIsWhatItIs.html";
                }, 1500);
            } else if (name === 'yes') {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("i like the confidence. wait, let me give you something more", 3500);
                setTimeout(() => {
                    window.location.href = "error_pages/aLittleSomethingMore.html";
                }, 1500);
            } else if (name === 'no') {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("so... no? ok, i will give you this video to watch", 3500);
                setTimeout(() => {
                    window.location.href = "https://www.youtube.com/playlist?list=PLtf9J4QKmK6alVTnVzwHku_rj_dgBheW6";
                }, 1500);
            } else {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("don't you dare to spam again after this. don't be childish", 4321);
                setTimeout(() => {
                    window.location.href = "waypoint/ItIsWhatItIs.html";
                }, 2300);
            }
        });
    }

    modal.style.display = 'flex';
    document.getElementById('nameSaw').value = '';
    document.getElementById('nameSaw').focus();
}

function evaluateKey(char) {
    if (!char) return;

    const key = char.toLowerCase();

    switch (key) {
        case 'r':
            // Trigger the secret code popup box
            if (isRedirecting) break;
            createAndShowCodeModal();
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
    // Ignore keys while secret input is focused on mobile
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
infoIcon.addEventListener("click", function () {
    hintToast.style.display = "block";

    setTimeout(() => {
        hintToast.style.display = "none";
    }, 3000);

    keyCatcher.value = "";
    keyCatcher.focus();
});

keyCatcher.addEventListener("input", function () {
    const enteredChar = keyCatcher.value.slice(-1);
    keyCatcher.value = "";
    evaluateKey(enteredChar);
});