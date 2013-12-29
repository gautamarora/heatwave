# Introduction

Heatwave is a web tracking and analytics application. On the client side, it tracks cursor movement and clicks on a webpage and sends the information to the server over websockets. On the server side, an admin can watch in realtime how all visitors are interacting with the webpage as well as generate an instant heatmap of the activity.

Heatwave is built using: Node.js, Socket.io (for WebSockets), MongoDB, Heatmap.js & JQuery

## Setup
* Checkout source: `git clone git@github.com:gautamarora/heatwave.git`

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
* Start the mongo server `mongod`
* Start the redis server `redis-server`
* Start the node server `node app.js`
* To load client version of webpage, access the url: http://127.0.0.1:3000/test/client/<user id> . You can access this page in multiple browsers to simulate multiple clients visiting the page
* To load admin version of webpage, access the url: http://127.0.0.1:3000/test/admin/0
* Move the cursor on the client page, to see the cursor move in realtime on admin interface
* Click 'Get Insights' on the admin interface, to get an instant geatmap of the client activity

## Screenshots
* Heatwave running in realtime tracking mode
![](https://dl.dropboxusercontent.com/u/10847716/heatwave/images/heatwave-tracking.png "Realtime Tracking")


* HeatWave running in heatmap insights mode
![](https://dl.dropboxusercontent.com/u/10847716/heatwave/images/heatwave-insights.png "Heatmap Insights")