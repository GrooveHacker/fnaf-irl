
# Five Nights at Freddy's IRL
This is a fan-made version of Five Nights at Freddy's in real life with you as the guard and your friends as the animatronics.

In this version of the game, you have broken into a secure facility to hack into a computer and exfiltrate data. Having tripped the facility's security system, the animatronics guarding the facility are now loose and coming to find you. You must hack into the computer and exfiltrate the data before you are caught.

## Setup the Game

### 1. 🕹️ Equipment
You will need the following:
- A Wi-Fi network (Internet connection not necessary)
- A computer with a keyboard and mouse
- A smartphone for each player (including the guard)
- One or more IP cameras (A phone can serve as an IP camera as well)
- A paper printout/screen for displaying each QR code

### 2. 🛜 Wi-Fi network
Connect each device to your Wi-Fi network so that they can connect to each other.

### 3. 🎥 Cameras
Each IP camera needs to have an MJPEG stream accessible through your network. (This is more common with older security cameras)

If you don't have access to any IP cameras with this capability, additional smartphones will also work as IP cameras. Each player must have their own smartphone to play, so these cannot also serve as IP cameras. You will need additional smartphones if you want to use them as IP cameras.

Here's some free apps you can use to turn your smartphone(s) into IP cameras:
- For iOS
    - [Droid Cam](https://apps.apple.com/us/app/droidcam-webcam-obs-camera/id1510258102)
- For Android
    - [Droid Cam](https://play.google.com/store/apps/details?id=com.dev47apps.droidcam&hl=en_US&gl=US)
    - [IP Webcam](https://play.google.com/store/apps/details?id=com.pas.webcam&hl=en_US&gl=US)

For each of the apps above, here's the URL to access your camera:

`http://<your phone's IP address>:<port number>/video`

Ex. `http://192.168.1.101:8080/video`

The default port for Droid Cam is `4747`, and the default for IP Webcam is `8080`.

### 4. 💻 Guard's Computer
To run the game server, you will need to install [Node.js](https://nodejs.org/en/) on the guard's computer.

After it's installed, download this project and open a terminal in the project folder.

### 5. ⚙️ Configure
In the project folder, there is a **.env** file for configuring your game. It contains the following parameters:

| Parameter | Description |
| - | - |
| `SERVER_PORT` | The game server will run on this port. The default port is `80`.<br>Since `80` is the standard port for websites, it is also not necessary in the URL unless modified. |
| `CAM_URLS` | Contains the URLs for each camera stream in order.<br>Ex: `http://192.168.1.101:8080/video http://192.168.1.102:4747/video` |
| `QR_CODES` | The number of QR codes you want in your game |
| `SCAN_ALERT_TIME` | The number of seconds following the start of an attack after which the guard will be notified through a sound effect |

The game server must be restarted to update any changes made to the **.env** file.

### 6. 🤏 Almost There!
Now it's time to set up your QR codes.

For 2-3 animatronics, 5-6 QR codes are recommended.

For 4+ animatronics, 8+ QR codes are recommended.

#### Get the QR Codes
Each QR code must link to a designated page on the game server. The number of these pages is specified by the `QR_CODES` parameter in the **.env** file of the game server.

For every number from 1 to `QR_CODES`, there is a link on the game server which ends in that number:

`http://<IP address of guard's computer>:<game server port>/attack/<link number>`

Ex. `http://192.168.1.100/attack/5`





Each one of these links should be placed behind a QR code and printed out or displayed in a scannable fashion.

#### Placing

## Start the Game

Start the game server with Node:
```
node server.js
```
