const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');
const path = require('path');
const mime = require('mime');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use('/public', express.static(__dirname + '/public', {
    setHeaders: (res, path) => {
      if (mime.getType(path) === 'text/css') {
        res.set('Content-Type', 'text/css');
      }
    }
  }));

  app.use(bodyParser.json());

  var mailchimpInstance   = 'us21',
     listUniqueId        = 'd63a48260a',
    mailchimpApiKey     = 'a63806582845706fa86e2574a7cd6f11-us21';

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'signup.html'))
})

app.post('/', function(req,res){
    var firstName = req.body.firstName;
    var secondName = req.body.secondName;
    var emailAddress = req.body.emailAddress;

    //  request
    //     .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    //     .set('Content-Type', 'application/json;charset=utf-8')
    //     .set('Authorization', 'Basic ' + new Buffer.alloc(`any:${mailchimpApiKey}`.length, `any:${mailchimpApiKey}`, 'utf8').toString('base64'))
    //     .send({
    //       'email_address': emailAddress,
    //       'status': 'subscribed',
    //       'merge_fields': {
    //         'FNAME': firstName,
    //         'LNAME': secondName
    //       }
    //     })
    //     .end(function(err, response) {
    //           if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
    //             res.send('Signed Up!');
    //           } else {
    //             res.send('Sign Up Failed :(');
    //           }
    //       });

    // alternatively
    const data =  {
      members: [
        {
          email_address: emailAddress,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName,
            LNAME: secondName
            }
        }
      ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/d63a48260a"
    const options = {
      method: 'POST',
      auth: 'seun1:a63806582845706fa86e2574a7cd6f11-us21'
        };

       const request =  https.request(url, options, function(response){
        if (response.statusCode===200){
          res.sendFile(path.join(__dirname, 'success.html'));
        } else {
          res.sendFile(path.join(__dirname, 'failure.html'));
        }
         
        });

        request.write(jsonData);
        request.end();  
    

})


app.post('/failure', function(req,res){
  res.redirect('/');
})



app.listen(3000 || process.env.PORT, function(){
    console.log('Server running on port 3000');
})