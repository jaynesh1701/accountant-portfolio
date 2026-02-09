// // Initialize Lenis
// const lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     direction: 'vertical',
//     gestureDirection: 'vertical',
//     smooth: true,
//     mouseMultiplier: 1,
//     smoothTouch: false,
//     touchMultiplier: 2,
// });

// function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
// }

//requestAnimationFrame(raf);

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    const pagePath = window.location.pathname;
    const isHomePage = pagePath === '/' || pagePath.includes('index') || pagePath.length <= 1;
    const isWorkPage = pagePath.includes('work');
    const isProjectPage = pagePath.includes('project');

    // --- SHARED: Loader ---

    // Loader Animation
    const tlLoader = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
        }
    });

    tlLoader.to('.loader-text', {
        opacity: 1,
        duration: 1,
        y: 0,
        ease: 'power3.out'
    })
        .to('.loader', {
            yPercent: -100,
            duration: 1.5,
            ease: 'power4.inOut',
            delay: 0.5
        });

    if (isHomePage) {
        tlLoader.from('.hero-title span', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out'
        }, "-=1")
    }

    // --- SHARED: Navigation ---
    const menuBtn = document.querySelector('.menu-btn');
    const overlayNav = document.querySelector('.overlay-nav');
    const navLinks = document.querySelectorAll('.nav-item');

    if (menuBtn && overlayNav) {
        menuBtn.addEventListener('click', () => {
            overlayNav.classList.toggle('active');

            // Toggle menu text
            const btnText = menuBtn.querySelector('.text');
            if (overlayNav.classList.contains('active')) {
                btnText.textContent = "Close";
            } else {
                btnText.textContent = "Menu";
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                overlayNav.classList.remove('active');
                if (menuBtn.querySelector('.text')) {
                    menuBtn.querySelector('.text').textContent = "Menu";
                }
            });
        });
    }

    // --- PAGE SPECIFIC LOGIC ---

    if (isHomePage) {
        // Init Shader Background - Enabled for Hero Redesign
        initShader();

        // Horizontal Scroll for Services (Desktop only)
        if (window.innerWidth > 1024) {
            const sections = gsap.utils.toArray('.service-card');

            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-scroll-wrapper",
                    pin: true,
                    scrub: 1,
                    end: "+=3000",
                }
            });
        }

        // Text Reveals
        const splitTexts = document.querySelectorAll('.split-heading');
        splitTexts.forEach(text => {
            gsap.from(text, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: text,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Parallax Images
        const parallaxImgs = document.querySelectorAll('.featured-img-wrapper img, .parallax-img img');
        parallaxImgs.forEach(img => {
            gsap.to(img, {
                yPercent: 10, // Subtle parallax
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Magnetic Buttons
        const magnets = document.querySelectorAll('.btn-magnetic');
        magnets.forEach(magnet => {
            magnet.addEventListener('mousemove', (e) => {
                const rect = magnet.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(magnet, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(magnet.querySelector('.btn-text'), {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3
                });
            });

            magnet.addEventListener('mouseleave', () => {
                gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                gsap.to(magnet.querySelector('.btn-text'), { x: 0, y: 0, duration: 0.5 });
            });
        });
    }

    if (isWorkPage) {
        const grid = document.getElementById('work-grid');
        if (typeof portfolioData !== 'undefined' && grid) {
            portfolioData.forEach(item => {
                const el = document.createElement('a');
                el.className = 'work-item';
                // Clean URL
                el.href = `/projects/${item.id}`;
                el.innerHTML = `
                    <div class="work-thumb">
                        <img src="${item.heroImage}" alt="${item.title}">
                    </div>
                    <span class="work-cat">${item.category}</span>
                    <h3 class="work-title">${item.title}</h3>
                    <p class="work-summary">${item.summary}</p>
                `;
                grid.appendChild(el);
            });
            // refreshHoverables(); // Re-bind hover effects (Function not defined)

            // Stagger reveal
            gsap.from('.work-item', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.work-grid',
                    start: 'top 80%'
                }
            });
        }
    }

    if (isProjectPage) {
        // Static Content is already loaded.
        // We just need to handle animations or specific interactions if any.
        console.log('Project page loaded (Static).');
    }

    // Universal Link/Nav Logic can go here (menu toggles etc)
});

// Three.js Shader Implementation (Only calls if needed)
function initShader() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Shader Code (Same as before)
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                    -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = vUv;
            vec2 rw = resolution.xy / min(resolution.x, resolution.y);
            vec2 p = (uv - 0.5) * rw;
            float d = length(p - (mouse - 0.5) * rw);
            float mDist = smoothstep(0.4, 0.0, d);
            float noiseT = time * 0.2;
            float n = snoise(p * 3.0 + vec2(noiseT));
            float line1 = 0.002 / abs(p.y + sin(p.x * 4.0 + time * 0.5) * 0.2 + n * 0.1);
            float line2 = 0.002 / abs(p.y + sin(p.x * 2.0 - time * 0.3) * 0.3);
            
            // Light Mode Colors
            vec3 bg = vec3(1.0, 1.0, 1.0); // White Background
            vec3 greenAccent = vec3(0.06, 0.35, 0.23); // #10583A (Forest Green)
            vec3 lightSage = vec3(0.88, 0.90, 0.89); // #E0E5E2 (Light Sage)
            
            // Base background
            vec3 color = bg;
            
            // Subtle Grid/Noise Texture
            float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
            color -= grain * 0.05; // Slightly darken for texture
            
            // Lines (Green Accent)
            color = mix(color, greenAccent, line1 * 0.8);
            color = mix(color, greenAccent, line2 * 0.5);
            
            // Interaction Ripple (Darker Green)
            color = mix(color, vec3(0.0, 0.2, 0.1), mDist * 0.3);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = Date.now();
    function animate() {
        requestAnimationFrame(animate);
        uniforms.time.value = (Date.now() - startTime) * 0.001;
        renderer.render(scene, camera);
    }
    animate();

    function onResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);
    onResize();

    window.addEventListener('mousemove', (e) => {
        uniforms.mouse.value.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
    });
}
