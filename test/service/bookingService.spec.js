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
  };
  var roomName ="beach";
  var user = "shruti";
  var startsAt = "2017-07-10T08:30:00Z";
  var bookingService;

  before(() => {

    bookingService = new BookingService();

    mock.onPost('http://localhost:3000/events').reply(200, {
      event
    });

    mock.onGet('http://localhost:3000/rooms').reply(200);

    mock.onGet(`http://localhost:3000/room/${roomName}`).reply(200);

    mock.onGet(`http://localhost:3000/room/${roomName}/events`).reply(200);

    mock.onGet(`http://localhost:3000/events/${user}`).reply(200);

    mock.onDelete(`http://localhost:3000/user/${user}/events/startingTime/${startsAt}`).reply(200);

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

  it('should be able to get rooms', function (done) {

    bookingService.getRooms()
      .then((response) => {
        expect(response.status).to.equal(200);
        //TODO more asserts
      })
      .catch((error) => {
        assert.fail(error)
      })
      .finally(() => done())
  });

   it('should be able to get valid room', function (done) {

    bookingService.getRoom(roomName)
      .then((response) => {
        expect(response.status).to.equal(200);
        //TODO more asserts
      })
      .catch((error) => {
        assert.fail(error)
      })
      .finally(() => done())
  });

  it('should be able to get events for a room', function (done) {

    bookingService.getRoomEvents(roomName)
      .then((response) => {
        expect(response.status).to.equal(200);
        //TODO more asserts
      })
      .catch((error) => {
        assert.fail(error)
      })
      .finally(() => done())
  });

  it('should be able to get events for a particular user', function (done) {

    bookingService.getMyEvents(user)
      .then((response) => {
        expect(response.status).to.equal(200);
        //TODO more asserts
      })
      .catch((error) => {
        assert.fail(error)
      })
      .finally(() => done())
  });

  it('should be able to delete events for a particular user w.r.t starting time', function (done) {

    bookingService.deleteEvent(user,startsAt)
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