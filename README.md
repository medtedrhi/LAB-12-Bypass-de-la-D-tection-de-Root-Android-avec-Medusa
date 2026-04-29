# LAB-12-Bypass-de-la-D-tection-de-Root-Android-avec-Medusa



## 1. Présentation du projet

Ce laboratoire a pour objectif de comprendre le fonctionnement des mécanismes de détection root dans une application Android, puis de les contourner dans un environnement contrôlé à l’aide d’outils d’instrumentation dynamique.

L’application utilisée est **OWASP UnCrackable Level 2**, une application volontairement vulnérable proposée pour l’apprentissage de la sécurité mobile et du reverse engineering Android.

Le test a été réalisé avec deux approches :

1. Bypass manuel avec **Frida**.
2. Bypass automatisé ou semi-automatisé avec **Medusa**.

L’objectif principal est de démontrer qu’une protection côté client, comme la détection root, peut être contournée à l’exécution si elle n’est pas accompagnée de protections plus robustes côté serveur et côté application.

---

## 2. Objectifs du laboratoire

Les objectifs du laboratoire sont les suivants :

- Installer et configurer Frida côté PC et côté Android.
- Vérifier la communication entre le PC et l’émulateur Android.
- Lancer une application Android protégée contre les environnements rootés.
- Observer le comportement de l’application avant le bypass.
- Utiliser Frida pour intercepter les appels Java sensibles.
- Bloquer les fonctions responsables de la fermeture de l’application.
- Masquer les fichiers et indicateurs liés au root.
- Contourner la vérification du code secret.
- Tester Medusa comme outil d’automatisation basé sur Frida.
- Documenter les preuves et les captures d’écran nécessaires.

---

## 3. Environnement de travail

| Élément | Description |
|---|---|
| Système hôte | Windows |
| Terminal utilisé | PowerShell |
| Appareil Android | Android Emulator |
| Identifiant de l’émulateur | `emulator-5554` |
| Application cible | OWASP UnCrackable Level 2 |
| Package Android | `owasp.mstg.uncrackable2` |
| Outil principal | Frida |
| Outil complémentaire | Medusa |
| Type d’analyse | Analyse dynamique |
| Niveau du lab | Sécurité mobile / Reverse engineering Android |

---

## 4. Application cible

L’application utilisée dans ce laboratoire est :

OWASP UnCrackable Level 2


## 5. Realisation

<img width="775" height="85" alt="image" src="https://github.com/user-attachments/assets/ccc88142-b46f-4ff7-93c2-da2ab6e58a88" />
Montre que l’émulateur Android est bien connecté au PC via ADB.

<img width="1208" height="736" alt="image" src="https://github.com/user-attachments/assets/8366a68d-c02c-40dd-bdbc-1ed86d8d3210" />
Montre que Frida détecte l’émulateur et l’application UnCrackable Level 2.

<img width="1410" height="649" alt="image" src="https://github.com/user-attachments/assets/07f90dc1-f647-4da0-8707-19ab34f67524" />
Montre l’exécution du script Frida avec les hooks chargés correctement.

<img width="384" height="835" alt="image" src="https://github.com/user-attachments/assets/a849dded-8742-4aff-97c2-c2f52b00d206" />
Montre le résultat après le bypass, lorsque l’application ne se bloque plus.

<img width="1432" height="612" alt="image" src="https://github.com/user-attachments/assets/4236371c-4a78-462c-8513-d2b0123bc5dd" />
Montre le lancement de Medusa et la sélection de l’émulateur Android.

<img width="1035" height="850" alt="image" src="https://github.com/user-attachments/assets/2413dab6-cbbe-4e45-8508-65a606c047ac" />
Montre l’utilisation du script Frida personnalisé comme fichier agent.js dans Medusa.

<img width="802" height="265" alt="image" src="https://github.com/user-attachments/assets/3745ba8e-89fc-4fe5-b94a-4402a00a78b0" />
Montre les modules disponibles dans Medusa.

<img width="384" height="835" alt="image" src="https://github.com/user-attachments/assets/a849dded-8742-4aff-97c2-c2f52b00d206" />
Montre le lancement final de l’application avec Medusa et le bypass appliqué.
