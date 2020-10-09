## Clockware Application

This is a non commercial application (REACT+EXPRESS+Node.js+PostgreSQL) that imitates process of making orders in clock-repairing workshop.<br/>
[You can try it on Heroku](clockware-app.herokuapp.com)<br/>
As a client you can choose city, date and size of your order, and then you will be shown the masters.<br/>
If all of them are busy, app will recommend you the nearest time by the same date (if it's possible).<br/>
If order was formed - you will recieve an email. <br/>
You will be also notified when master will finish your order. In this case you'll get an email, that contains link to leave a feedback.<br/>
As admin or master - you can login to clockware-app. Master has an access only to his orders. Admin can create/delete/update all the cities, masters, prices, and also can browse any master's order.

### `First steps`

You have to install node_modules using "yarn install".
Use "cd client" and then "yarn install" to install node_modules for client.

### `.env`

You should create .env file in "server" folder with next keys:

DATABASE_URL - your postgres url<br/>
SECRETKEY - key for JWT<br/>
EMAIL and EMAIL_PASS - keys for Sendgrid<br/>

### `Run app`

To run server use then "yarn nodemon src/server.js"
To run client use "cd client" and then "yarn start"