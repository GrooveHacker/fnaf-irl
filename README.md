![head](https://raw.githubusercontent.com/GrooveHacker/animatromo-game-irl/main/public/head.png)

# Five Nights at Freddy's IRL
This is a fan-made version of Five Nights at Freddy's in real life with you as the guard and your friends as the animatronics.

In this version of the game, you have broken into a secure facility to hack into a computer and exfiltrate data. Having tripped the facility's security system, the animatronics guarding the facility are now loose and coming to find you. You must hack into the computer and exfiltrate the data before you are caught.

*This game is best played at night.*

## Setup the Game

### 1. 🕹️ Equipment
You will need the following:
- A Wi-Fi network (Internet connection not necessary)
- A computer with a keyboard and mouse
- A smartphone for each player (including the guard)
- One or more IP cameras (A phone can serve as an IP camera as well)
- A paper printout/screen for displaying each QR code
- A flashlight

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

**IMPORTANT:** If your camera streams are password protected, log in to them in the browser on the guard's computer before opening the guard page.

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

For 2-3 animatronics, 4-6 QR codes are recommended.

For 4+ animatronics, 8+ QR codes are recommended.

#### Get the Links
Each QR code must link to a designated page on the game server. The number of these pages is specified by the `QR_CODES` parameter in the **.env** file.

For every number from 1 to `QR_CODES`, there is a link on the game server which ends in that number:

`http://<IP address of guard's computer>:<game server port>/attack/<link number>`

Ex. `http://192.168.1.100/attack/5`

#### Generate the QR Codes

Each link must be transformed into a QR code and printed out or displayed.

Generate a QR code by using a service such as QR server:

`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://192.168.1.100/attack/5`

#### Placing the QR Codes

These QR codes should be displayed evenly throughout the play space, with each in the vicinity of a security camera. An animatronic attempting to scan the QR code should be visible to the guard when viewing the camera.

## How to Play

Find a room for the guard to be in, and a room for the animatronics to start in. These rooms should ideally be at opposite ends of the play space.

Set up your cameras and QR codes in several areas scattered around the play space, making sure that each QR code is in the vicinity of a security camera.

### Guard
Your goal is to complete your tasks on the computer without getting caught by an animatronic.

1. Open the browser on your computer and go to `http://localhost:<game server port>/guard`

2. Open the browser on your phone and go to `http://<IP address of your computer>:<game server port>/remote`

3. Set up your computer as far from the door as possible.

4. Place your phone along with the flashlight in a spot inaccessible from the computer and closer to the door, such as on a table.

- Make sure the `ATTACK` button is closer to the door than the `REPAIR` button.

5. In the event of an error, you must leave the computer and push the `REPAIR` button on your phone to fix it.

- The phone cannot be moved from its spot.

6. In the event that something *desirable* enters the room, you may shine the flashlight in its eyes at any time to make it leave.

- Before returning to the computer, the flashlight must be returned to its spot next to your phone.

**TIP:** Use the cameras to check if an animatronic is scanning a QR code. If you see their screen turn green, they're coming after you.

### Animatronic
Your goal is to hit the `ATTACK` button on the guard's phone.

Doing so will trigger an error on the guard's computer, forcing them to get up from their computer and repair it. This is where you jumpscare them. (Get creative- hide behind something and wait or just charge at them)

1. Start in the designated animatronic starting room.

2. You may move around freely in the play space, but you cannot enter the guard's room yet.

3. As you move around, start scanning any QR codes you come across.

4. In the event that your scanned QR code is a `FAIL`, continue moving around and scanning QR codes.

5. In the event that your scanned QR code is a `SUCCESS`, it's your turn to attack the guard.

- Make your way to the guard's room and attempt to hit the `ATTACK` button on their phone at any time.

- If they shine the flashlight at you before you hit the button, your attack has failed and you must return to the starting room.

- Once you have returned, you may continue moving around and scanning QR codes.

**TIP:** Conspire with your fellow animatronics. Try and distract the guard so they won't notice when you scan a QR code.

## Start the Game

Start the game server with Node:
```
node server.js
```