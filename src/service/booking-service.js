var axios = require('axios'),
  Promise = require('bluebird');

function BookingService() {
  var url = 'http://localhost:3000';

  function createEvent(roomName, title, description, startsAt, endsAt, createdBy) {
    var event = {
      "roomName": roomName,
      "title": title,
      "description": description,
      "startsAt": startsAt,
      "endsAt": endsAt,
      "createdBy": createdBy
    }
    return new Promise((resolve, reject) => {
      axios.post(`${url}/events`, event)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  function getRooms(){
    return new Promise((resolve,reject) => {
      axios.get(`${url}/rooms`)
        .then((rooms) =>{
          resolve(rooms);
        })
        .catch((error) => {
          reject(error)
        })
    });
  }
  function getMyEvents(user){
      return new Promise((resolve,reject) =>{
          axios.get(`${url}/events/${user}`)
            .then((events) => {
                resolve(events)
            })
            .catch((error) => {
                reject(error)
            })
      });
  }

  return {
    createEvent: createEvent,
    getMyEvents: getMyEvents,
    getRooms: getRooms
  }

}
module.exports = BookingService;