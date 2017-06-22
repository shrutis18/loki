var Botkit = require('botkit');
var moment = require('moment');


const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;

const greetingMessages = require('./src/help/greeting-messages');
var BookingService = require('./src/service/booking-service');
var DateTimeUtil = require('./src/utils/date-time-util');
var NameUtil = require('./src/utils/name-util');

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

  bot.startPrivateConversation({
    user: user
  }, function (response, convo) {
    convo.say({
      text: `Hello <@${user}> :wave:`,
      attachments: [{
        title: 'I cannot talk on public channels. But I\'m all ears out here :simple_smile:',
        text: 'Type `help` to learn more about me.',
        mrkdwn_in: ['text']
      }]
    });
  })
});

controller.hears(greetingMessages, ['direct_message'], function (bot, message) {
  bot.reply(message, {
    text: `Hey <@${message.user}>.`,
    attachments: [{
      text: "[Hint:] type `help` to know more about what I can do...",
      color: '#9999ff',
      mrkdwn_in: ['text']
    }]
  });

});

controller.hears('help', 'direct_message', function (bot, message) {
  bot.reply(message, {
    text: "You can try one of the following..",
    attachments: [{
        text: "Type `get rooms` to check existing rooms",
        color: '#36a64f',
        mrkdwn_in: ['text']
      },
      {
        text: "Type `Book Beach mm-dd hh:mm PM/AM to  mm-dd hh:mm PM/AM` to book `Beach` for `3 PM to 4 PM`",
        color: '#36a64f',
        mrkdwn_in: ['text']
      },
      {
        text: "Type `My Events` to see your events",
        color: '#9999ff',
        mrkdwn_in: ['text']
      },
      {
        text: "Type `get events for [RoomName]` to get Room Events",
        color: '#36a64f',
        mrkdwn_in: ['text']
      },
      {
        text: "Type `delete [mm-dd hh:mm PM/AM] eg: delete 11-6 3:30PM` to delete your Event",
        color: '#36a64f',
        mrkdwn_in: ['text']
      }
    ]
  });
});


controller.hears('get rooms' || 'Get Rooms', 'direct_message', function (bot, message) {
  bookingService.getRooms()
    .then((rooms) => {
      bot.reply(message, {
        text: `Rooms for this Office are :`,
        attachments: [{
            text: rooms.data[0].roomName,
            color: '#36a64f',
            mrkdwn_in: ['text']
          },
          {
            text: rooms.data[1].roomName,
            color: '#36a64f',
            mrkdwn_in: ['text']
          },
          {
            text: rooms.data[2].roomName,
            color: '#36a64f',
            mrkdwn_in: ['text']
          },
          {
            text: rooms.data[3].roomName,
            color: '#36a64f',
            mrkdwn_in: ['text']
          }

        ]
      })
    })
    .catch((error) => {
      bot.reply(message, {
        text: "Failed to Fetch Rooms"
      })
    })
});


