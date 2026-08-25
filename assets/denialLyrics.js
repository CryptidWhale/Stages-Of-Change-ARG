
const cards = document.querySelectorAll('.lyric-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const totalCards = cards.length;

function updateCarousel() {
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    const nextIndex = (currentIndex + 1) % totalCards;
    const farPrevIndex = (currentIndex - 2 + totalCards) % totalCards;

    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === prevIndex) {
            card.classList.add('prev');
        } else if (index === nextIndex) {
            card.classList.add('next');
        } else if (index === farPrevIndex) {
            card.classList.add('far-prev');
        } else {
            card.classList.add('far-next');
        }
    });
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
});

let touchStartX = 0;
let touchEndX = 0;

const viewport = document.querySelector('.carousel-viewport');

viewport.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

viewport.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }
    if (touchEndX > touchStartX + 50) {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }
}

updateCarousel();