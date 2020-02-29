const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.set('port', process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, 'build')));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname, '/build/index.html'));
});