controller.hears('Book' || 'book', 'direct_message', function (bot, message) {
  var inputText = message.text;
  var user;
  var startsAt;
  var endsAt;
  var roomName;
  var roomNameMatch = false;
  var pattern = /(book)[\s]+(\w)+([\s]room)?[\s]+(for|today|tomorrow|(0?[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))[\s]+(at[\s]+(([0-1]?[0-9]:?([0-5]?[0-9])?)(\s*)(a|p)m)(\s*)for[\s]+([1-9][0-9]?(\.[1-9])?[\s]+(hours|hrs|hour|hr|minutes|mins))|([1-9][0-9]?(\.[1-9])?[\s]+(hours|hrs|hour|hr|minutes|mins)))/ig;
  if (pattern.test(inputText)) {
    var dateTimeUtil = new DateTimeUtil(inputText);
    var nameUtil = new NameUtil(inputText);
    startsAt = dateTimeUtil.startsAt;
    endsAt = dateTimeUtil.endsAt;
    var roomName = nameUtil.roomName.toLowerCase();
    if (dateTimeUtil.isValidDate()) {
      bot.api.users.info({
        user: message.user
      }, function (err, info) {
        if (info) {
          user = info.user.name;
          bookingService.getRooms()
            .then((rooms) => {
              for (var i = 0; i < rooms.data.length; i++) {
                if (rooms.data[i].roomName.match(roomName)) {
                  roomNameMatch = true;
                  bookingService.createEvent(roomName, "Standup", "", new Date(startsAt), new Date(endsAt), user)
                    .then((data) => {
                      bot.reply(message, {
                        text: data.data
                      });
                    })
                    .catch(error => {
                      bot.reply(message, {
                        text: error.data
                      });
                    })
                  break;
                }
              }
              if (roomNameMatch == false) {
                bot.reply(message, {
                  text: "please provide the correct roomName"
                });
              }
            })
        }
      })
    } else {
      bot.reply(message, {
        text: "Invalid Date"
      })
    }
  } else {
    bot.reply(message, {
      text: "`Oops!!` I Didn't get you. You can always type `Help` if you are lost"
    });
  }
});

controller.hears('My Events' || 'my events', 'direct_message', function (bot, message) {
  var user;
  bot.api.users.info({
    user: message.user
  }, function (err, info) {
    if (info) {
      user = info.user.name;
      bookingService.getMyEvents(user)
        .then((events) => {
          if (typeof (events.data) == "string") {
            bot.reply(message, {
              text: events.data
            });
          } else {
            var fields = [];
            for (var i = 0; i < events.data.length; i++) {
              fields.push({
                "title": `${events.data[i].title} AT ${events.data[i].roomName}`,
                "value": `${events.data[i].startsAt} to ${events.data[i].endsAt}`,
                "short": true
              })
            }

            bot.reply(message, {
              text: "Your Events",
              attachments: [{
                "text": "Events",
                "fields": fields
              }]
            })
          }
        })
        .catch(() => {
          bot.reply(message, {
            text: "Failed to get my events"
          })
        })
    }
  })
});

controller.hears('get events for' || 'Get Events For', 'direct_message', function (bot, message) {
  var inputText = message.text;
  var roomNameElements = inputText.split(/\s+/).slice(3);
  var roomName = roomNameElements[1] ? (roomNameElements[0].concat(" " + roomNameElements[1])) : roomNameElements[0];
  bookingService.getRoomEvents(roomName)
    .then((events) => {
      if (typeof (events.data) == "string") {
        bot.reply(message, {
          text: events.data
        });
      } else {
        var fields = [];
        for (var i = 0; i < events.data.length; i++) {
          fields.push({
            "title": `${events.data[i].title}`,
            "value": `${events.data[i].startsAt} to ${events.data[i].endsAt}`,
            "short": true
          })
        }

        bot.reply(message, {
          text: `Events for ${roomName}`,
          attachments: [{
            "text": "Events",
            "fields": fields
          }]
        })
      }
    })
    .catch(() => {
      bot.reply(message, {
        text: "Failed to get room events"
      })
    })
});

controller.hears('delete', 'direct_message', function (bot, message) {
  var inputText = message.text;
  var user;
  var startsAt;
  var endsAt;
  var pattern = /(delete)[\s]+(0?[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(\s)(([0-1]?[0-9]:?([0-5]?[0-9])?)(\s*)(a|p)m)/ig;
  if (pattern.test(inputText)) {

    var dateTimeUtil = new DateTimeUtil(inputText);
    startsAt = dateTimeUtil.startsAt;

    bot.api.users.info({
      user: message.user
    }, function (err, info) {
      if (info) {
        user = info.user.name;
        bookingService.deleteEvent(user, startsAt)
          .then((event) => {
            bot.reply(message, {
              text: event.data
            });
          })
          .catch(error => {
            bot.reply(message, {
              text: "Unable To Delete event"
            });
          })
      }
    })
  } else {
    bot.reply(message, {
      text: "`Oops!!` I Didn't get you. You can always type `Help` if you are lost"
    });
  }
});