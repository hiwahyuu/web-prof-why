// ================= NAVBAR MOBILE =================
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("mainNav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ================= THEME TOGGLE (DARK / LIGHT) =================
const themeToggleBtn = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector("i");
        if (icon) {
            if (theme === "dark") {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
                themeToggleBtn.title = "Switch to light mode";
            } else {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
                themeToggleBtn.title = "Switch to dark mode";
            }
        }
    }
}

(function initTheme() {
    const stored = localStorage.getItem("md-theme");
    const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme = stored || (prefersDark ? "dark" : "dark");
    applyTheme(theme);
})();

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const current = htmlEl.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem("md-theme", next);
    });
}

// ================= CAROUSEL =================
let currentSlide = 0;
const slides = document.querySelectorAll("#carousel img");
const totalSlides = slides.length;

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    });
}

function moveCarousel(direction) {
    if (totalSlides === 0) return;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCarousel();

    setInterval(() => {
        moveCarousel(1);
    }, 5000);
});

document.querySelectorAll(".carousel-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const direction = parseInt(btn.dataset.direction, 10);
        moveCarousel(direction);
    });
});

// ================= SMOOTH SCROLL & ACTIVE MENU =================
const navLinks = document.querySelectorAll('.nav-links a');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId && targetId.length > 1) {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach(section => {
        const offsetTop = section.offsetTop - 120;
        const offsetBottom = offsetTop + section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add("active");
                }
            });
        }
    });
});

// ================= BACK TO TOP BUTTON =================
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (!backToTopBtn) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 400) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ================= REVEAL ON SCROLL =================
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18
    });

    revealElements.forEach(el => observer.observe(el));
} else {
    revealElements.forEach(el => el.classList.add("visible"));
}

// ================= FAQ ACCORDION =================
function closeAllAccordions(exceptHeader) {
    document.querySelectorAll(".accordion-header").forEach(header => {
        if (header !== exceptHeader) {
            header.classList.remove("active");
            const content = header.nextElementSibling;
            if (content) {
                content.style.maxHeight = null;
                content.style.paddingTop = "0";
                content.style.paddingBottom = "0";
            }
            const icon = header.querySelector(".fa-chevron-down, .fa-chevron-up");
            if (icon) {
                icon.classList.remove("fa-chevron-up");
                icon.classList.add("fa-chevron-down");
            }
        }
    });
}

document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector(".fa-chevron-down, .fa-chevron-up");
        const isOpen = content.style.maxHeight;

        closeAllAccordions(header);

        header.classList.toggle("active");
        if (isOpen) {
            content.style.maxHeight = null;
            content.style.paddingTop = "0";
            content.style.paddingBottom = "0";
            if (icon) {
                icon.classList.remove("fa-chevron-up");
                icon.classList.add("fa-chevron-down");
            }
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.paddingTop = "10px";
            content.style.paddingBottom = "10px";
            if (icon) {
                icon.classList.remove("fa-chevron-down");
                icon.classList.add("fa-chevron-up");
            }
        }
    });
});

// ================= SIMPLE FORM VALIDATION =================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        const name = contactForm.querySelector("#name");
        const email = contactForm.querySelector("#email");
        const message = contactForm.querySelector("#message");

        let errors = [];

        if (!name.value.trim()) {
            errors.push("Nama wajib diisi.");
        }
        if (!email.value.trim() || !email.value.includes("@")) {
            errors.push("Email tidak valid.");
        }
        if (!message.value.trim() || message.value.trim().length < 20) {
            errors.push("Pesan minimal 20 karakter.");
        }

        if (errors.length > 0) {
            e.preventDefault();
            alert(errors.join("\n"));
        }
    });
}
