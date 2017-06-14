var axios = require('axios'),
Promise = require('bluebird');

function BookingService(){
    const url = 'http://localhost:3000';

    function createEvent(roomName, title, description, startsAt, endsAt, createdBy){
        return new Promise((resolve, reject) => {
            axios.post(`${url}/events`,{
                roomName : roomName,
                title : title,
                description : description,
                startsAt : startsAt,
                endsAt : endsAt,
                createdBy : createdBy
            })
                .then(data => resolve(data))
                .catch(error => reject(error))
        });
    }
    return{
        createEvent:createEvent
    }

}
module.exports = BookingService;