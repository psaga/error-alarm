const express = require('express'),
    cors = require("cors"),
    app = express(),
    port = process.env.PORT || 3000;

app.use(cors());

// Register the routes and mount them all at /api
app.use("/api", require("./routes")(express.Router()));

app.listen(port, () => {
    console.log('Listening on port: ', port);
});