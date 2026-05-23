// ─── ENVOI D'EMAILS VIA EMAILJS ─────────────────────────────────────────────
// Dépend de : config.js  (doit être chargé avant email.js)

function _emailConfigured() {
    return EMAIL_CONFIG.publicKey && EMAIL_CONFIG.publicKey !== 'VOTRE_PUBLIC_KEY';
}

// Charge le SDK EmailJS depuis CDN de façon asynchrone
function _loadEmailJS() {
    return new Promise((resolve) => {
        if (window.emailjs) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        s.onload  = () => { emailjs.init(EMAIL_CONFIG.publicKey); resolve(true); };
        s.onerror = () => resolve(false);
        document.head.appendChild(s);
    });
}

// Formate les articles pour l'affichage dans les emails
function _formatArticlesEmail(articles) {
    return articles.map(a => `• ${a.nom} (${a.marque}) × ${a.quantite}  —  ${a.prix}`).join('\n');
}

// Envoi email de confirmation au client + notification à l'admin
async function envoyerEmailCommande(commande) {
    if (!_emailConfigured()) {
        console.warn('EmailJS non configuré. Remplissez js/config.js pour activer les emails.');
        return;
    }
    const ok = await _loadEmailJS();
    if (!ok) return;

    const items = _formatArticlesEmail(commande.articles);

    // Email de confirmation au client
    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateClientId, {
            to_name:      `${commande.client.prenom} ${commande.client.nom}`,
            to_email:     commande.client.email,
            order_number: commande.numero,
            order_date:   commande.date,
            order_items:  items,
            order_total:  formatPrix(commande.total)
        });
        console.log('Email confirmation client envoyé.');
    } catch (e) {
        console.error('Erreur email client :', e);
    }

    // Email de notification à l'admin
    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateAdminId, {
            to_email:     EMAIL_CONFIG.adminEmail,
            order_number: commande.numero,
            client_name:  `${commande.client.prenom} ${commande.client.nom}`,
            client_email: commande.client.email,
            client_phone: commande.client.tel,
            client_city:  commande.client.ville,
            order_items:  items,
            order_total:  formatPrix(commande.total)
        });
        console.log('Email notification admin envoyé.');
    } catch (e) {
        console.error('Erreur email admin :', e);
    }
}

// Envoi email au client lors d'un changement de statut
async function envoyerEmailStatut(commande) {
    if (!_emailConfigured()) {
        console.warn('EmailJS non configuré. Remplissez js/config.js pour activer les emails.');
        return;
    }
    const ok = await _loadEmailJS();
    if (!ok) return;

    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateStatutId, {
            to_name:      `${commande.client.prenom} ${commande.client.nom}`,
            to_email:     commande.client.email,
            order_number: commande.numero,
            new_status:   commande.statut
        });
        console.log(`Email statut "${commande.statut}" envoyé à ${commande.client.email}`);
    } catch (e) {
        console.error('Erreur email statut :', e);
    }
}
