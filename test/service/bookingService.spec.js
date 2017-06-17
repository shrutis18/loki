var chai = require("chai");
expect = chai.expect;
assert = chai.assert;
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

var mock = new MockAdapter(axios);


var BookingService = require('../../src/service/booking-service');

describe('BookingService', () => {
  var roomName = "Beach";
  var title = "standup";
  var description = "informa";
  var startsAt = new Date("2017-07-10T08:30:00Z");
  var endsAt = new Date("2017-07-10T09:30:00Z");
  var createdBy = "vsingh@equalexperts.com";

  var event = {
    "roomName": roomName,
    "title": title,
    "description": description,
    "startsAt": startsAt,
    "endsAt": endsAt,
    "createdBy": createdBy
  }
  var bookingService;

  before(() => {

    bookingService = new BookingService();

    mock.onPost('http://localhost:3000/events').reply(200, {
      event
    });

  })


  it('should be able to create an event', function (done) {

    bookingService.createEvent(roomName, title, description, startsAt, endsAt, createdBy)
      .then((response) => {
        expect(response.status).to.equal(200);
        //TODO more asserts
      })
      .catch((error) => {
        assert.fail(error)
      })
      .finally(() => done())
  });

});