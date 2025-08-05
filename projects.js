document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('intro-active');
    window.scrollTo(0, 0);
    
    // Initialize - ensure no overlays show on page load unless returning from a specific project
    initializeMobileOverlays();
    
    setTimeout(() => {
        document.body.classList.remove('intro-active');
        showProjectsWithAnimation();
    }, 4000);
    
    function initializeMobileOverlays() {
        const deviceInfo = getDeviceInfo();
        const isMobile = deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet';
        
        if (isMobile) {
            // Get all previously viewed projects from sessionStorage
            const viewedProjects = JSON.parse(sessionStorage.getItem('viewedProjects') || '[]');
            
            const projectItems = document.querySelectorAll('.project-item');
            
            // First, ensure all overlays start hidden
            projectItems.forEach(item => {
                item.classList.remove('clicked');
            });
            
            // Then, restore overlays for all previously viewed projects
            viewedProjects.forEach(projectIndex => {
                if (projectItems[projectIndex]) {
                    setTimeout(() => {
                        projectItems[projectIndex].classList.add('clicked');
                    }, 100); // Small delay to ensure proper initialization
                }
            });
        }
    }
    
    function showProjectsWithAnimation() {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach((item, index) => {
            item.style.visibility = 'visible';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.classList.add('animate');
            }, index * 50);
        });
        
        setupProjectInteractions();
    }
    
    function showProjectsImmediately() {
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item) => {
            item.classList.add('animate');
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.visibility = 'visible';
            item.style.display = 'block';
        });
        setupProjectInteractions();
    }

    function getDeviceInfo() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let deviceType = 'desktop';
        
        if (width <= 768) deviceType = 'mobile';
        else if (width <= 1024) deviceType = 'tablet';
        
        return {
            type: deviceType,
            width: width,
            height: height,
            orientation: width > height ? 'landscape' : 'portrait'
        };
    }
    
    
    function setupProjectInteractions() {
        const projectContainers = document.querySelectorAll('.project-image-container');
        const projectItems = document.querySelectorAll('.project-item');
        
        if (projectContainers.length === 0 && projectItems.length > 0) {
            projectItems.forEach((item, index) => {
                item.addEventListener('click', function(e) {
                    const deviceInfo = getDeviceInfo();
                    const isMobile = deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet';
                    
                    if (isMobile) {
                        // Always allow clicks to open description page for mobile
                        proceedWithProjectClick();
                    } else {
                        proceedWithProjectClick();
                    }
                    
                    function proceedWithProjectClick() {
                        const clickedImage = item.querySelector('.project-image');
                        if (!clickedImage) return;
                        
                        const rect = clickedImage.getBoundingClientRect();
                        const imageData = {
                            src: clickedImage.src,
                            startRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                        };
                        handleProjectClick(index, imageData);
                    }
                });
            });
            return;
        }
        
        projectContainers.forEach((container, index) => {
            container.addEventListener('click', function(e) {
                const deviceInfo = getDeviceInfo();
                const isMobile = deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet';
                const projectItems = document.querySelectorAll('.project-item');
                
                if (isMobile) {
                    // Always allow clicks to open description page for mobile
                    proceedWithContainerClick();
                } else {
                    proceedWithContainerClick();
                }
                
                function proceedWithContainerClick() {
                    const clickedImage = container.querySelector('.project-image');
                    if (!clickedImage) return;
                    
                    const rect = clickedImage.getBoundingClientRect();
                    const imageData = {
                        src: clickedImage.src,
                        startRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                    };
                    
                    if (!isMobile) {
                        container.style.transform = 'translateY(-8px) scale(0.98)';
                        container.style.transition = 'transform 0.1s ease-out';
                        
                        setTimeout(() => {
                            container.style.transform = 'translateY(-8px) scale(1.02)';
                            setTimeout(() => {
                                container.style.transform = 'translateY(-8px)';
                                handleProjectClick(index, imageData);
                            }, 50);
                        }, 50);
                    } else {
                        handleProjectClick(index, imageData);
                    }
                }
            });
            
            // Only add hover effects for desktop devices
            container.addEventListener('mouseenter', function() {
                const deviceInfo = getDeviceInfo();
                const isDesktop = deviceInfo.type === 'desktop';
                
                if (!isDesktop) return; // Skip hover effects on mobile/tablet
                
                const overlay = this.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.opacity = '1';
                }
            });
            
            container.addEventListener('mouseleave', function() {
                const deviceInfo = getDeviceInfo();
                const isDesktop = deviceInfo.type === 'desktop';
                
                if (!isDesktop) return; // Skip hover effects on mobile/tablet
                
                const overlay = this.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(100%)';
                    overlay.style.opacity = '0';
                }
            });
        });
    }
    
    function handleProjectClick(projectIndex, imageData = null) {
        // Store the clicked project index for mobile overlay restoration
        sessionStorage.setItem('lastClickedProjectIndex', projectIndex.toString());
        
        // Add current project to viewed projects list (don't clear existing ones)
        const deviceInfo = getDeviceInfo();
        const isMobile = deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet';
        
        if (isMobile) {
            // Get existing viewed projects or create new array
            const viewedProjects = JSON.parse(sessionStorage.getItem('viewedProjects') || '[]');
            
            // Add current project if not already in the list
            if (!viewedProjects.includes(projectIndex)) {
                viewedProjects.push(projectIndex);
                sessionStorage.setItem('viewedProjects', JSON.stringify(viewedProjects));
            }
        }
        
        const projectIds = [
            'eva-strong',
            'waste-heat-recovery',
            'rocket-control-system',
            'wind-turbine',
            'video-surveillance',
            'eve-portrait'
        ];
        const projectId = projectIds[projectIndex];
        
        if (projectId) {
            openProjectDetail(projectId, imageData);
        }
    }
    
    const projectData = {
        'eva-strong': {
            name: 'Lorem Ipsum',
            heroImage: 'images/BG.jpg',
            items: [
                {
                    title: 'Lorem Ipsum Dolor Sit',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    stats: [
                        { number: '95%', label: 'Lorem Ipsum' },
                        { number: '25 Years', label: 'Dolor Sit' },
                        { number: '100MW', label: 'Consectetur' }
                    ]
                }
            ]
        },
        'waste-heat-recovery': {
            name: 'Consectetur Adipiscing',
            heroImage: 'images/bg2.jpg',
            items: [
                {
                    title: 'Sed Do Eiusmod Tempor',
                    image: 'images/bg2.jpg',
                    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                    stats: [
                        { number: '85%', label: 'Voluptatem' },
                        { number: '20 Years', label: 'Accusantium' },
                        { number: '75MW', label: 'Doloremque' }
                    ]
                }
            ]
        },
        'rocket-control-system': {
            name: 'Totam Rem Aperiam',
            heroImage: 'images/bg3.jpg',
            items: [
                {
                    title: 'Eaque Ipsa Quae Ab',
                    image: 'images/bg3.jpg',
                    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
                    stats: [
                        { number: '99.9%', label: 'Blanditiis' },
                        { number: '5000m/s', label: 'Praesentium' },
                        { number: '0.1ms', label: 'Voluptatum' }
                    ]
                }
            ]
        },
        'wind-turbine': {
            name: 'Mollitia Animi',
            heroImage: 'images/turbine.gif',
            items: [
                {
                    title: 'Facilis Est Expedita',
                    description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae.',
                    stats: [
                        { number: '3MW', label: 'Tempore' },
                        { number: '20 Years', label: 'Eligendi' },
                        { number: '45%', label: 'Voluptas' }
                    ]
                }
            ]
        },
        'video-surveillance': {
            name: 'Impedit Quo Minus',
            heroImage: 'images/bg3.jpg',
            items: [
                {
                    title: 'Maxime Placeat Facere',
                    image: 'images/bg3.jpg',
                    description: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
                    stats: [
                        { number: '24/7', label: 'Sapiente' },
                        { number: '4K', label: 'Delectus' },
                        { number: '99%', label: 'Reiciendis' }
                    ]
                }
            ]
        },
        'eve-portrait': {
            name: 'Asperiores Repellat',
            heroImage: 'images/eve.jpg',
            items: [
                {
                    title: 'Unde Omnis Iste',
                    image: 'images/eve.jpg',
                    description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    stats: [
                        { number: '8K', label: 'Voluptate' },
                        { number: '1', label: 'Molestiae' },
                        { number: '2025', label: 'Consequatur' }
                    ]
                }
            ]
        }
    };
    
    function openProjectDetail(projectId, imageData = null) {
        const project = projectData[projectId];
        if (!project) return;
        
        // Check device type for layout decisions
        const deviceInfo = getDeviceInfo();
        const isDesktop = deviceInfo.type === 'desktop';
        const isMobile = deviceInfo.type === 'mobile';
        const isTablet = deviceInfo.type === 'tablet';
        
        const heroImageSrc = project.heroImage; // Always use the project's designated hero image
        
        // Create project detail overlay
        const detailOverlay = document.createElement('div');
        detailOverlay.className = 'project-detail-overlay';
        
        if (imageData) {
            detailOverlay.dataset.originalImageData = JSON.stringify(imageData);
            detailOverlay.dataset.projectImageSrc = heroImageSrc; // Use project hero image
            detailOverlay.dataset.isMobileDevice = (isMobile || isTablet).toString();
        }
        
        detailOverlay.innerHTML = `
            <div class="project-detail-content">
                <button class="detail-close-btn" style="position: fixed; top: clamp(0.5rem, 2vw, 1.5rem); right: clamp(0.5rem, 2vw, 1.5rem); z-index: 9999; background: rgba(0, 0, 0, 0.8); color: white; border: none; font-size: clamp(1.3rem, 3vw, 2rem); width: clamp(35px, 8vw, 50px); height: clamp(35px, 8vw, 50px); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
                ${!isMobile && !isTablet ? `<div class="desktop-title-section" style="text-align: center; padding: clamp(2rem, 4vw, 4rem) clamp(2rem, 4vw, 4rem) clamp(1rem, 2vw, 2rem) clamp(2rem, 4vw, 4rem);">
                    <h1 class="detail-title detail-title-animate" style="margin-bottom: 0; font-size: clamp(2.5rem, 6vw, 5rem); color: #9370db; text-shadow: 0 2px 8px rgba(147, 112, 219, 0.3);">${project.name}</h1>
                </div>` : ''}
                
                ${isMobile || isTablet ? `
                    <div class="mobile-overlay-content" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000000; overflow-y: auto; z-index: 1000; padding: 0;">
                        <div style="display: flex; justify-content: center; align-items: center; padding: clamp(15px, 4vw, 25px); background: #000000;">
                            <img src="${heroImageSrc}" alt="${project.name}" class="mobile-final-image" style="width: clamp(85%, 90%, 95%); max-width: min(500px, 90vw); height: auto; aspect-ratio: 16/9; object-fit: cover; border-radius: clamp(8px, 3vw, 15px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); display: block; opacity: 1;">
                        </div>
                        
                        <div style="background: #000000; padding: clamp(20px, 6vw, 30px); color: white; max-width: 100vw; margin: 0 auto;">
                            <h1 style="color: #9370db; font-size: clamp(1.8rem, 6vw, 2.8rem); text-align: center; margin: clamp(15px, 4vw, 25px) 0; line-height: 1.2;">${project.name}</h1>
                            
                            ${project.items.map((item, index) => `
                                <div style="margin-bottom: clamp(25px, 6vw, 35px); max-width: clamp(320px, 90vw, 600px); margin-left: auto; margin-right: auto;">
                                    <h3 style="color: #9370db; font-size: clamp(1.2rem, 4vw, 1.6rem); margin-bottom: clamp(10px, 3vw, 18px); text-align: center; line-height: 1.3;">${item.title}</h3>
                                    <p style="color: #ffffff; line-height: 1.6; margin-bottom: clamp(15px, 4vw, 25px); text-align: justify; font-size: clamp(0.9rem, 3.5vw, 1.1rem); padding: 0 clamp(15px, 4vw, 20px); text-align-last: center;">${item.description}</p>
                                    
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(clamp(120px, 30vw, 150px), 1fr)); gap: clamp(10px, 3vw, 18px); max-width: clamp(350px, 85vw, 450px); margin: 0 auto;">
                                        ${item.stats.map(stat => `
                                            <div style="background: rgba(147, 112, 219, 0.1); border: 1px solid rgba(147, 112, 219, 0.3); padding: clamp(12px, 4vw, 18px); border-radius: clamp(6px, 2vw, 10px); text-align: center;">
                                                <div style="color: #9370db; font-size: clamp(1.1rem, 4vw, 1.4rem); font-weight: bold; margin-bottom: clamp(3px, 1vw, 6px); line-height: 1.2;">${stat.number}</div>
                                                <div style="color: #cccccc; font-size: clamp(0.7rem, 2.5vw, 0.95rem); text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3;">${stat.label}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                            
                            <div style="height: clamp(40px, 10vw, 60px);"></div>
                        </div>
                    </div>
                ` : `
                    <div class="detail-hero" style="position: relative; min-height: clamp(50vh, 60vh, 70vh); height: clamp(50vh, 60vh, 75vh); display: grid; grid-template-columns: 1.5fr 1fr; gap: clamp(2rem, 5vw, 6rem); align-items: start; padding: clamp(1.5rem, 4vw, 4rem); overflow: visible;">
                        <div class="detail-content-preview detail-content-preview-animate" style="margin-top: 0;">
                            <h3 style="font-size: clamp(1.5rem, 3.5vw, 3rem); margin-bottom: clamp(1rem, 2.5vw, 2.5rem); text-align: left; color: #fff; font-weight: bold; line-height: 1.2;">${project.items[0].title}</h3>
                            <p style="font-size: clamp(0.9rem, 1.8vw, 1.4rem); line-height: 1.6; margin-bottom: clamp(1.5rem, 3vw, 3rem); text-align: left; color: #ccc;">${project.items[0].description}</p>
                            <div class="detail-stats-preview" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(clamp(100px, 15vw, 140px), 1fr)); gap: clamp(0.8rem, 2vw, 2rem); margin-top: clamp(1.5rem, 3vw, 3rem);">
                                ${project.items[0].stats.map(stat => `
                                    <div class="stat-box" style="padding: clamp(1rem, 2vw, 2rem); background: rgba(147, 112, 219, 0.1); border-radius: clamp(8px, 1.5vw, 12px); border: 1px solid rgba(147, 112, 219, 0.3);">
                                        <div class="stat-number" style="font-size: clamp(1.2rem, 2.5vw, 2rem); color: #9370db; font-weight: bold; margin-bottom: 0.5rem; line-height: 1.2;">${stat.number}</div>
                                        <div class="stat-label" style="font-size: clamp(0.7rem, 1.2vw, 1rem); color: #aaa; line-height: 1.3;">${stat.label}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <img src="${heroImageSrc}" alt="${project.name}" class="detail-hero-image" style="width: 100%; height: auto; max-height: clamp(300px, 50vh, 500px); aspect-ratio: 16/9; object-fit: cover; opacity: 1; transition: opacity 0.3s ease-in-out; border-radius: clamp(8px, 1.5vw, 12px);">
                    </div>
                `}
            </div>
        `;

        document.body.appendChild(detailOverlay);
        document.body.classList.add('detail-overlay-active');
        
        setTimeout(() => {
            const closeBtn = detailOverlay.querySelector('.detail-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeProjectDetail(detailOverlay);
                });
            }
            
            detailOverlay.addEventListener('click', (e) => {
                if (e.target === detailOverlay) closeProjectDetail(detailOverlay);
            });
            
            const detailContent = detailOverlay.querySelector('.project-detail-content');
            if (detailContent) {
                detailContent.addEventListener('click', (e) => e.stopPropagation());
            }
            
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeProjectDetail(detailOverlay);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            detailOverlay._escapeHandler = escapeHandler;
        }, 50);
        
        if (imageData && imageData.startRect) {
            detailOverlay.style.background = 'rgba(0, 0, 0, 0)';
            detailOverlay.style.opacity = '0';
            detailOverlay.classList.add('active');
            
            setTimeout(() => {
                detailOverlay.style.transition = 'all 0.5s ease-out';
                detailOverlay.style.background = 'rgba(0, 0, 0, 0.95)';
                detailOverlay.style.opacity = '1';
            }, 10);
        } else {
            detailOverlay.style.background = 'rgba(0, 0, 0, 0.95)';
            detailOverlay.style.opacity = '1';
            detailOverlay.classList.add('active');
        }
    }
    
    function closeProjectDetail(overlay) {
        document.body.classList.remove('detail-overlay-active');
        
        if (overlay._escapeHandler) {
            document.removeEventListener('keydown', overlay._escapeHandler);
        }
        
        // Check if this was a mobile device interaction
        const isMobileDevice = overlay.dataset.isMobileDevice === 'true';
        
        overlay.style.transition = 'all 0.3s ease-out';
        overlay.style.opacity = '0';
        overlay.style.background = 'rgba(0, 0, 0, 0)';
        
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // Activate mobile overlay after closing description page
            if (isMobileDevice) {
                setTimeout(() => {
                    activateMobileOverlaysAfterReturn();
                }, 100);
            }
        }, 300);
    }
    
    function activateMobileOverlaysAfterReturn() {
        const deviceInfo = getDeviceInfo();
        const isMobile = deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet';
        
        if (!isMobile) return;
        
        // Activate overlays for ALL previously viewed projects
        const projectItems = document.querySelectorAll('.project-item');
        const projectContainers = document.querySelectorAll('.project-image-container');
        
        // Get all viewed projects from sessionStorage
        const viewedProjects = JSON.parse(sessionStorage.getItem('viewedProjects') || '[]');
        
        // Activate overlay for each viewed project
        viewedProjects.forEach(projectIndex => {
            if (projectContainers.length > 0 && projectContainers[projectIndex]) {
                const container = projectContainers[projectIndex];
                const parentItem = container.closest('.project-item');
                if (parentItem) {
                    // Mark this project as having been viewed
                    parentItem.classList.add('clicked');
                    const overlay = container.querySelector('.project-overlay');
                    if (overlay) {
                        overlay.style.transform = 'translateY(0)';
                        overlay.style.opacity = '1';
                    }
                }
            } else if (projectItems.length > 0 && projectItems[projectIndex]) {
                // Mark this project as having been viewed
                projectItems[projectIndex].classList.add('clicked');
            }
        });
    }
    
    function smoothScrollTo(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window.location.href = 'index.html';
    });
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const deviceInfo = getDeviceInfo();
            if (deviceInfo.width !== window.innerWidth) {
                const overlays = document.querySelectorAll('.project-detail-overlay');
                overlays.forEach(overlay => closeProjectDetail(overlay));
            }
        }, 100);
    });
    
    function preloadImages() {
        ['images/BG.jpg', 'images/bg2.jpg', 'images/bg3.jpg', 'images/turbine.gif', 'images/eve.jpg'].forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    preloadImages();
    
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(img => {
        img.addEventListener('load', function() { this.style.opacity = '1'; });
        img.addEventListener('error', function() { this.style.opacity = '0.5'; });
    });
});
