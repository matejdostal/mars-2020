# Mars Rover 2020 - Student work

Objectives:
        => Robot creating environment maps, autonomous driving, LIDAR sensors </br>

<img src="http://dennikc.sk/mars-rover-pictures/rover.jpg"  align="right" width=350>

## Sections
> ##### [Arduino](./arduino/controller.ino)
- Code written in ++Arduino++
- Radar, Movement
- Bluetooth communication
- LIDAR senzors
        
> ##### [Server](./server)
- ++Node.js++
- Arduino-Server, Server-Client connections
- Polar to Kartesian coordinates
- Serialport, WebSockets

<img src="http://dennikc.sk/mars-rover-pictures/kitchen.png"  align="right" width=300>
<img src="http://dennikc.sk/mars-rover-pictures/hallway.png"  align="right" width=300>
        
> ##### [Client](./client)
- ++JavaScript++
- Map creating
- p5.js
- Retrieving data from Server
        
##### [Controller](./controller)
- Sending commands to Server
- Rover movements

<img src="http://dennikc.sk/mars-rover-pictures/wheel.jpg"  align="right" width=250>

## Future plans
- Autonomous movement - [A* pathfinding](./server/astar.js)
- Walls created using Linear regression - [Demo](./server/linear_regression.js)
- 6 wheels, 360 wheels rotation
- Controller UI update
- Stronger wheels, better sensors
- Multiple Arduino modes
