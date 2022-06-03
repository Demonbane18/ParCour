const User = require('../models/user');

const nameCheck =  async(id, name) => {
    await User.exists({
        _id: {
            '$ne': id
        }, name:name
    }, 
    (err, result) => {
        if (result) {
            return true
        } else {
            return false
        }
    }
);
}
const phoneCheck =  async(id, phone) => {
    await User.exists({
        _id: {
            '$ne': id
        }, phone:phone
    }, 
    (err, result) => {
        if (result) {
            return true
        } else {
            return false
        }
    }
);
}


   //    check if name exists

module.exports = {
    nameCheck,
    phoneCheck
};
 