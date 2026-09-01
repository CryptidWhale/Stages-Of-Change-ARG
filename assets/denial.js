const stages = [
    { name: "DENIAL", color: "#643200", circleUrl: "passages/denialPassage.html", enterUrl: "passages/denialPassage.html" },
    { name: "ANGER", color: "#C11C19", circleUrl: "error_pages/denied.html", enterUrl: "error_pages/denied.html" },
    { name: "DEPRESSION", color: "#4A5568", circleUrl: "error_pages/denied.html", enterUrl: "error_pages/denied.html" },
    { name: "IBTIVMQIRX", color: "#81C784", circleUrl: "error_pages/denied.html", enterUrl: "error_pages/denied.html" },
    { name: "IJHNXNTS", color: "#ffc846", circleUrl: "error_pages/denied.html", enterUrl: "error_pages/denied.html" },
    { name: "OTZKMXGZOUT", color: "#0080FF", circleUrl: "error_pages/denied.html", enterUrl: "error_pages/denied.html" },
    { name: "SHOCK", color: "#F4F6F9", circleUrl: "error_pages/inDenial.html", enterUrl: "error_pages/inDenial.html" }
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

prevBtn.addEventListener('click', () => {
    currentStep--;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentStep++;
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
        "are you for real?",
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
        "BITCH",
        "DON'T JUST SPAM IT, BRO!",
        "DON'T JUST SPAM IT, BRO!",
        "DON'T JUST SPAM IT, BRO!",
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
                <h2 class="modal-title">so, what is the right path of the story?</h2>
                <div class="code-boxes-wrapper">
                    <input type="text" id="codePart1" class="code-box-input" maxlength="4" placeholder="####" autocomplete="off" />
                    <span class="dash-separator">-</span>
                    <input type="text" id="codePart2" class="code-box-input" maxlength="4" placeholder="####" autocomplete="off" />
                    <span class="dash-separator">-</span>
                    <input type="text" id="codePart3" class="code-box-input" maxlength="4" placeholder="####" autocomplete="off" />
                </div>
                <button id="pathSubmitBtn" class="path-submit-btn">this is the right path</button>
            </div>
        `;
        document.body.appendChild(modal);

        const in1 = document.getElementById('codePart1');
        const in2 = document.getElementById('codePart2');
        const in3 = document.getElementById('codePart3');
        const submitBtn = document.getElementById('pathSubmitBtn');

        // Prevent document keydown listeners from interfering while typing inside modal
        modal.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        // Auto-focus next input field on typing 4 chars
        in1.addEventListener('input', () => {
            if (in1.value.length === 4) in2.focus();
        });
        in2.addEventListener('input', () => {
            if (in2.value.length === 4) in3.focus();
        });

        // Validation logic
        submitBtn.addEventListener('click', () => {
            const code1 = in1.value.trim().toLowerCase();
            const code2 = in2.value.trim().toLowerCase();
            const code3 = in3.value.trim().toLowerCase();

            if (code1 === 'abab' && code2 === 'iiii' && code3 === 'prqr') {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("alright, code is right. YOU SHALL PASS", 3000);
                setTimeout(() => {
                    window.location.href = "waypoint/maybeIWantToBeHappy.html";
                }, 3000);
            } else {
                failedAttempts++;
                
                if (failedAttempts >= 5) {
                    modal.style.display = 'none';
                    isRedirecting = true;
                    showToast("Too many wrong attempts! Returning home...", 1500);
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                } else {
                    const remaining = 5 - failedAttempts;
                    showToast(`Wrong code! ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`, 2000);
                    in1.value = '';
                    in2.value = '';
                    in3.value = '';
                    in1.focus();
                }
            }
        });
    }

    modal.style.display = 'flex';
    document.getElementById('codePart1').value = '';
    document.getElementById('codePart2').value = '';
    document.getElementById('codePart3').value = '';
    document.getElementById('codePart1').focus();
}

function evaluateKey(char) {
    if (!char) return;

    const key = char.toLowerCase();

    switch (key) {
        case 'i':
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