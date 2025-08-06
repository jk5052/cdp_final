class ZoomPresentation {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 18;
        this.isTransitioning = false;
        this.world = document.querySelector('.world');
        this.blurOverlay = document.querySelector('.blur-overlay');
        this.viewport = document.querySelector('.viewport');
        this.init();
    }

    async init() {
        console.log('ZoomPresentation initializing...');
        
        // MD 파일에서 콘텐츠 로드
        try {
            await this.loadContentFromMD();
        } catch (error) {
            console.error('Failed to load MD file, using fallback:', error);
            this.createFallbackContent();
        }
        
        this.bindEvents();
        
        // 초기 상태 설정
        setTimeout(() => {
            console.log('Setting initial state...');
            this.showSection(1);
            this.updateUI();
        }, 300);
        
        console.log('ZoomPresentation initialized successfully');
    }

    async loadContentFromMD() {
        console.log('Loading content.md...');
        
        try {
            const response = await fetch('content.md');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdown = await response.text();
            console.log('MD content loaded, length:', markdown.length);
            
            // MD 내용을 fullContent에 설정
            document.getElementById('fullContent').textContent = markdown;
            
            // 파싱 실행
            this.parseContent();
            
        } catch (error) {
            console.error('Error loading content.md:', error);
            throw error;
        }
    }

    parseContent() {
        console.log('Starting parseContent...');
        
        const fullContent = document.getElementById('fullContent');
        if (!fullContent) {
            console.error('fullContent element not found!');
            this.createFallbackContent();
            return;
        }

        const contentText = fullContent.textContent || fullContent.innerText;
        console.log(`Raw content found: "${contentText.substring(0, 200)}..."`);
        console.log(`Content length: ${contentText.length}`);

        if (!contentText.trim()) {
            console.error('Content is empty!');
            this.createFallbackContent();
            return;
        }

        // Split by === to get sections
        const sections = contentText.split('===').map(s => s.trim()).filter(s => s.length > 0);
        console.log(`Found ${sections.length} sections from embedded content`);

        // 실제 섹션 수로 totalSections 업데이트
        this.totalSections = sections.length;
        console.log(`Updated totalSections to: ${this.totalSections}`);

        if (sections.length === 0) {
            console.error('No sections found after splitting!');
            this.createFallbackContent();
            return;
        }

        sections.forEach((sectionText, index) => {
            console.log(`Processing section ${index + 1}:`, sectionText.substring(0, 100));
            
            if (sectionText) { // 모든 섹션 처리
                const lines = sectionText.split('\n').filter(line => line.trim());

                // Find title line (starts with #)
                const titleLine = lines.find(line => line.trim().startsWith('#'));
                const title = titleLine ? titleLine.replace(/^#+\s*/, '').trim() : `Section ${index + 1}`;

                // Get content lines (not starting with #)
                const contentLines = lines.filter(line => !line.trim().startsWith('#') && line.trim());

                // 이미지, 비디오, iframe, 텍스트를 분리해서 처리
                let imageHtml = '';
                let videoBackground = '';
                let iframeHtml = '';
                let textContent = '';
                let backgroundImage = '';

                contentLines.forEach(line => {
                    if (line.includes('![') && line.includes('](')) {
                        // 이미지 라인 처리
                        const imgTag = line.replace(/!\[(.*?)\]\(((?!https?:\/\/).*?)\)/g, '<img src="$2" alt="$1" />');
                        imageHtml += imgTag;
                        console.log(`Found image in section ${index + 1}:`, imgTag);
                    } else if (line.includes('[video-bg:') && line.includes(']')) {
                        // 비디오 배경 처리
                        const videoMatch = line.match(/\[video-bg:(.*?)\]/);
                        if (videoMatch) {
                            videoBackground = videoMatch[1];
                        }
                    } else if (line.includes('[iframe:') && line.includes(']')) {
                        // iframe 처리
                        const iframeMatch = line.match(/\[iframe:(.*?)\]/);
                        if (iframeMatch) {
                            iframeHtml += `<iframe src="${iframeMatch[1]}" frameborder="0" allowfullscreen></iframe>`;
                            console.log(`Found iframe: ${iframeMatch[1]} in section ${index + 1}`);
                        }
                    } else if (line.includes('[background:') && line.includes(']')) {
                        // 배경 이미지 처리
                        const backgroundMatch = line.match(/\[background:(.*?)\]/);
                        if (backgroundMatch) {
                            // 배경 이미지 정보를 저장 (나중에 섹션에 적용)
                            backgroundImage = backgroundMatch[1];
                        }
                    } else {
                        // 텍스트 라인 처리
                        textContent += line + ' ';
                    }
                });

                // 텍스트 마크다운 처리
                textContent = textContent
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .trim();

                const content = imageHtml + iframeHtml + (textContent ? `<div class="text-content">${textContent}</div>` : '');

                if (iframeHtml) {
                    console.log(`Section ${index + 1} has iframe content:`, iframeHtml);
                }

                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                console.log(`Looking for: .section-${index + 1} .section-content`);
                
                if (sectionElement) {
                    // 제목이 없는 경우 (iframe만 있는 경우) 처리
                    const hasTitle = titleLine && !titleLine.includes('[iframe:') && !titleLine.includes('[background:');

                    // 배경 이미지가 있는 경우 섹션에 배경 스타일 적용
                    if (backgroundImage) {
                        const sectionContainer = sectionElement.closest('.section');
                        if (sectionContainer) {
                            sectionContainer.style.backgroundImage = `url(${backgroundImage})`;
                            sectionContainer.style.backgroundSize = 'cover';
                            sectionContainer.style.backgroundPosition = 'center';
                            sectionContainer.style.backgroundRepeat = 'no-repeat';
                            sectionContainer.classList.add('has-background');
                        }
                    }

                    const htmlContent = hasTitle ? `
                        <h1>${title}</h1>
                        <div class="content">${content || `Test content for section ${index + 1}`}</div>
                    ` : `
                        <div class="content">${content || `Content for section ${index + 1}`}</div>
                    `;
                    sectionElement.innerHTML = htmlContent;

                    // 비디오 배경 적용
                    if (videoBackground) {
                        const sectionContainer = sectionElement.closest('.section');
                        if (sectionContainer) {
                            sectionContainer.style.backgroundImage = 'none';
                            sectionContainer.innerHTML = `
                                <video class="video-background" autoplay muted loop>
                                    <source src="${videoBackground}" type="video/mp4">
                                </video>
                                <div class="video-overlay"></div>
                                <div class="section-content">
                                    ${htmlContent}
                                </div>
                            `;
                            console.log(`Added video background: ${videoBackground} to section ${index + 1}`);
                        }
                    }

                    console.log(`Section ${index + 1} content:`, content);
                    console.log(`✅ Updated section ${index + 1}: ${title}`);
                } else {
                    console.error(`❌ Section element not found: .section-${index + 1}`);
                }
            }
        });

        // 동적으로 indicators 생성
        this.createIndicators();
        this.updateProgress();
    }

    createFallbackContent() {
        console.log('Creating fallback content...');
        
        const fallbackSections = [
            { title: 'Vulnerable Connections', content: 'Technology, Emotion, and Collective Experience' },
            { title: 'Keywords & Intersections', content: 'The convergence of <strong>affective computing</strong>, <strong>emotional AI</strong>, <strong>human-computer interaction</strong>, and <strong>critical technology studies</strong>.' },
            { title: 'Background Research', content: 'AI and Humanity? <strong>AI\'s Weightless Emotions</strong>. True comfort comes from <strong>shared vulnerability</strong>.' },
            { title: 'Emotion as Social Construction', content: '<strong>The Constructed Nature of Emotion</strong>. AI doesn\'t read emotions—it <strong>creates</strong> them.' },
            { title: 'Situational Technology', content: '<strong>Technology is not neutral</strong>—social, cultural, political contexts matter.' },
            { title: 'Political Dimensions', content: '<strong>Politics of Emotional Technology</strong>: Who controls emotional data?' },
            { title: 'Critical Issues', content: 'Key considerations: <strong>authenticity</strong>, <strong>consent</strong>, <strong>representation</strong>.' },
            { title: 'Historical Development', content: 'From <strong>rule-based systems</strong> to <strong>machine learning</strong> to <strong>deep neural networks</strong>.' },
            { title: 'Global Emotional Bias Map', content: 'Community emotional culture bias worldwide—mapping how different cultures conceptualize emotional experiences.' },
            { title: 'Community', content: 'Building <strong>inclusive emotional technologies</strong> that honor diverse ways of experiencing emotion.' },
            { title: 'Core Data Parameters', content: '<strong>Facial expressions</strong>, <strong>vocal patterns</strong>, <strong>physiological signals</strong>.' },
            { title: 'Prior Research - 1', content: 'Ben Grosser\'s <strong>"Computers Watching Movies"</strong> explores machine vision interpretation.' },
            { title: 'Prior Research - 2', content: '<strong>"Cleansing Emotional Data"</strong> examines how datasets are normalized and sanitized.' },
            { title: 'Research Question', content: 'Can we design systems that respect emotional complexity and vulnerability?' },
            { title: 'Methodology & Approach', content: 'Qualitative/quantitative/multisensory experiments emphasizing critical reflection.' },
            { title: 'Design Experiments', content: '<strong>Synesthetic objects</strong>: Stickiness, Sharpness, Weight with multisensory feedback.' },
            { title: 'Future Applications', content: 'Creating bridges between emotional language and embodied experience.' },
            { title: 'Project Impact & Vision', content: 'Revealing the violence of emotional datafication through experiential critique.' }
        ];

        fallbackSections.forEach((section, index) => {
            if (index < this.totalSections) { // 동적 섹션 수에 맞춤
                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                if (sectionElement) {
                    sectionElement.innerHTML = `
                        <h1>${section.title}</h1>
                        <div class="content">${section.content}</div>
                    `;
                    console.log(`✅ Created fallback section ${index + 1}: ${section.title}`);
                }
            }
        });
        
        this.createIndicators();
        this.updateProgress();
    }

    bindEvents() {
        // Mouse wheel
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (this.isTransitioning) return;

            if (e.deltaY > 0) {
                this.nextSection();
            } else {
                this.prevSection();
            }
        }, { passive: false });

        // Touch events
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > 80) {
                if (diff > 0) {
                    this.nextSection();
                } else {
                    this.prevSection();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;

            switch(e.key) {
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.showSection(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.showSection(this.totalSections);
                    break;
            }
        });

        // Control buttons
        document.getElementById('reset').addEventListener('click', () => {
            this.showSection(1);
        });

        document.getElementById('fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    nextSection() {
        if (this.currentSection < this.totalSections) {
            this.transitionToSection(this.currentSection + 1);
        }
    }

    prevSection() {
        if (this.currentSection > 1) {
            this.transitionToSection(this.currentSection - 1);
        }
    }

    transitionToSection(targetSection) {
        this.isTransitioning = true;
        this.showSection(targetSection);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    showSection(sectionNum) {
        console.log(`Showing section ${sectionNum}`);
        
        this.currentSection = sectionNum;

        // 모든 섹션 숨기기
        document.querySelectorAll('.section').forEach((section, index) => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // 현재 섹션만 보이기
        const currentSectionEl = document.querySelector(`.section-${sectionNum}`);
        if (currentSectionEl) {
            currentSectionEl.style.display = 'flex';
            currentSectionEl.classList.add('active');
            console.log(`✅ Section ${sectionNum} displayed`);
        } else {
            console.error(`❌ Section ${sectionNum} not found`);
        }

        this.updateUI();
    }

    updateUI() {
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index === this.currentSection - 1) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update progress
        document.getElementById('current-section').textContent =
            this.currentSection.toString().padStart(2, '0');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }

    createIndicators() {
        const navIndicators = document.getElementById('navIndicators');
        if (!navIndicators) return;

        navIndicators.innerHTML = '';

        for (let i = 1; i <= this.totalSections; i++) {
            const indicator = document.createElement('div');
            indicator.className = i === 1 ? 'indicator active' : 'indicator';
            indicator.setAttribute('data-section', i);

            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.showSection(i);
            });

            navIndicators.appendChild(indicator);
        }

        console.log(`Created ${this.totalSections} indicators with event bindings`);
    }

    updateProgress() {
        const totalSectionsElement = document.getElementById('total-sections');
        if (totalSectionsElement) {
            totalSectionsElement.textContent = this.totalSections.toString().padStart(2, '0');
        }
    }
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new ZoomPresentation();
});