
# Five Nights at Freddy's IRL

This is a fan-made version of Five Nights at Freddy's in real life with you as the guard and your friends as the animatronics.

In this version of the game, you (the "guard") have broken into a secure facility to hack into a computer and exfiltrate data. Having tripped the facility's security system, the "animatronics" guarding the facility are now loose and coming to find you. You must hack into the computer and exfiltrate the data before you are caught.
## Setup the Game

### 1. 🕹️ Equipment
You will need the following:
- A Wi-Fi network (Internet connection not necessary)
- A computer with a keyboard and mouse
- A smartphone for each player (including the guard)
- One or more IP cameras (A phone can serve as an IP camera as well)

### 2. 🎥 Cameras


### 3. 💻 Software
To run the game server, you will need to install [Node.js](https://nodejs.org/en/).

After it's installed, download this project and open a terminal in the project folder.

### 4. ⚙️ Configure
In the project folder, there is a **.env** file for configuring your game. It contains the following parameters:

| Parameter | Description |
| - | - |
| `SERVER_PORT` | The game server will run on this port. The default port is `80`. |
| `CAM_URLS` | Contains the URLs for each IP camera stream in order. Ex: `http://addr1/video http://addr2/video http://addr3/video` |
| `QR_CODES` | `string` |
| `SCAN_ALERT_TIME` | `string` |


## Start the Game

Start the game server with Node:

```
node server.js
```
