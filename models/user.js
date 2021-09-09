var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {type: String, required: true, minLength: 0, maxLength: 100},
        password: {type: String, required: true, minLength: 8,maxLength:100},
        played_games: {type: Number},
        wins: {type: Number},
        winsTimeArray: [Number],
        avgWinTime: {type: Number},
        losses: {type: Number},
        token: {type: String},
        deleteToken: {type: String}
    }
);

//Virtual for user's URL
UserSchema.virtual('url').get(function(){
    return '/api/stats/' +this.username;
});

module.exports = mongoose.model('User',UserSchema);