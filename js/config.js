// ─── CONFIGURATION EMAILJS ──────────────────────────────────────────────────
// 1. Créez un compte gratuit sur https://www.emailjs.com
// 2. Ajoutez un service email (Gmail, Outlook…) → notez le "Service ID"
// 3. Créez 3 templates (voir détails ci-dessous) → notez leurs "Template ID"
// 4. Account > API Keys → copiez votre "Public Key"
// 5. Remplacez les valeurs ci-dessous par les vôtres

const EMAIL_CONFIG = {
    publicKey:        'VOTRE_PUBLIC_KEY',          // Account > API Keys
    serviceId:        'VOTRE_SERVICE_ID',           // Email Services > Service ID

    // Template 1 – Confirmation au client après commande
    // Variables à utiliser dans le template EmailJS :
    //   {{to_name}}, {{to_email}}, {{order_number}}, {{order_date}},
    //   {{order_items}}, {{order_total}}
    templateClientId: 'ocm_client_confirm',

    // Template 2 – Notification à l'admin à chaque nouvelle commande
    // Variables : {{order_number}}, {{client_name}}, {{client_email}},
    //   {{client_phone}}, {{client_city}}, {{order_items}}, {{order_total}}
    templateAdminId:  'ocm_admin_notify',

    // Template 3 – Email au client lors d'un changement de statut
    // Variables : {{to_name}}, {{to_email}}, {{order_number}}, {{new_status}}
    templateStatutId: 'ocm_statut_update',

    // Email de l'administrateur (reçoit les notifications de nouvelles commandes)
    adminEmail: 'jjeune2205@gmail.com'
};

// ─── COMPTE ADMINISTRATEUR ───────────────────────────────────────────────────
// Identifiants de connexion de l'administrateur
const ADMIN_CREDENTIALS = {
    email:    'jjeune2205@gmail.com',
    password: 'admin2026',
    nom:      'Administrateur'
};
