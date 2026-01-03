document.addEventListener("DOMContentLoaded", function() {
    
    // 設定 Intersection Observer 用於淡入特效
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 動畫只執行一次
            }
        });
    }, observerOptions);

    // 選取所有需要特效的元素
    const fadeElements = document.querySelectorAll('.art-card, .text-block, .product-card, .hero-text');
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        observer.observe(el);
    });

    // 當元素可見時增加的 class 樣式
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});