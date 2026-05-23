// ─── AUTHENTIFICATION – localStorage ───────────────────────────────────────
// Dépend de : config.js  (doit être chargé avant auth.js)

const AUTH_KEY  = 'ocm_user';
const USERS_KEY = 'ocm_users';

// Crée le compte admin au premier chargement s'il n'existe pas déjà
function _initAdminAccount() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.find(u => u.email === ADMIN_CREDENTIALS.email)) {
        users.unshift({
            nom:     ADMIN_CREDENTIALS.nom,
            email:   ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
            isAdmin: true
        });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
}

function inscrire(nom, email, password) {
    // Empêche l'inscription avec l'email admin
    if (email === ADMIN_CREDENTIALS.email) {
        return { success: false, message: 'Cet email est réservé.' };
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Cet email est déjà utilisé.' };
    }
    const user = { nom, email, password, isAdmin: false };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user };
}

function connecter(email, password) {
    _initAdminAccount(); // S'assure que l'admin existe
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user  = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Email ou mot de passe incorrect.' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user };
}

function deconnecter() {
    localStorage.removeItem(AUTH_KEY);
    const isInPages = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
    window.location.href = isInPages ? '../index.html' : 'index.html';
}

function getUtilisateur() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
}

function estConnecte() {
    return !!getUtilisateur();
}

function estAdmin() {
    const u = getUtilisateur();
    return !!(u && u.isAdmin);
}

// ─── NAVBAR UTILISATEUR ──────────────────────────────────────────────────────
// Remplace l'icône #nav-user par un dropdown Bootstrap quand connecté
function mettreAJourNavUser() {
    const navUser = document.getElementById('nav-user');
    if (!navUser) return;

    const user      = getUtilisateur();
    const isInPages = window.location.pathname.replace(/\\/g, '/').includes('/pages/');

    if (user) {
        const panierId  = isInPages ? 'panier.html'          : 'pages/panier.html';
        const suiviId   = isInPages ? 'suivi-commande.html'  : 'pages/suivi-commande.html';
        const adminId   = isInPages ? 'admin.html'           : 'pages/admin.html';

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown d-inline-block';

        const clientLinks = !user.isAdmin ? `
            <li><a class="dropdown-item" href="${panierId}">
                <i class="bi bi-cart3 me-2"></i>Mon panier
            </a></li>
            <li><a class="dropdown-item" href="${suiviId}">
                <i class="bi bi-truck me-2"></i>Mes commandes
            </a></li>` : `
            <li><a class="dropdown-item fw-bold text-danger" href="${adminId}">
                <i class="bi bi-speedometer2 me-2"></i>Tableau admin
            </a></li>`;

        dropdown.innerHTML = `
            <button class="btn text-white dropdown-toggle ms-1 px-2"
                    type="button" data-bs-toggle="dropdown" aria-expanded="false"
                    style="background:none;border:none;">
                <i class="bi bi-person-check-fill fs-5"></i>
                <span class="d-none d-lg-inline ms-1 fw-semibold">${user.nom.split(' ')[0]}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow" style="min-width:200px;">
                <li class="px-3 py-2">
                    <small class="text-muted d-block">Connecté en tant que</small>
                    <strong class="small">${user.email}</strong>
                </li>
                <li><hr class="dropdown-divider my-1"></li>
                ${clientLinks}
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                    <a class="dropdown-item text-danger" href="#"
                       onclick="event.preventDefault(); deconnecter();">
                        <i class="bi bi-box-arrow-right me-2"></i>Déconnexion
                    </a>
                </li>
            </ul>`;

        navUser.replaceWith(dropdown);
    } else {
        navUser.href    = (isInPages ? 'login.html' : 'pages/login.html');
        navUser.innerHTML = '<i class="bi bi-person-circle fs-5"></i>';
        navUser.title   = 'Connexion';
    }
}

// Initialise admin et met à jour la navbar au chargement
document.addEventListener('DOMContentLoaded', () => {
    _initAdminAccount();
    mettreAJourNavUser();
});
