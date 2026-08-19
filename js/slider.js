/* js/slider.js - Linx Scoped */
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.rn17-slider-wrapper');
    const track = document.getElementById('rn17-slider-track');
    const prevBtn = document.getElementById('rn17-slider-prev');
    const nextBtn = document.getElementById('rn17-slider-next');
    const playPauseBtn = document.getElementById('rn17-slider-play-pause');
    const iconPlay = document.querySelector('.icon-play');
    const iconPause = document.querySelector('.icon-pause');
    
    if (!track || !wrapper) return;

    let originalSlides = Array.from(track.querySelectorAll('.rn17-slide'));
    if (!originalSlides.length) return;

    const count = originalSlides.length;

    // Clone slides for infinite loop (clone last slide at beginning, clone first slide at end)
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[count - 1].cloneNode(true);

    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    const allSlides = Array.from(track.querySelectorAll('.rn17-slide'));

    let currentIndex = 1; // Starts at first original slide (index 1)
    let isPlaying = true;
    let autoPlayInterval = null;
    let isTransitioning = false;

    function getSlideMetrics() {
        const slide = allSlides[0];
        const slideWidth = slide.getBoundingClientRect().width;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 16;
        const wrapperWidth = wrapper.getBoundingClientRect().width;
        return { slideWidth, gap, wrapperWidth };
    }

    function setPosition(index, withTransition = true) {
        const { slideWidth, gap, wrapperWidth } = getSlideMetrics();
        // Calculate offset so active slide is centered precisely
        const offset = (wrapperWidth / 2) - (slideWidth / 2) - (index * (slideWidth + gap));
        
        if (withTransition) {
            track.style.transition = 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translate3d(${offset}px, 0, 0)`;

        // Update active class
        allSlides.forEach((s, idx) => {
            if (idx === index) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        setPosition(currentIndex, true);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        setPosition(currentIndex, true);
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === count + 1) {
            // Reached right clone -> snap instantly to first real slide (index 1)
            currentIndex = 1;
            setPosition(currentIndex, false);
        } else if (currentIndex === 0) {
            // Reached left clone -> snap instantly to last real slide (index count)
            currentIndex = count;
            setPosition(currentIndex, false);
        }
    });

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            if (iconPlay) iconPlay.style.display = 'none';
            if (iconPause) iconPause.style.display = 'block';
            startAutoPlay();
        } else {
            if (iconPlay) iconPlay.style.display = 'block';
            if (iconPause) iconPause.style.display = 'none';
            stopAutoPlay();
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 3500);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            if (isPlaying) startAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            if (isPlaying) startAutoPlay();
        });
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
    }

    // Touch / Swipe support
    let startX = 0;
    let isDragging = false;
    let dragDistance = 0;

    function onTouchStart(e) {
        if (isTransitioning) return;
        stopAutoPlay();
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        dragDistance = 0;
    }

    function onTouchMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        dragDistance = currentX - startX;
    }

    function onTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        if (Math.abs(dragDistance) > 40) {
            if (dragDistance < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        if (isPlaying) startAutoPlay();
    }

    wrapper.addEventListener('touchstart', onTouchStart, { passive: true });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: true });
    wrapper.addEventListener('touchend', onTouchEnd, { passive: true });

    wrapper.addEventListener('mousedown', onTouchStart);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);

    // Reposition on window resize
    window.addEventListener('resize', () => {
        setPosition(currentIndex, false);
    });

    // Initialize layout
    requestAnimationFrame(() => {
        setPosition(currentIndex, false);
        if (isPlaying) startAutoPlay();
    });
});
