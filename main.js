document.addEventListener("DOMContentLoaded", () => {
    // 1. Smooth Scroll (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 1.8
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Navigation Logic
    document.getElementById("nav-acco").addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo("#story-acco-signature-section", {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });

    document.getElementById("nav-dining").addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo("#story-restaurants-signature-section", {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });

    document.getElementById("nav-experience").addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo("#story-experiences-signature-section", {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });


    document.getElementById("nav-attractions").addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo("#story-attractions-signature-section", {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });

    // 2. Palace Intro Frames Setup
    const canvas = document.getElementById("frame-canvas");
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 60;
    const currentFrame = index => `public/frames/frame_${index}.webp`;

    const images = [];
    const airship = { frame: 0 };

    // Preload images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    function render() {
        if (images[airship.frame]) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[airship.frame], 0, 0, canvas.width, canvas.height);
        }
    }

    // Initial render once first image loads
    images[0].onload = () => render();

    // 3. Intro Animation Sequence
    gsap.set("#logo-container", { 
        top: "50%", 
        left: "50%", 
        xPercent: -50, 
        yPercent: -50, 
        scale: 1.2 
    });
    gsap.set(".nav-links", { opacity: 0 });

    const tlIntro = gsap.timeline({
        onComplete: () => {
            render(); // Double check render
        }
    });

    tlIntro.from("#rotating-flower", { scale: 0, opacity: 0, duration: 1.5, ease: "back.out(1.7)" })
           .from("#main-logo", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.5")
           .to("#loader", { 
                opacity: 0, 
                duration: 1, 
                onComplete: () => {
                    document.getElementById("loader").style.display = "none";
                    render();
                }
           }, "+=0.5")
           .to("#logo-container", { 
                top: 40, 
                left: 40, 
                xPercent: 0, 
                yPercent: 0, 
                scale: 1, 
                duration: 1.5, 
                ease: "power3.inOut"
           }, "-=0.5")
           .to(".nav-links", { opacity: 1, duration: 1 }, "-=0.5")
           .from(".nav-links a", { y: 10, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.8");

    // 4. Scroll Animations
    // Navbar Reveal on Scroll
    gsap.to("#luxury-navbar", {
        opacity: 1,
        y: 0,
        pointerEvents: "all",
        scrollTrigger: {
            trigger: "#scroll-section",
            start: "10% top", // Reveal after 10% of scroll
            end: "15% top",
            scrub: true,
            toggleActions: "play reverse play reverse"
        }
    });

    gsap.to(airship, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5
        },
        onUpdate: render
    });

    // Wedding Card Reveal
    gsap.to("#wedding-card-container", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#wedding-section",
            start: "top 70%",
            onEnter: () => {
                gsap.to(canvas, { opacity: 0, duration: 1 });
            },
            onLeaveBack: () => {
                gsap.to(canvas, { opacity: 1, duration: 1 });
            }
        }
    });

    // Story Dual Signature Reveal (Writing Animation)
    const sigTL = gsap.timeline({
        scrollTrigger: {
            trigger: "#story-acco-signature-section",
            start: "top 70%",
            once: true
        }
    });

    sigTL.to("#story-acco-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 3,
        ease: "power2.inOut"
    })
    .to("#story-suites-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.5,
        ease: "power2.inOut"
    }, "-=1"); // Start slightly before Accommodations finishes

    // Gallery Header Reveal
    gsap.from(".kohinoor-gallery-header", {
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#story-chapter",
            start: "top 80%",
            once: true
        }
    });

    // Luxury Suite Signature Reveal
    const luxurySigTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".suite-signature-section",
            start: "top 70%",
            once: true
        }
    });

    luxurySigTL.to(".luxury-suite-sig-1", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 3,
        ease: "power2.inOut"
    })
    .to(".luxury-suite-sig-2", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.5,
        ease: "power2.inOut"
    }, "-=1");

    // Rooms Signature Reveal
    gsap.to("#story-rooms-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-rooms-signature-section",
            start: "top 95%",
            once: true
        }
    });

    // Dining Signature Reveal
    gsap.to("#story-restaurants-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-restaurants-signature-section",
            start: "top 95%",
            once: true
        }
    });

    // Experiences Signature Reveal
    gsap.to("#story-experiences-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-experiences-signature-section",
            start: "top 95%",
            once: true
        }
    });

    // Attractions Signature Reveal
    gsap.to("#story-attractions-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-attractions-signature-section",
            start: "top 95%",
            once: true
        }
    });

    // Restaurants List Signature Reveal
    gsap.to("#story-restaurants-list-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-restaurants-list-signature-section",
            start: "top 95%",
            once: true
        }
    });

    // Royal Gold Reveal Transitions
    gsap.utils.toArray(".royal-reveal-section").forEach(section => {
        const isSlow = section.classList.contains('slow-reveal');
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: isSlow ? 2.5 : 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true
            }
        });
    });

    // City Palace Attraction Eye-Catching Animation
    gsap.from("#city-palace-attraction .experience-photo-container", {
        scale: 0.9,
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        duration: 2.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#city-palace-attraction",
            start: "top 70%",
            once: true
        }
    });

    gsap.to("#city-palace-attraction .zoom-visual", {
        scale: 1.2,
        y: 40,
        scrollTrigger: {
            trigger: "#city-palace-attraction",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Nathdwara Attraction Eye-Catching Animation
    gsap.from("#nathdwara-attraction .experience-photo-container", {
        scale: 0.9,
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        duration: 2.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#nathdwara-attraction",
            start: "top 70%",
            once: true
        }
    });

    gsap.to("#nathdwara-attraction .zoom-visual", {
        scale: 1.2,
        y: 40,
        scrollTrigger: {
            trigger: "#nathdwara-attraction",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Sajjangarh Attraction Eye-Catching Animation
    gsap.from("#sajjangarh-attraction .experience-photo-container", {
        scale: 0.9,
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        duration: 2.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#sajjangarh-attraction",
            start: "top 70%",
            once: true
        }
    });

    gsap.to("#sajjangarh-attraction .zoom-visual", {
        scale: 1.2,
        y: 40,
        scrollTrigger: {
            trigger: "#sajjangarh-attraction",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Bahubali Hills Attraction Eye-Catching Animation
    gsap.from("#bahubali-attraction .experience-photo-container", {
        scale: 0.9,
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        duration: 2.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#bahubali-attraction",
            start: "top 70%",
            once: true
        }
    });

    gsap.to("#bahubali-attraction .zoom-visual", {
        scale: 1.2,
        y: 40,
        scrollTrigger: {
            trigger: "#bahubali-attraction",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Gallery Navigation Logic
    const setupGallery = (galleryId, prevId, nextId) => {
        const gallery = document.getElementById(galleryId);
        const prev = document.getElementById(prevId);
        const next = document.getElementById(nextId);
        if (gallery && prev && next) {
            next.addEventListener("click", () => gallery.scrollBy({ left: 600, behavior: "smooth" }));
            prev.addEventListener("click", () => gallery.scrollBy({ left: -600, behavior: "smooth" }));
        }
    };

    setupGallery("acco-gallery", "prev-btn", "next-btn");
    setupGallery("luxury-gallery", "luxury-prev-btn", "luxury-next-btn");
    setupGallery("premier-gallery", "premier-prev-btn", "premier-next-btn");
    setupGallery("garden-gallery", "garden-prev-btn", "garden-next-btn");
    setupGallery("mewar-gallery", "mewar-prev-btn", "mewar-next-btn");
    setupGallery("promenade-gallery", "prom-prev", "prom-next");

    // Lightbox Logic
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");

    const openModal = (src) => {
        modal.style.display = "flex";
        modalImg.src = src;
        lenis.stop();
    };

    const closeModal = () => {
        modal.style.display = "none";
        lenis.start();
    };

    // Smooth Scroll for Navbar Links
    document.querySelectorAll('#luxury-navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, {
                        offset: 0,
                        duration: 2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });

    // Re-bind all thumbnails (including new ones)
    const initLightbox = () => {
        document.querySelectorAll(".acco-thumb-wrapper").forEach(wrapper => {
            // Remove old listeners to avoid duplicates
            const newWrapper = wrapper.cloneNode(true);
            wrapper.parentNode.replaceChild(newWrapper, wrapper);
            newWrapper.addEventListener("click", () => {
                const img = newWrapper.querySelector("img");
                if (img) openModal(img.src);
            });
        });
    };

    initLightbox();

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Garden Hero Fade-Up Transition
    gsap.to(".hero-frame", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#garden-hero-section",
            start: "top 80%",
            once: true
        }
    });

    // bar Signature Reveal
    gsap.to("#story-bar-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.5,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-bar-signature-section",
            start: "top 70%",
            once: true
        }
    });

    // Suryamahal Signature Reveal
    gsap.to("#story-surya-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.5,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-surya-signature-section",
            start: "top 70%",
            once: true
        }
    });

    // Restaurants Signature Reveal
    gsap.to("#story-restaurants-signature", {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.5,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#story-restaurants-signature-section",
            start: "top 70%",
            once: true
        }
    });

    // Dining Intro Glide Transition (Right to Left)
    gsap.to(".dining-intro-text", {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".dining-intro-section",
            start: "top 85%",
            once: true
        }
    });

    gsap.to(".footer-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: "#luxury-footer",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    });
});
