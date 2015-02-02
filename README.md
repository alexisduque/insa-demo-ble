rtone-contrib-ble
=======================

Cross Plateform BLE App

## Rappel pour mettre en place l'environnement de Dev.
1. Il faut installer node, npm, grunt, grunt-cli, bower.
2. `npm install` et `grunt build`
3. Ajout des plugins : `cordova plugin add .....`
4. Ajout de la plateform : `cordova plateform add android`

**Ajouter les plugins avant d'ajouter la plateform**

Pour le BLE, le plugin est **com.evothings.ble**

## Utiliser ADB et le Wiko Kite sur Ubuntu 14.10

Ubuntu et ADB ne reconnaissent pas le mobile, ni en tant que périphique de stockage, ni pour le debogage avec ABD. Par contre, le debogger de Chrome le trouve bien. ^^

1. Activer le mode développeur et le debogage USB sur le WIKO.
  - **Settings->About Phone** et cliquer 10 fois sur **Build Number** pour afficher les options pour développeur.
  - **Settings->Developer options** et cocher **USB debugging**.
2. Sur Ubuntu :
  - Editer/créer le fichier `etc/udev/rules.d/51-android.rules` et ajouter les lignes suivantes :
```sh
SUBSYSTEM=="usb", ATTRS{idVendor}=="0a5c", MODE="0660", GROUP="plugdev" 
ATTR{idVendor}=="0a5c", ATTR{idProduct}=="0024", SYMLINK+="libmtp-%k", ENV{ID_MTP_DEVICE}="1", ENV{ID_MEDIA_PLAYER}="1"
```
- Editer/créer le fichier `~/.android/adb_usb.ini` et ajouter `0x0a5c` (l'idVendor du WIKO).

3. Rédemarrer udev : `sudo service udev restart`
4. Rédemarrer adv : `adb kill-server && adb start-server`

## Utiliser le pré-porcesseur SASS pour customiser Ionic
1. Ajouter ses nouvelles classes CSS, ou variables (ou bien overrider les variables de Ionic), avec la syntaxe SASS ( voir [le guide officiel Sass](http://sass-lang.com/guide#variables)) 
2. Génerer le nouveau CSS automatiquement live reload : ` sass --watch scss/inemotion.scss:www/css/inemotion.app.css`

## Outils pour créer automatiquement les Splashscreen et Icon aux bons formats pour Android et iOS
### Splashscreen : cordova-splash
##### Installation
```sh
sudo npm install cordova-splash/home/alex/Inemotion/logo_inemotion.png
/home/alex/Inemotion/logo_inemotion.svg
/home/alex/Inemotion/logo_inemotion_white.png
/home/alex/Inemotion/logo_inemotion_white.svg -g
sudo apt-get install GraphicsMagick
```
##### Utilisation
Créer le fichier splash.png exactement de taille 2208x2208ox dans le reptoire du projet et exécuter: `cordova-splash`
**Nota:** Pour generer pour ios, il faut créer le repetoire platforms/ios/Inemotion BLE/Resources/splash
##### Automatiser en créant un HOOK
*Permet d'automatiser le prcessus, lorsque l'on fait un `cordova build`
```sh
mkdir hooks/after_prepare
vi hooks/after_prepare/cordova-splash.sh
# Et copier ce qui suit
#!/bin/bash
cordova-splash
# Puis autoriser l'execution
chmod +x hooks/after_prepare/cordova-splash.sh
```
### Icones : cordova-icon
##### Installation
```sh
sudo npm install cordova-icon -g
sudo apt-get install imagemagick
```
##### Utilisation
Créer le fichier icon.png dans le reptoire du projet et exécuter: `cordova-icon`
**Nota:** Pour generer pour ios, il faut créer le repetoire platforms/ios/Inemotion BLE/Resources/icons

## Génerer pour PhoneGap Build
```sh
grunt build 
grunt phonegap
```
