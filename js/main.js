document.addEventListener('DOMContentLoaded', function() {
    
    const navbar = document.querySelector('.navbar');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Theme Toggle
    function updateThemeIcon() {
        const isDark = html.getAttribute('data-bs-theme') === 'dark';
        if (themeIcon) {
            themeIcon.className = isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon();
        });
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon();
    }
    
    // Navbar Scroll
    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                if (document.querySelector('.hero-section')) {
                    navbar.classList.remove('scrolled');
                }
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const successMessage = document.getElementById('successMessage');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (btnText) btnText.classList.add('d-none');
            if (btnSpinner) btnSpinner.classList.remove('d-none');
            if (submitBtn) submitBtn.disabled = true;
            
            setTimeout(function() {
                if (btnText) btnText.classList.remove('d-none');
                if (btnSpinner) btnSpinner.classList.add('d-none');
                if (submitBtn) submitBtn.disabled = false;
                if (successMessage) successMessage.classList.add('show');
                contactForm.reset();
                
                setTimeout(function() {
                    if (successMessage) successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        });
    }
    
    // Project Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('#projectsGrid > div');
    
    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.classList.add('active');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    }
                });
            });
        });
    }
});
const motos = [
{ nom:"APE CITY 230", prix:"374,500 HTG", marque:"PIAGGIO", img:"img/APE CITY + 230.jpg" },
{ nom:"APE CITY NXT-200", prix:"348,000 HTG", marque:"PIAGGIO", img:"img/APE CITY NXT-200.jpg" },

{ nom:"HERO ECO 125", prix:"162,500 HTG", marque:"HERO", img:"img/HERO COLOR ECO 125.jpg" },
{ nom:"HERO ECO 150", prix:"176,500 HTG", marque:"HERO", img:"img/HERO COLOR ECO 150.jpg" },
{ nom:"XPULSE 200", prix:"288,500 HTG", marque:"HERO", img:"img/HERO COLOR XPULSE 200.jpg" },

{ nom:"HJ-110-6", prix:"74,800 HTG", marque:"HAOJIN", img:"img/HJ-110-6.jpg" },
{ nom:"HJ-150-11B", prix:"92,500 HTG", marque:"HAOJIN", img:"img/HJ-150-11B.jpg" },
{ nom:"HJ-150ZH-8", prix:"171,200 HTG", marque:"HAOJIN", img:"img/HJ-150ZH-8.jpg" },
{ nom:"HJ-200GY-3", prix:"125,200 HTG", marque:"HAOJIN", img:"img/HJ-200GY-3.jpg" },
{ nom:"HJ-250ZH-10", prix:"220,000 HTG", marque:"HAOJIN", img:"img/HJ-250ZH-10.jpg" },

{ nom:"LK-110-9A", prix:"74,800 HTG", marque:"LINKENG", img:"img/LK-110-9A.jpg" },
{ nom:"LK-125-BS", prix:"81,750 HTG", marque:"LINKENG", img:"img/LK-125-BS.jpg" },
{ nom:"LK-200GY-3", prix:"125,200 HTG", marque:"LINKENG", img:"img/LK-200GY-3.jpg" }
];

const itemsPerPage = 5;
let currentPage = 1;

function afficherMotos(page) {
    const container = document.getElementById("moto-list");
    container.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = motos.slice(start, end);

    pageItems.forEach(moto => {
        container.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card shadow">
                <img src="${moto.img}" class="card-img-top">
                <div class="card-body text-center">
                    <h5>${moto.nom}</h5>
                    <p>${moto.marque}</p>
                    <p class="fw-bold">${moto.prix}</p>
                    <a href="contact.html" class="btn btn-outline-light">Voir détails</a>
                </div>
            </div>
        </div>
        `;
    });
}

function setupPagination() {
    const pageCount = Math.ceil(motos.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        pagination.innerHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
            <a class="page-link" href="#">${i}</a>
        </li>`;
    }

    document.querySelectorAll(".page-link").forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = index + 1;
            afficherMotos(currentPage);
            setupPagination();
        });
    });
}

// INITIALISATION
afficherMotos(currentPage);
setupPagination();