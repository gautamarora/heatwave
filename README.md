# What is HeatWave?

HeatWave is a Node.js + Socket.io server to add the capability to watch users in realtime and generate heatmaps to your existing web application using cursor tracking. It can hook into your exsiting backend to pull the required user information to show recognizable users browsing the site. HeatWave was built as a hackathon project last year, and I am currenlty working on cleaning it up, adding simple configuration options as well turning it into an easy to use npm module.

## How It Works
HeatWave works by tracking cursor movement and clicks on the client side and sending this information to the server over websockets. The server acts as a proxy for information being recieved from all clients, logging it and forwarding it to an admin UI where an authenticated user can watch the aggregated stream of user activity. The admin UI also provides an 'insights' interface to display a heatmap of the user activity. 

Heatwave is built using: 
* Node.js
* Socket.io (for sending tracking data over WebSockets)
* JQuery (for client side cursor tracking)
* MongoDB (for persisting tracking data)
* Heatmap.js (for generating heatmaps)

## Setup
Checkout source: `git clone git@github.com:gautamarora/heatwave.git`

## Install
Embed client_loader.js or admin_loader.js on your webpage based on the role of the user (sample .jade and .html code is available)
```html
<script type="text/javascript" src="http://127.0.0.1:3000/javascripts/client_loader.js"></script>
<script type="text/javascript">
    hwloader.load('http://'+'127.0.0.1', '3000', function() {
        hwclient.init({uid : 1, host : '127.0.0.1', port : '3000'});
    });
</script>
```

## Run
* Start the mongo server `mongod` and redis server `redis-server`
* Start the node server `node app.js`
* To load client version of webpage, access the url: http://127.0.0.1:3000/test/client/999 . You can access this page in multiple browsers to simulate multiple clients visiting the page
* To load admin version of webpage, access the url: http://127.0.0.1:3000/test/admin/0
* Move the cursor on the client page, to see the cursor move in realtime on admin interface
* Click 'Get Insights' on the admin interface, to get an instant geatmap of the client activity

## Screenshots
* Heatwave running in realtime tracking mode
![](https://dl.dropboxusercontent.com/u/10847716/heatwave/images/heatwave-tracking.png "Realtime Tracking")


* HeatWave running in heatmap insights mode
![](https://dl.dropboxusercontent.com/u/10847716/heatwave/images/heatwave-insights.png "Heatmap Insights")