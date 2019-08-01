// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var fs = require('fs');

function getMap(){
    let fundMap = {}
let lines = []
const files = "119506;INF209K01Q55;INF209K01WB9;Aditya Birla Sun Life Dividend Yield Fund - Dividend - Direct Plan;22.04;23-Jul-2019\n101737;INF209K01397;INF209K01CP1;Aditya Birla Sun Life Dividend Yield Fund - Dividend - Regular Plan;12.92;23-Jul-2019\n119507;INF209K01WA1;-;Aditya Birla Sun Life Dividend Yield Fund - Growth - Direct Plan;158.8;23-Jul-2019\n101738;INF209K01405;-;Aditya Birla Sun Life Dividend Yield Fund - Growth - Regular Plan;151.02;23-Jul-2019\n102594;INF109K01AF8;-;ICICI Prudential Value Discovery Fund - Growth - ;142.40;23-Jul-2019\n102594;INF109K01AF8;-;ICICI Prudential Value Discovery Fund - Dividend - ;142.40;23-Jul-2019"
files.split("\n").forEach(function(line, index, arr) {
    if (index === arr.length - 1 && line === "") { return; }
    lines.push(line);
});
lines.forEach(function(word,index){
    let fullSchemeName = word.split(';')[3]
    let nav = word.split(';')[4]
    let date = word.split(';')[5]
    let tempScheme = fullSchemeName.split("-");
    let fundName = tempScheme[0].toUpperCase().trim()
    let tempPlan = tempScheme[1].toUpperCase().trim()
    let option = (tempScheme[2] === ' ')? "NIL" : tempScheme[2].split(" ")[1].toUpperCase();
    if(fundName in fundMap){
        if(tempPlan in fundMap[fundName]["plans"]){
            if(!(option in fundMap[fundName]["plans"][tempPlan])){
                fundMap[fundName]["plans"][tempPlan][option] = {
                    "nav" : nav,
                    "date" :date
                    }
            }
        }else{
        fundMap[fundName]["plans"][tempPlan] = {
                [option] :{
                    "nav": nav,
                    "date" :date
                }
            }
        }   
    }else{
        fundMap[fundName] = {
            "plans" : {
                [tempPlan] : {
                    [option] : {
                        "nav" : nav,
                        "date" :date
                    }
                }
            }
        }
    }
    });

    
    return fundMap
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to RAP. Please give your Scheme name or the ISIN code to get  N.A.V. of your mutual Fund ';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hi RAP!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const GetNavIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetNavIntent'
    },
    handle(handlerInput){
        const scheme = ""+ handlerInput.requestEnvelope.request.intent.slots.Scheme.value.toUpperCase();
        const plan = ""+ handlerInput.requestEnvelope.request.intent.slots.Plan.value.toUpperCase();
        const option =""+ handlerInput.requestEnvelope.request.intent.slots.Option.value.toUpperCase(); 
        let speechText = "Please give the Correct Scheme Name"
        const schemeNavMap = getMap()
        speechText =  `The N.A.V. for the scheme ${scheme} ${plan} ${option} is `+schemeNavMap[scheme]["plans"][plan][option]["nav"] + "rupees"+" for the date "+schemeNavMap[scheme]["plans"][plan][option]["date"];
        // if(schemeNavMap[scheme]["plans"]=== undefined){
        //      speechText ="Please give the Correct Scheme Name"
        // }
        // else{
        //     
        // }
        
        const speech = `Scheme: ${scheme}\n Plan:  ${plan}\n Option:  ${option}`
      
        return handlerInput.responseBuilder.speak(speechText).getResponse()
        
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `${error.message}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetNavIntentHandler,
        GreetIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();

