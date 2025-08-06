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

        // Load content from markdown file
        await this.loadContent();

        this.bindEvents();
        this.showSection(1);

        console.log('ZoomPresentation initialized successfully');
    }

    async loadContent() {
        try {
            console.log('Loading content.md...');
            const response = await fetch('content.md');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const markdown = await response.text();
            console.log('Content loaded, length:', markdown.length);
            document.getElementById('fullContent').textContent = markdown;
            this.parseContent();
        } catch (error) {
            console.error('Error loading content.md:', error);
            console.log('Using fallback content...');
            this.createFallbackContent();
        }
    }

    parseContent() {
        const fullContent = document.getElementById('fullContent');
        if (!fullContent) {
            console.error('Content source not found');
            return;
        }

        const contentText = fullContent.textContent || fullContent.innerText;
        console.log('Raw content found, parsing...');

        // Split by === to get sections
        const sections = contentText.split('===').map(s => s.trim()).filter(s => s.length > 0);
        console.log(`Found ${sections.length} sections`);

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
                        <h1>${title}</h1>
                        <p>${content || 'Content loading...'}</p>
                    `;
                    console.log(`Updated section ${index + 1}: ${title}`);
                } else {
                    console.error(`Section element not found: .section-${index + 1}`);
                }
            }
        });
    }

    createFallbackContent() {
        const fallbackSections = [
            { title: 'Vulnerable Connections', content: 'Technology, Emotion, and Collective Experience' },
            { title: 'Keywords & Intersections', content: 'The convergence of <strong>affective computing</strong>, <strong>emotional AI</strong>, <strong>human-computer interaction</strong>, and <strong>critical technology studies</strong> reveals new territories where vulnerability becomes both strength and risk.' },
            { title: 'Background Research', content: 'AI and Humanity? <strong>AI\'s Weightless Emotions</strong>. True comfort comes not from understanding, but from <strong>shared vulnerability</strong>. How can technology help us evolve by embracing our emotional flaws and vulnerabilities?' },
            { title: 'Emotion as Social Construction', content: '<strong>The Constructed Nature of Emotion</strong>. <strong>Immeasurable Complexity</strong>. <strong>AI\'s Role in Emotional Construction</strong>. AI doesn\'t read emotions—it <strong>creates</strong> them. Not neutral. Emotions are transformed into abstracted, quantified, controllable data points.' },
            { title: 'Situational Technology & Critical Positioning', content: '<strong>Western-Centric Limitations</strong>. <strong>Technology is not neutral</strong>—social, cultural, political contexts matter. <strong>Against Emotional Commodification</strong>. <strong>Accessibility and Equity</strong>. <strong>Privacy and Autonomy</strong>.' },
            { title: 'Political Dimensions & Power Analysis', content: '<strong>Politics of Emotional Technology</strong>: Who controls emotional data and defines valid emotional categories? How are collective emotions commodified? Does technological empathy democratize understanding or create new forms of <strong>emotional surveillance</strong>?' },
            { title: 'Critical Issues in Emotional Data', content: 'Key considerations when dealing with emotional data: <strong>authenticity</strong>, <strong>consent</strong>, <strong>representation</strong>, <strong>algorithmic bias</strong>, <strong>cultural sensitivity</strong>, and the <strong>ethics of emotional manipulation</strong>.' },
            { title: 'Historical Development', content: 'Computer Science/AI emotional recognition technology\'s historical trajectory from <strong>rule-based systems</strong> to <strong>machine learning</strong> to <strong>deep neural networks</strong>—each iteration reshaping how we understand and categorize human emotion.' },
            { title: 'Global Emotional Bias Map', content: 'Community emotional culture bias worldwide—mapping how different cultures conceptualize, express, and value emotional experiences, revealing the <strong>limitations of universalist AI approaches</strong>.' },
            { title: 'Community', content: 'Building <strong>inclusive emotional technologies</strong> that honor diverse ways of experiencing and expressing emotion while fostering genuine human connection rather than extractive data collection.' },
            { title: 'Core Emotional Data Parameters', content: 'Key parameters in emotional data extraction: <strong>facial expressions</strong>, <strong>vocal patterns</strong>, <strong>physiological signals</strong>, <strong>textual sentiment</strong>, <strong>contextual information</strong>, and their <strong>inherent limitations</strong>.' },
            { title: 'Prior Research - 1', content: 'Ben Grosser\'s <strong>"Computers Watching Movies"</strong>—exploring how machine vision interprets emotional content and the <strong>gap between algorithmic analysis and human emotional experience</strong>.' },
            { title: 'Prior Research - 2', content: '<strong>"Cleansing Emotional Data"</strong>—examining how emotional datasets are preprocessed, normalized, and <strong>sanitized</strong>, often erasing cultural nuance and individual complexity.' },
            { title: 'Research Question', content: 'If emotions are no longer passively recorded but actively <strong>shaped by technology</strong>, can we design systems that respect emotional complexity and vulnerability—ensuring that technologically <strong>augmented senses foster meaningful collective emotional experiences</strong>?' },
            { title: 'Methodology & Approach', content: '1. <strong>Problem identification</strong>: Limitations of emotional datafication 2. <strong>Methodology</strong>: Qualitative/quantitative/multisensory experiments 3. <strong>Core elements</strong>: Space/sound/algorithms/visualization/criticism 4. <strong>Experience design</strong>: Immersion, interaction, temporality 5. <strong>Aesthetic/critical reflection</strong>: Data→sensation→data reduction, emphasizing <strong>gaps</strong>' },
            { title: 'Design Experiments', content: '<strong>Synesthetic objects</strong> (visual + auditory): <strong>Stickiness</strong> → resistant surfaces & persistent low-frequency tones. <strong>Sharpness</strong> → angular forms & immediate audio feedback. <strong>Weight</strong> → dense materials & full-body low-frequency resonance.' },
            { title: 'Project Impact & Vision', content: '<strong>This Semester</strong>: Reveal reductive violence of emotional datafication through <strong>experiential critique</strong>. <strong>Long-term</strong>: Develop critical emotional technology design frameworks that <strong>facilitate collective emotional experiences</strong> and <strong>community resonance</strong>.' }
        ];

        fallbackSections.forEach((section, index) => {
            if (index < this.totalSections) {
                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                if (sectionElement) {
                    sectionElement.innerHTML = `
                        <h1>${section.title}</h1>
                        <p>${section.content}</p>
                    `;
                    console.log(`Created fallback section ${index + 1}: ${section.title}`);
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