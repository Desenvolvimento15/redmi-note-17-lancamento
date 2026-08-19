/* js/modal.js - Linx Scoped */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('rn17-video-modal');
    const openBtn = document.getElementById('rn17-open-video');
    const watchBtn = document.getElementById('rn17-watch-btn');
    const closeBtn = document.getElementById('rn17-video-close');
    const overlay = document.getElementById('rn17-video-overlay');
    const video = document.getElementById('rn17-product-video');
    
    if (!modal) return;

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // block scroll
        if (video) {
            video.play();
        }
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // restore scroll
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
    
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (watchBtn) watchBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
