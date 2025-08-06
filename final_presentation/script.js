class ZoomPresentation {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 17;
        this.isTransitioning = false;
        this.world = document.querySelector('.world');
        this.blurOverlay = document.querySelector('.blur-overlay');
        this.viewport = document.querySelector('.viewport');
        this.init();
    }

    async init() {
        console.log('ZoomPresentation initializing...');

        // Try to load content from markdown file, fallback if fails
        try {
            await this.loadContent();
        } catch (error) {
            console.error('Failed to load content, using fallback:', error);
            this.createFallbackContent();
        }

        this.bindEvents();

        // Parse content from content.md and show first section
        setTimeout(() => {
            console.log('Parsing content from content.md...');
            this.parseContent();
            this.showSection(1);
            this.updateUI();
        }, 100);

        console.log('ZoomPresentation initialized successfully');
    }

    async loadContent() {
        console.log('Loading content.md...');

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
            const response = await fetch('content.md', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const markdown = await response.text();
            console.log('Content loaded, length:', markdown.length);
            document.getElementById('fullContent').textContent = markdown;
            this.parseContent();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Error loading content.md:', error);
            throw error; // Re-throw to trigger fallback in init()
        }
    }

    parseContent() {
        const fullContent = document.getElementById('fullContent');
        if (!fullContent || !fullContent.textContent.trim()) {
            console.error('Content source not found or empty');
            return;
        }

        const contentText = fullContent.textContent;
        console.log(`Raw content found (${contentText.length} chars), parsing...`);

        // Split by === to get sections
        const sections = contentText.split('===').map(s => s.trim()).filter(s => s.length > 0);
        console.log(`Found ${sections.length} sections from content.md`);

        sections.forEach((sectionText, index) => {
            if (index < this.totalSections && sectionText) {
                const lines = sectionText.split('\n').filter(line => line.trim());

                // Find title line (starts with #)
                const titleLine = lines.find(line => line.trim().startsWith('#'));
                const title = titleLine ? titleLine.replace(/^#+\s*/, '').trim() : `Section ${index + 1}`;

                // Get content lines (not starting with #)
                const contentLines = lines.filter(line => !line.trim().startsWith('#') && line.trim());
                const content = contentLines.join(' ')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .trim();

                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                if (sectionElement) {
                    sectionElement.innerHTML = `
                        <h1 style="color: white !important; font-size: 4rem !important; font-weight: 200 !important; margin-bottom: 30px !important; letter-spacing: 3px !important; z-index: 9999 !important; position: relative !important; text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8) !important; text-align: center !important;">${title}</h1>
                        <p style="color: rgba(255, 255, 255, 0.95) !important; font-size: 1.8rem !important; line-height: 1.6 !important; font-weight: 300 !important; z-index: 9999 !important; position: relative !important; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6) !important; text-align: center !important; max-width: 800px !important; margin: 0 auto !important;">${content || 'Content from content.md'}</p>
                    `;
                    console.log(`✅ Updated section ${index + 1}: ${title}`);
                } else {
                    console.error(`❌ Section element not found: .section-${index + 1}`);
                }
            }
        });
    }







    bindEvents() {
        // Mouse wheel with smooth zoom transition
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

        // Indicator navigation
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.showSection(index + 1);
            });
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
        this.viewport.classList.add('transitioning');

        // Phase 1: Zoom out with heavy blur
        this.world.classList.add('zoom-out');
        this.blurOverlay.classList.add('zoom-out');

        // Phase 2: Switch to target section (during heavy blur)
        setTimeout(() => {
            this.currentSection = targetSection;
            this.updateUI();

            // Remove zoom-out and apply target zoom
            this.world.classList.remove('zoom-out');
            this.world.className = `world zoomed-${this.currentSection}`;

            this.blurOverlay.classList.remove('zoom-out');
            this.blurOverlay.classList.add('focused');
        }, 1000);

        // Phase 3: Complete transition
        setTimeout(() => {
            this.viewport.classList.remove('transitioning');
            this.isTransitioning = false;
        }, 2500);
    }

    showSection(sectionNum) {
        if (sectionNum === this.currentSection && !this.isTransitioning) return;

        this.currentSection = sectionNum;

        // Apply zoom transformation
        this.world.className = `world zoomed-${sectionNum}`;
        this.blurOverlay.classList.add('focused');

        this.updateUI();

        // Small delay to ensure smooth transition
        setTimeout(() => {
            this.isTransitioning = false;
        }, 2000);
    }

    updateUI() {
        console.log(`Updating UI for section ${this.currentSection}`);

        // Update sections
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index === this.currentSection - 1) {
                section.classList.add('active');
                console.log(`Activated section ${index + 1}`);
            } else {
                section.classList.remove('active');
            }
        });

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
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    new ZoomPresentation();
});