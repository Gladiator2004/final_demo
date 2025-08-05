document.addEventListener('DOMContentLoaded', function () {
    const slidingImage = document.querySelector('.sliding-image');
    if (slidingImage) {
        function triggerShake() {
            slidingImage.classList.remove('shake');
            void slidingImage.offsetWidth;
            slidingImage.classList.add('shake');
            setTimeout(() => slidingImage.classList.remove('shake'), 700);
        }
        triggerShake();
        setInterval(triggerShake, 15000);
    }
    
    let isContentExpanded = false;
    document.body.classList.add('intro-active');
    window.scrollTo(0, 0);
    
    setTimeout(() => {
        document.body.classList.remove('intro-active');
    }, 4000);

    setTimeout(() => {
        window.scrollTo(0, 0);
        initializeContrastEffect();
        initializeLinkSection();
        initializeProjectsSection();
    }, 4000);

    function initializeContrastEffect() {
        addContrastStyles();
        processContentText();
        window.addEventListener('scroll', handleScrollReveal);
        window.addEventListener('scroll', handleProjectsAnimation);
        window.addEventListener('resize', handleScrollReveal);
        handleScrollReveal();
    }

    function addContrastStyles() {
        const style = document.createElement('style');
        style.id = 'contrast-styles';
        style.textContent = `
            .content p, .content li, .main-content > p, 
            .content .list, .list li, ol.list li {
                color: transparent !important;
                font-size: clamp(1.2rem, 30px, 2rem) !important;
            }
            
            .content p *, .content li *, .main-content > p * {
                color: inherit !important;
                font-size: clamp(1.2rem, 30px, 2rem) !important;
            }
            
            .word-span {
                display: inline;
                transition: color 0.3s ease, opacity 0.3s ease;
                color: #ffffff !important;
                font-size: clamp(1.2rem, 30px, 2rem) !important;
            }
            
            .word-span.upcoming {
                color: #444444 !important;
                opacity: 0.7;
            }
            
            .word-span.current {
                color: #888888 !important;
                opacity: 0.9;
            }
            
            .word-span.seen {
                color: #ffffff !important;
                opacity: 1.0;
            }
            
            /* Responsive text animation sizes */
            @media (max-width: 768px) {
                .content p, .content li, .main-content > p, 
                .content .list, .list li, ol.list li,
                .content p *, .content li *, .main-content > p *,
                .word-span {
                    font-size: clamp(1rem, 25px, 1.6rem) !important;
                }
            }
            
            @media (max-width: 480px) {
                .content p, .content li, .main-content > p, 
                .content .list, .list li, ol.list li,
                .content p *, .content li *, .main-content > p *,
                .word-span {
                    font-size: clamp(0.9rem, 20px, 1.4rem) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function processContentText() {
        const contentElements = document.querySelectorAll('.content p, .content li, .main-content > p');
        let globalWordIndex = 0;

        contentElements.forEach((element, elemIndex) => {
            const originalHTML = element.innerHTML;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = originalHTML;

            processTextNodesForWords(tempDiv, globalWordIndex);

            const wordSpans = tempDiv.querySelectorAll('.word-span');
            globalWordIndex += wordSpans.length;

            element.innerHTML = tempDiv.innerHTML;
        });
    }

    function processTextNodesForWords(element, startIndex) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        let currentIndex = startIndex;

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const fragment = document.createDocumentFragment();
            const words = text.split(/(\s+)/);

            words.forEach(word => {
                if (word.trim() === '') {
                    fragment.appendChild(document.createTextNode(word));
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'word-span upcoming';
                    wordSpan.textContent = word;
                    wordSpan.setAttribute('data-word-index', currentIndex);
                    fragment.appendChild(wordSpan);
                    currentIndex++;
                }
            });

            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    function handleScrollReveal() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const allWords = document.querySelectorAll('.word-span');
        const totalWords = allWords.length;
        if (totalWords === 0) return;

        let startTriggerMultiplier = 0.25;
        if (window.innerWidth <= 480) startTriggerMultiplier = 0.05;
        else if (window.innerWidth <= 768) startTriggerMultiplier = 0.08;
        else if (window.innerWidth <= 1024) startTriggerMultiplier = 0.15;
        
        const startTrigger = windowHeight * startTriggerMultiplier;
        let animationScrollPercent = 0;
        
        if (scrollTop > startTrigger) {
            const maxScroll = documentHeight - windowHeight;
            const adjustedScrollTop = scrollTop - startTrigger;
            const adjustedMaxScroll = maxScroll - startTrigger;
            if (adjustedMaxScroll > 0) {
                const scrollPercent = Math.min(adjustedScrollTop / adjustedMaxScroll, 1);
                let completionRate = 0.33;
                if (window.innerWidth <= 480) completionRate = 0.25;
                else if (window.innerWidth <= 768) completionRate = 0.28;
                
                animationScrollPercent = Math.min(scrollPercent * (1 / completionRate), 1);
            }
        }
        let currentWordIndex = Math.round(animationScrollPercent * totalWords);
        if (animationScrollPercent >= 0.98) currentWordIndex = totalWords;
        currentWordIndex = Math.max(0, Math.min(currentWordIndex, totalWords));

        let gradientZone = window.innerWidth <= 768 ? 1 : 2;
        const halfZone = Math.floor(gradientZone / 2);

        allWords.forEach((word, index) => {
            word.classList.remove('upcoming', 'current', 'seen');
            if (scrollTop <= startTrigger) {
                word.classList.add('upcoming');
                return;
            }
            
            const seenTailCount = Math.max(2, halfZone + 1);
            if (currentWordIndex >= totalWords - seenTailCount + 1 && index >= totalWords - seenTailCount) {
                word.classList.add('seen');
                return;
            }
            
            const distanceFromCurrent = index - (currentWordIndex - 1);
            if (distanceFromCurrent < -halfZone) word.classList.add('seen');
            else if (Math.abs(distanceFromCurrent) <= halfZone) word.classList.add('current');
            else word.classList.add('upcoming');
        });
    }

    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        const elementCenter = rect.top + (rect.height / 2);
        const centerTolerance = windowHeight * 0.3;
        return Math.abs(elementCenter - windowCenter) < centerTolerance && rect.top < windowHeight && rect.bottom > 0;
    }

    function hasScrolledPastElement(element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.5;
    }


    function initializeLinkSection() {
        const linkImage = document.querySelector('.link-image');
        if (linkImage) {
            linkImage.addEventListener('click', function () {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.02)';
                    setTimeout(() => this.style.transform = 'scale(1)', 200);
                }, 100);
            });
        }
    }

    function initializeProjectsSection() {
        const projectsContainer = document.querySelector('.sliding-image-container');
        if (projectsContainer) {
            projectsContainer.addEventListener('click', function () {
                window.location.href = 'projects.html';
            });
        }
    }
    function handleProjectsAnimation() {
        const projectsSection = document.querySelector('.projects-section');
        const slidingImage = document.querySelector('.sliding-image');

        if (!projectsSection || !slidingImage) return;

        const rect = projectsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        if (scrollTop === 0 && rect.top < windowHeight && rect.bottom > 0) {
            if (!projectsSection.classList.contains('visible')) {
                projectsSection.classList.add('visible');
            }
            if (!slidingImage.classList.contains('animate')) {
                setTimeout(() => slidingImage.classList.add('animate'), 300);
            }
            return;
        }

        if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
            if (!projectsSection.classList.contains('visible')) {
                projectsSection.classList.add('visible');
            }
        }

        if (rect.top <= windowHeight * 0.7 && rect.bottom >= 0) {
            if (!slidingImage.classList.contains('animate')) {
                setTimeout(() => slidingImage.classList.add('animate'), 300);
            }
        }
    }
});
