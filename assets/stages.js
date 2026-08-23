const stages = [
    { name: "SHOCK", color: "#F4F6F9", circleUrl: "stage1-circle.html", enterUrl: "stage1-enter.html" },
    { name: "DENIAL", color: "#643200", circleUrl: "index.html", enterUrl: "index.html" },
    { name: "ANGER", color: "#C11C19", circleUrl: "#", enterUrl: "#" },
    { name: "DEPRESSION", color: "#4A5568", circleUrl: "#", enterUrl: "#" },
    { name: "IBTIVMQIRX", color: "#81C784", circleUrl: "error_pages/shockSkipError.html", enterUrl: "#" },
    { name: "IJHNXNTS", color: "#ffc846", circleUrl: "error_pages/shockSkipError.html", enterUrl: "#" },
    { name: "OTZKMXGZOUT", color: "#0080FF", circleUrl: "error_pages/shockSkipError.html", enterUrl: "error_pages/shockSkipError.html" }
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
    if (diff < -total / 2) diff += total;

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