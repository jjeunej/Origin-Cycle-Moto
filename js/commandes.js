// ─── COMMANDES – localStorage ────────────────────────────────────────────────
const COMMANDES_KEY  = 'ocm_commandes';
const ADMIN_PASSWORD = 'admin2026';

const STATUTS = ['En attente', 'Confirmée', 'En préparation', 'Expédiée', 'Livrée', 'Annulée'];

function _genererNumeroCommande() {
    return 'OCM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function creerCommande(client) {
    const panier = getPanier(); // depuis panier.js
    if (!panier.length) return null;

    const commande = {
        numero:   _genererNumeroCommande(),
        date:     new Date().toLocaleDateString('fr-FR'),
        dateISO:  new Date().toISOString(),
        client,
        articles: panier,
        total:    calculerTotal(), // depuis panier.js
        statut:   'En attente'
    };

    const commandes = getCommandes();
    commandes.push(commande);
    localStorage.setItem(COMMANDES_KEY, JSON.stringify(commandes));
    viderPanier(); // vide le panier après commande
    return commande;
}

function getCommandes() {
    return JSON.parse(localStorage.getItem(COMMANDES_KEY) || '[]');
}

function getCommandeParNumero(numero) {
    return getCommandes().find(c => c.numero === numero.trim().toUpperCase()) || null;
}

function mettreAJourStatut(numero, statut) {
    const commandes = getCommandes();
    const idx = commandes.findIndex(c => c.numero === numero);
    if (idx >= 0) {
        commandes[idx].statut = statut;
        localStorage.setItem(COMMANDES_KEY, JSON.stringify(commandes));
        return true;
    }
    return false;
}

// Badge coloré selon statut
function badgeStatut(statut) {
    const map = {
        'En attente':      'warning text-dark',
        'Confirmée':       'info text-dark',
        'En préparation':  'primary',
        'Expédiée':        'secondary',
        'Livrée':          'success',
        'Annulée':         'danger'
    };
    const cls = map[statut] || 'secondary';
    return `<span class="badge bg-${cls}">${statut}</span>`;
}

// Numéro HTG formaté
function formatPrix(n) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' HTG';
}
