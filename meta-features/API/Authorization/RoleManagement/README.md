# Guide d'utilisation des tests automatisés Cypress

## Prérequis

Avant de commencer, assurez-vous de disposer des éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Cypress](https://www.cypress.io/)

## Installation

Suivez ces étapes pour installer Cypress sur votre machine :

1. Assurez-vous d'avoir Node.js et npm installés.
2. Ouvrez votre terminal et exécutez la commande suivante pour installer Cypress globalement :
   ```bash
   cd automatic-tests
   npm install
   ```
3. Vous êtes maintenant prêt à utiliser Cypress pour exécuter des tests.

## Structure du Projet

Lorsque vous clonez ou téléchargez le projet, vous trouverez une structure de fichiers typique comme suit :

```
automatic-tests/
  cypress/
    environements/
    fixtures/
    integration/
        |-- AccesibilityMearoles
            |--Metarolestests.js
        |-- DeliveryModes
            |--feature1
                |--feature1.js
                |--feature1.feature
            |--feature2
                |--feature2.js
                |--feature2.feature
            ...
        |-- DeliveryOffers
        |-- DeliveryOffersAnalysis
        |-- Inbounds
        |-- LogisticPartners
        |-- OutboundShipments
        |-- Returns
        |-- SalesChannelConfiguration
        |-- Transverse
    plugins/
    support/
  node_modules/
  cypress.config.js
  package.json
  ...
```

- [cypress](./cypress/) : Le répertoire principal des tests Cypress.
- [cypress/environement](./cypress/support/environments/) : Les fichiers des variables environnements
- [cypress/integration](./cypress/integration/) : Les tests / features
- [cypress/plugins](./cypress/plugins/) : Les fichiers de plugins personnalisés.
- [cypress/support](./cypress/support/) : Les fichiers de support, tels que les commandes personnalisées.
- [cypress.config.json](./cypress.config.js) : Le fichier de configuration Cypress.

## Configuration

Vous pouvez personnaliser la configuration de Cypress en modifiant le fichier `cypress.json`. Consultez la [documentation de Cypress](https://docs.cypress.io/guides/references/configuration.html) pour en savoir plus sur les options de configuration disponibles.

## Écriture de Tests

Les tests Cypress sont écrits en utilisant du code JavaScript ou TypeScript.

Voici un exemple simple de test :

```javascript
// Exemple de test Cypress en BDD
Given(`the user FFMONLYSELLER_FFMPORTAL_RESTREINT is logged`, () => {
  cy.loginByRole('FFMONLYSELLER_FFMPORTAL_RESTREINT');
});
When(`the user clicks on the redirect button DeliveryModes`, () => {
  cy.get("a[href='/delivery-modes']").first().click();
  cy.url().should('include', '/delivery-modes');
});
Then(`the user should be redirected to DeliveryModes page`, () => {
  cy.contains('h1', 'Delivery');
  cy.log('the DeliveryModes page is displayed correctly');
});
```

## Organisation des Tests

Pour organiser vos tests, vous pouvez suivre la structure de dossiers sous le répertoire "integration" de votre projet Cypress.
Chaque panneau de l'application a son propre dossier sous le dossier "integration".

À l'intérieur de chaque dossier de panneau, vous créez des fonctionnalités en utilisant des dossiers distincts.
Chaque fonctionnalité est représentée par un dossier contenant à la fois le fichier `.feature` et le fichier `.js` correspondant.

Voici un exemple pour automatiser des tests pour la page "DeliveryModes" :
integration/
|-- DeliveryModes/
|-- nom_feature/
|-- nom_feature.feature
|-- nom_feature.js

Pour améliorer la réutilisation du code, vous pouvez définir des mots-clés partagés dans les fichiers situés dans le répertoire
`./support/common-step-definitions/`

```
  ./support/common-step-definitions/navigation-common_steps.js
  ./support/common-step-definitions/authentication-common-steps.js
...
```

## Exécution des Tests

Les deux commandes utilisées sont configurées dans le fichier `cypress.config.json`

### Interface Graphique (GUI)

Pour exécuter les tests Cypress en mode GUI, utilisez la commande suivante :

```bash
  npm run cypress:open
```

Cela ouvrira l'application Cypress, où vous pourrez sélectionner les tests/features à exécuter.

### Ligne de Commande (CLI)

Pour exécuter les tests en mode headless depuis la ligne de commande, utilisez la commande suivante :

```bash
  npm run cypress:run
```

## Variabilisation des environnements

Afin de rendre l'exécution des tests adaptable à divers environnements, une configuration a été mise en place pour permettre le lancement des tests sur l'environnement souhaité, défini comme une variable d'environnement.

Chaque environnement est paramétré avec un fichier de variables spécifique situé dans le répertoire : `./support/environments/`

Le choix du fichier de configuration dépend de la valeur de la variable d'environnement ENV. Par exemple, si la valeur est "recette", le fichier de variables "recette.json" sera pris en compte lors de l'exécution.

### Comment changer l'environnement d'éxecution ?

Dans le fichier [cypress.config.json](./cypress.config.js), changer la valeur de variable, par défaut il est configuré en dev.

```
    env: {
      ENV: "dev"
    }
```

### Comment ajouter et utiliser des variables dans les fichiers environnements ?

Pour ajouter une variable, c'est simple il suffit de l'ajouter aux trois fichiers d'environnement : dev.json / recette.json / preprod.json

Pour l'utiliser, il faut utiliser cette fonction cypress pour récupérer une variable d'environnement :

```
Cypress.env("variable_name")
```

### Utilisation des tags

L'utilisation de balises (tags) dans vos tests Cypress vous permet d'organiser et d'exécuter vos tests de manière sélective en fonction des fonctionnalités, des domaines ou des assets.

Par exemple, vous pouvez attribuer des balises comme "@IDS" ou "@FLOWIN" ou "@OSS" à des scénarios de test qui se rapportent à ces domaines particuliers de votre application. Ensuite, lors de l'exécution, vous pouvez choisir de n'exécuter que les tests marqués avec les balises pertinentes.

Exemple d'utilisation des tags :

### Comment je peux configurer l'éxecution par TAG:

Dans le fichier Cypress.config.json,changer la valeur de variable tags :

Exemples

```
    env: {
      tags: "@IDS"  ==> permet d'éxecuter les tests tagger avec @IDS
    }
```

```
    env: {
      tags: "@Smoke"  ==> permet d'éxecuter les tests tagger avec @Smoke
    }
```

## Rapports et Résultats

Après l'exécution des tests, vous trouverez des rapports détaillés dans le répertoire `cypress/reports`.
Vous pouvez consulter les rapports HTML pour analyser les résultats de chaque test.

## Bonnes Pratiques

Voici quelques recommandations à suivre pour adopter de bonnes pratiques lors de l'écriture de tests Cypress :

- Optez pour des sélecteurs spécifiques (data-test-id) pour cibler les éléments de l'interface utilisateur de manière précise
- Rédigez des tests autonomes et bien organisés, de manière à ce qu'ils puissent être exécutés indépendamment les uns des autres et sur tous les environnements.
- Utilisez des balises (tags) pour organiser et classifier vos tests en fonction de leur objectif ou de leur domaine d'application.
- Pour éviter la duplication de code, créez des commandes personnalisées (cypress commands) et des commandes réutilisables dans différents tests.

## Ressources Additionnelles

- [Documentation Cypress officielle](https://docs.cypress.io/)
- [Exemples de tests Cypress](https://github.com/cypress-io/cypress-example-recipes)
- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)

## Contact

ismail.ktami@ext.cdiscount.com
