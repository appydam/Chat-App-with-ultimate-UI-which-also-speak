const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

const sessionId = uuid.v4();  

// url encoded form bhejenge , toh uske liye yeh likhna padhega
app.use(bodyParser.urlencoded({   // post request kr rhe hai , toh body parser ka use krna padhega
    extended:false
})) 

// start
//  this code is basically to prevent cors error , here default browser is opened as normal html opens , not the local host , so to allow this url to open , we use this code
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  // end



// now we will make route
app.post('/send-msg',(req,res)=>{
    runSample(req.body.MSG).then(data=>{     // MSG is the name of input , see in HTML file
        res.send({reply:data})
    })
})



/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg , projectId = 'arpit-chatbot-wkkyyh') {

    

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename:"G:/All web development/chatbot using Dialogflow and nodejs/Arpit-ChatBot-93f23d237b1b.json"  // credentials wwali file ki location
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);  // yeh cheez return bhi karega , niche dekho
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  return result.fulfillmentText;
}

app.listen(port,()=>{
    console.log("running on port" + port)
})


runSample()