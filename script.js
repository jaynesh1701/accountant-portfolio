/**
 * PortfolioApp - Main Application Logic
 * Handles animations, routing context, and WebGL background.
 */

const PortfolioApp = {
    init() {
        this.dom = {
            body: document.body,
            menuBtn: document.querySelector('.menu-btn'),
            nav: document.querySelector('.overlay-nav'),
            header: document.querySelector('.header'),
        };

        this.initLenis();
        this.initGSAP();
        this.initLoader();
        this.initNav();
        this.initAnimations();

        // Only init WebGL on desktop/tablet to save battery on mobile
        if (window.matchMedia("(min-width: 768px)").matches) {
            this.initShader();
        }
    },

    initLenis() {
        if (typeof Lenis === 'undefined') return;
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    },

    initGSAP() {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
    },

    initLoader() {
        const tl = gsap.timeline({
            onComplete: () => this.dom.body.classList.remove('loading')
        });

        tl.to('.loader-text', { opacity: 1, duration: 1, y: 0, ease: 'power3.out' })
            .to('.loader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.5 });

        // Hero Reveal
        if (document.querySelector('.hero-title-large')) {
            tl.from('.hero-title-large .reveal-text', {
                y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out'
            }, "-=0.8");

            tl.from('.hero-meta', { opacity: 0, y: 20, duration: 1 }, "-=0.8");
        }
    },

    initNav() {
        if (!this.dom.menuBtn || !this.dom.nav) return;

        this.dom.menuBtn.addEventListener('click', () => {
            this.dom.nav.classList.toggle('active');
            const text = this.dom.menuBtn.querySelector('.text');
            if (text) text.textContent = this.dom.nav.classList.contains('active') ? 'Close' : 'Menu';
        });

        // Close on link click
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                this.dom.nav.classList.remove('active');
                if (this.dom.menuBtn.querySelector('.text')) {
                    this.dom.menuBtn.querySelector('.text').textContent = "Menu";
                }
            });
        });

        // Header Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) this.dom.header.classList.add('scrolled');
            else this.dom.header.classList.remove('scrolled');
        });
    },

    initAnimations() {
        // Expertise Grid Reveal (Vertical Stagger)
        const cards = document.querySelectorAll('.service-card');
        if (cards.length > 0) {
            gsap.from(cards, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.expertise-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Section Headers
        const headings = document.querySelectorAll('.split-heading');
        headings.forEach(h => {
            gsap.from(h, {
                y: 40, opacity: 0, duration: 1,
                scrollTrigger: {
                    trigger: h,
                    start: 'top 85%'
                }
            });
        });

        // Magnetic Buttons
        const magnets = document.querySelectorAll('.btn-magnetic');
        magnets.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
                const txt = btn.querySelector('.btn-text');
                if (txt) gsap.to(txt, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
                const txt = btn.querySelector('.btn-text');
                if (txt) gsap.to(txt, { x: 0, y: 0, duration: 0.5 });
            });
        });

        // Project Images Parallax
        document.querySelectorAll('.featured-img-wrapper img').forEach(img => {
            gsap.to(img, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Work Page Grid
        const workGrid = document.getElementById('work-grid');
        if (workGrid && typeof portfolioData !== 'undefined') {
            portfolioData.forEach(item => {
                const el = document.createElement('a');
                el.className = 'work-item';
                el.href = `/projects/${item.id}`;
                el.innerHTML = `
                    <div class="work-thumb">
                        <img src="${item.heroImage}" alt="${item.title}" loading="lazy">
                    </div>
                    <span class="work-cat">${item.category}</span>
                    <h3 class="work-title">${item.title}</h3>
                `;
                workGrid.appendChild(el);
            });

            gsap.from('.work-item', {
                y: 30, opacity: 0, duration: 0.6, stagger: 0.1,
                scrollTrigger: { trigger: workGrid, start: 'top 80%' }
            });
        }
    },

    initShader() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

            const resize = () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            };
            resize();
            window.addEventListener('resize', () => {
                resize();
                if (uniforms) uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            });

            const geometry = new THREE.PlaneGeometry(2, 2);
            const uniforms = {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                mouse: { value: new THREE.Vector2(0.5, 0.5) }
            };

            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
                    varying vec2 vUv;
                    void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
                `,
                // Subtle liquid grid shader
                fragmentShader: `
                    uniform float time;
                    uniform vec2 resolution;
                    uniform vec2 mouse;
                    varying vec2 vUv;
                    
                    // Simple noise function
                    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
                    float noise(vec2 p) {
                        vec2 i = floor(p);
                        vec2 f = fract(p);
                        f = f*f*(3.0-2.0*f);
                        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), f.x),
                                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x), f.y);
                    }

                    void main() {
                        vec2 uv = vUv;
                        // Aspect ratio correction
                        vec2 aspect = vec2(resolution.x/resolution.y, 1.0);
                        vec2 p = (uv - 0.5) * aspect;
                        
                        // Mouse interaction
                        vec2 m = (mouse - 0.5) * aspect;
                        float d = length(p - m);
                        
                        // Grid lines
                        float gridScale = 20.0;
                        float width = 0.05; // Line width
                        
                        // Distort grid based on noise and mouse
                        float n = noise(p * 3.0 + time * 0.1);
                        vec2 distort = vec2(n) * 0.05;
                        
                        // Ripple from mouse
                        float ripple = sin(d * 20.0 - time * 2.0) * 0.02 * smoothstep(0.5, 0.0, d);
                        
                        vec2 gridUV = fract((uv + distort + ripple) * gridScale);
                        
                        float grid = step(1.0 - width, gridUV.x) + step(1.0 - width, gridUV.y);
                        
                        vec3 color = vec3(1.0); // White bg
                        vec3 lineCol = vec3(0.06, 0.35, 0.23); // #10583A Green
                        
                        // Mix
                        color = mix(color, lineCol, grid * 0.15); // Subtle grid lines
                        
                        // Mouse glow
                        color = mix(color, lineCol, smoothstep(0.3, 0.0, d) * 0.1);

                        gl_FragColor = vec4(color, 1.0);
                    }
                `
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            const animate = () => {
                requestAnimationFrame(animate);
                uniforms.time.value += 0.005;
                renderer.render(scene, camera);
            };
            animate();

            window.addEventListener('mousemove', (e) => {
                if (uniforms) uniforms.mouse.value.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
            });

        } catch (e) {
            console.warn("WebGL Init Failed:", e);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => PortfolioApp.init());
