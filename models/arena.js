var mongoose = require('mongoose')
var Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator')
var deepPopulate = require('mongoose-deep-populate')(mongoose)

var schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'Users'},
  invite: {type: Schema.Types.ObjectId, ref: 'Users'},
  status_accept: {type: Boolean},
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  user_played: {type: Boolean, default: false},
  invite_played: {type: Boolean, default: false},
  awardPlayerOne: {type: Boolean, default: false},
  awardPlayerTwo: {type: Boolean, default: false},
  userOneSendNotification: {
    userId: {
      type: Schema.Types.ObjectId, ref: 'Users'
    },
    send: {type: Boolean, default: false}
  },
  userTwoSendNotification: {
    userId: {
      type: Schema.Types.ObjectId, ref: 'Users'
    },
    send: {type: Boolean, default: false}
  },
  userOneSeeNotification: {
    userId: {
      type: Schema.Types.ObjectId, ref: 'Users'
    },
    seenArena: {type: Boolean, default: false}
  },
  userTwoSeeNotification: {
    userId: {
      type: Schema.Types.ObjectId, ref: 'Users'
    },
    seenArena: {type: Boolean, default: false}
  },
  questionsAnswered: {
    user: {
      questionNumber: {type: Schema.Types.ObjectId, ref: 'ArenaQuestion'}
    },
    invite:{
      questionNumber: {type: Schema.Types.ObjectId, ref: 'ArenaQuestion'}
    }

  }

})

schema.index({invite: 1, user: 1}, {unique: true})
schema.plugin(deepPopulate)
schema.plugin(uniqueValidator, {type: 'mongoose-unique-validator'})
module.exports = mongoose.model('Arena', schema)