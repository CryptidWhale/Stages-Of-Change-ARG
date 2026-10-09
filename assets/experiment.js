const stages = [
    { name: "EXPERIMENT", color: "#81C784", circleUrl: "error_pages/experimentKeys.html?key=experiment", enterUrl: "passages/experimentPassage.html" },
    { name: "EFDJTJPO", color: "#ffc846", circleUrl: "error_pages/experimentKeys.html?key=decision", enterUrl: "error_pages/experimentKeys.html?key=decision" },
    { name: "KPVGITCVKQP", color: "#0080FF", circleUrl: "error_pages/experimentKeys.html?key=integration", enterUrl: "error_pages/experimentKeys.html?key=integration" },
    { name: "SHOCK", color: "#F4F6F9", circleUrl: "error_pages/experimentKeys.html?key=shock", enterUrl: "error_pages/experimentKeys.html?key=shock" },
    { name: "DENIAL", color: "#643200", circleUrl: "error_pages/experimentKeys.html?key=denial", enterUrl: "error_pages/experimentKeys.html?key=denial" },
    { name: "ANGER", color: "#C11C19", circleUrl: "error_pages/experimentKeys.html?key=anger", enterUrl: "error_pages/experimentKeys.html?key=anger" },
    { name: "DEPRESSION", color: "#4A5568", circleUrl: "error_pages/experimentKeys.html?key=depression", enterUrl: "error_pages/experimentKeys.html?key=depression" }
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
        modal = document.createElement('div');
        modal.id = 'codePathModal';
        modal.innerHTML = `
            <div class="modal-container">
                <h2 class="modal-title">you seen the files. Enter all four codes (the title)</h2>
                <div class="code-boxes-wrapper">
                    <input type="text" class="code-box-input" aria-label="Code 1" placeholder="Code 1" autocomplete="off" spellcheck="false" />
                    <input type="text" class="code-box-input" aria-label="Code 2" placeholder="Code 2" autocomplete="off" spellcheck="false" />
                    <input type="text" class="code-box-input" aria-label="Code 3" placeholder="Code 3" autocomplete="off" spellcheck="false" />
                    <input type="text" class="code-box-input" aria-label="Code 4" placeholder="Code 4" autocomplete="off" spellcheck="false" />
                </div>
                <p class="code-validation-message" role="alert" aria-live="polite"></p>
                <button id="pathSubmitBtn" class="path-submit-btn">enter</button>
            </div>
        `;
        document.body.appendChild(modal);

        const codeInputs = Array.from(modal.querySelectorAll('.code-box-input'));
        const submitBtn = document.getElementById('pathSubmitBtn');
        const validationMessage = modal.querySelector('.code-validation-message');
        const expectedCodes = [
            'BL/02-26/9.0/08-26/RW/RHATGWYJ',
            'QL/08-26/3.2/08-26/AV/DVEBMZJR',
            'AL/07-26/1.0/07-26/TH/TDOQBYUO',
            'IL/12-25/21.7/08-26/ZA/OAXLL',
            'RW/RHATGWYJ',
            'AV/DVEBMZJR',
            'TH/TDOQBYUO',
            'ZA/OAXLL',
            'RHATGWYJ',
            'DVEBMZJR',
            'TDOQBYUO',
            'OAXLL',
            'ADULTING',
            'DELUSION',
            'PANDU'
        ];
        const failedAttemptsByInput = codeInputs.map(() => 0);

        modal.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        submitBtn.addEventListener('click', () => {
            const incorrectInputs = [];

            codeInputs.forEach((input, index) => {
                const isCorrect = input.value.trim().toUpperCase() === expectedCodes[index];
                input.classList.toggle('is-invalid', !isCorrect);
                input.classList.toggle('is-valid', isCorrect);
                input.setAttribute('aria-invalid', String(!isCorrect));
                input.disabled = isCorrect;

                if (!isCorrect) {
                    failedAttemptsByInput[index] += 1;
                    incorrectInputs.push(index);
                }
            });

            if (incorrectInputs.length === 0) {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("All codes accepted.", 1500);
                setTimeout(() => {
                    window.location.href = "waypoint/dahSiapLabBelum.html";
                }, 1500);
                return;
            }

            const exhaustedInput = incorrectInputs.find((index) => failedAttemptsByInput[index] >= 11);
            if (exhaustedInput !== undefined) {
                modal.style.display = 'none';
                isRedirecting = true;
                showToast("Too many incorrect attempts. Returning home...", 1500);
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
                return;
            }

            const remainingAttempts = Math.min(...incorrectInputs.map(
                (index) => 11 - failedAttemptsByInput[index]
            ));
            validationMessage.textContent = `Incorrect code${incorrectInputs.length === 1 ? '' : 's'} highlighted. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining for the highlighted field${incorrectInputs.length === 1 ? '' : 's'}.`;
            codeInputs[incorrectInputs[0]].focus();
        });
    }

    modal.style.display = 'flex';
    const firstEnabledInput = modal.querySelector('.code-box-input:not(:disabled)');
    if (firstEnabledInput) firstEnabledInput.focus();
}

function evaluateKey(char) {
    if (!char) return;

    const key = char.toLowerCase();

    switch (key) {
        case 'o':
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