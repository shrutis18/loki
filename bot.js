var Botkit = require('botkit');

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;

const greetingMessages = require('./src/help/greeting-messages');
var BookingService = require('./src/service/booking-service');

var bookingService = new BookingService();

const controller = Botkit.slackbot({
  debug: true,
  interactive_replies: false // tells botkit to send button clicks into conversations
});

const slackbot = controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

controller.configureSlackApp({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: 'http://a130ccc4.ngrok.io',
  scopes: ['bot'],
  debug: true
});

controller.hears('', 'direct_mention,mention', function (bot, message) {
  const user = message.user;

  bot.startPrivateConversation({user: user}, function(response, convo){
        convo.say({
        text: `Hello <@${user}> :wave:`,
        attachments: [
          {
            title: 'I cannot talk on public channels. But I\'m all ears out here :simple_smile:',
            text: 'Type `help` to learn more about me.',
            mrkdwn_in: ['text']
          }
        ]
      });   
})
});

controller.hears(greetingMessages, ['direct_message'], function(bot, message) {
     bot.reply(message, {
      text: `Hey <@${message.user}>.`,
      attachments: [
        {
          text: "[Hint:] type `help` to know more about what I can do...",
          color: '#9999ff',
          mrkdwn_in: ['text']
        }
      ]
    });
    
});

controller.hears('help','direct_message',function(bot,message){
         bot.reply(message, {
      text: "You can try one of the following..",
      attachments: [
        {
          text: "Type `Book Beach today 3 PM to 4 PM` to book `Beach` for `3 PM to 4 PM`",
          color: '#36a64f',
          mrkdwn_in: ['text']
        },
        {
          text: "Type `My Events` to see your events",
          color: '#9999ff',
          mrkdwn_in: ['text']
        }
      ]
    });
});


controller.hears('Book','direct_message', function(bot, message){
  var user = `<@${message.user}>`;
  console.log(user);
    bookingService.createEvent("Beach","Standup","Informa","2017-07-10T04:30:00Z","2017-07-10T04:45:00Z",user)
     .then((data) => {
         bot.reply(message,{
             text:"Room Booked Successfully"
         });
     });
  
});
