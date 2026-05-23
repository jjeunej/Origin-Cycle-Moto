// ─── PANIER – localStorage ──────────────────────────────────────────────────
const PANIER_KEY = 'ocm_panier';

function getPanier() {
    return JSON.parse(localStorage.getItem(PANIER_KEY) || '[]');
}

function _sauvegarderPanier(panier) {
    localStorage.setItem(PANIER_KEY, JSON.stringify(panier));
    afficherCompteurPanier();
}

// Convertit "74,800 HTG" → 74800
function parsePrix(prixStr) {
    return parseFloat(String(prixStr).replace(/[^0-9]/g, '')) || 0;
}

function ajouterAuPanier(moto) {
    const panier = getPanier();
    const idx = panier.findIndex(item => item.nom === moto.nom);
    if (idx >= 0) {
        panier[idx].quantite += 1;
    } else {
        panier.push({ nom: moto.nom, prix: moto.prix, marque: moto.marque, img: moto.img, quantite: 1 });
    }
    _sauvegarderPanier(panier);
    afficherToast(`✓ ${moto.nom} ajouté au panier !`);
}

// Appelé depuis le bouton data-attribute dans les cartes motos
function ajouterAuPanierDepuisCard(btn) {
    ajouterAuPanier({
        nom:    btn.dataset.nom,
        prix:   btn.dataset.prix,
        marque: btn.dataset.marque,
        img:    btn.dataset.img
    });
}

function supprimerDuPanier(index) {
    const panier = getPanier();
    panier.splice(index, 1);
    _sauvegarderPanier(panier);
}

function mettreAJourQuantite(index, quantite) {
    const panier = getPanier();
    const qte = parseInt(quantite);
    if (qte < 1) { supprimerDuPanier(index); return; }
    panier[index].quantite = qte;
    _sauvegarderPanier(panier);
}

function calculerTotal() {
    return getPanier().reduce((total, item) => total + parsePrix(item.prix) * item.quantite, 0);
}

function viderPanier() {
    localStorage.removeItem(PANIER_KEY);
    afficherCompteurPanier();
}

// Met à jour le badge rouge sur l'icône panier
function afficherCompteurPanier() {
    const compteur = document.getElementById('cart-count');
    if (!compteur) return;
    const total = getPanier().reduce((n, item) => n + item.quantite, 0);
    compteur.textContent = total;
    compteur.style.display = total > 0 ? 'inline-flex' : 'none';
}

// Toast notification bas-droite
function afficherToast(message) {
    let toast = document.getElementById('ocm-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ocm-toast';
        toast.style.cssText = [
            'position:fixed', 'bottom:30px', 'right:30px',
            'background:#ff3c3c', 'color:#fff', 'padding:12px 22px',
            'border-radius:12px', 'z-index:9999', 'font-weight:600',
            'font-size:0.9rem', 'opacity:0', 'transition:opacity 0.3s',
            'pointer-events:none', 'box-shadow:0 4px 20px rgba(255,60,60,0.4)'
        ].join(';');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
}

document.addEventListener('DOMContentLoaded', afficherCompteurPanier);
