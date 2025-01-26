Feature: Création d'un utilisateur
  Contexte:
    La création d'un utilisateur est soumise à des règles strictes de validation des champs. 
    Une fois validée cette action déclenche des événements pour sauvegarder les informations et fournir un retour visuel à l'utilisateur.

  Critères d'acceptance:
    - Tous les champs obligatoires doivent être correctement remplis pour activer le bouton "Créer un compte".
    - En cliquant sur "Créer un compte", les données doivent être envoyées au serveur.
    - Si la création réussit :
      - Une notification de succès (popup ou toast) doit s'afficher avec un message clair : "Utilisateur créé avec succès."
      - Le formulaire doit être réinitialisé ou l'utilisateur redirigé vers une autre page (configuration optionnelle).
    - Si la création échoue :
      - Une notification d'erreur doit s'afficher avec un message expliquant la raison de l'échec.
      - Les champs erronés doivent être mis en évidence avec un message d'aide.
    - Le bouton "Réinitialiser" doit vider tous les champs, mais ne doit pas déclencher une action côté serveur.
