const stages = [
    { name: "!(-*-!%-#-!!", color: "#640101", circleUrl: "error_pages/move_on.html", enterUrl: "error_pages/move_on.html" },
    { name: "$-%-!$-(-!-!@", color: "#640101", circleUrl: "passages/move_on.html", enterUrl: "passages/move_on.html" },
    { name: "!-!$-&-%-!*", color: "#640101", circleUrl: "error_pages/fuck_you.html", enterUrl: "error_pages/ fuck_you.html" }, // this one is anger
    { name: "$-%-!^-!*-%-!(-!(-(-!%-!$", color: "#640101", circleUrl: "error_pages/move_on.html", enterUrl: "error_pages/move_on.html" },
    { name: "%-@$-!^-%-!*-(-!#-%-!$-@)", color: "#640101", circleUrl: "error_pages/move_on.html", enterUrl: "error_pages/move_on.html" },
    { name: "$-%-#-(-!(-(-!%-!$", color: "#640101", circleUrl: "error_pages/move_on.html", enterUrl: "error_pages/move_on.html" },
    { name: "(-!$-@)-%-&-!*-!-@)-(-!%-!$", color: "#640101", circleUrl: "error_pages/move_on.html", enterUrl: "error_pages/move_on.html" },
];

const total = stages.length;
let currentStep = 0;

const stageTitle = document.getElementById('stageTitle');
const wheel = document.getElementById('wheel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const enterBtn = document.getElementById('enterBtn');
const randomBtn = document.getElementById('randomBtn');

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

// randomizing the jumps
prevBtn.addEventListener('click', () => {
    const randomJump = Math.floor(Math.random() * 3) + 1;
    currentStep -= randomJump;
    updateCarousel();
});

// randomizing the jumps
nextBtn.addEventListener('click', () => {
    const randomJump = Math.floor(Math.random() * 3) + 1;
    currentStep += randomJump;
    updateCarousel();
});

randomBtn.addEventListener('click', () => {
    const activeIndex = ((currentStep % total) + total) % total;
    let rand;
    do {
        rand = Math.floor(Math.random() * total);
    } while (rand === activeIndex);

    goToStage(rand);
});

document.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    switch (event.key) {
        case 'ArrowLeft':
            prevBtn.click();
            break;
        case 'ArrowRight':
            nextBtn.click();
            break;
        case 'Enter':
            enterBtn.click();
            break;
    }
});

window.addEventListener('resize', createNodes);
createNodes();

function randomMessage() {
    const messages = [
        "fuck you. do not spam",
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
                <h2 class="modal-title">insert any name or the name that you saw in the chat</h2>
                <div class="code-boxes-wrapper">
                    <input type="text" id="nameSaw" class="code-box-input" placeholder="Who?" autocomplete="off" />
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

            if (name === 'iqbal') {
                modal.style.display = 'none';
                    isRedirecting = true;
                    showToast("so you know iqbal?", 1500);
                    setTimeout(() => {
                        window.location.href = "error_pages/youKnowIqbal.html";
                    }, 1500);
            } else if (name === 'baldrick') {
                modal.style.display = 'none';
                    isRedirecting = true;
                    showToast("so you know baldrick?", 1500);
                    setTimeout(() => {
                        window.location.href = "error_pages/youKnowBaldrick.html";
                    }, 1500);
            } else if (name === 'harris') {
                modal.style.display = 'none';
                    isRedirecting = true;
                    showToast("so you know harris?", 1500);
                    setTimeout(() => {
                        window.location.href = "error_pages/youKnowHarris.html";
                    }, 1500);
            } else if (name === 'nasrul') {
                modal.style.display = 'none';
                    isRedirecting = true;
                    showToast("so you know nasrul?", 1500);
                    setTimeout(() => {
                        window.location.href = "error_pages/youKnowNasrul.html";
                    }, 1500);
            } else if (name === 'tania') {
                modal.style.display = 'none';
                    isRedirecting = true;
                    showToast("wait, how do you know tania???!!", 1500);
                    setTimeout(() => {
                        window.location.href = "error_pages/youKnowTania.html";
                    }, 1500);
            } else{
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("name accepted", 2300);
                setTimeout(() => {
                    window.location.href = "waypoint/daddyChill.html";
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
        case 'p':
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