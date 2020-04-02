# Mars Rover 2020 - Student work

> __Objectives__:
         Robot creating environment maps, autonomous driving, LIDAR sensors </br>
> [__Learn more__](./soc.docx)

<img src="http://dennikc.sk/mars-rover-pictures/rover.jpg"  align="right" width=350>

## Sections
> ##### [Arduino](./arduino/controller.ino)
- Code written in __Arduino__
- Radar, Movement
- Bluetooth communication
- LIDAR senzors
        
> ##### [Server](./server)
- __Node.js__
- Arduino-Server, Server-Client connections
- Polar to Kartesian coordinates
- Serialport, WebSockets

<img src="http://dennikc.sk/mars-rover-pictures/kitchen.png"  align="right" width=300>
<img src="http://dennikc.sk/mars-rover-pictures/hallway.png"  align="right" width=300>
        
> ##### [Client](./client)
- __JavaScript__
- Map creating
- p5.js
- Retrieving data from Server
        
> ##### [Controller](./controller)
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
