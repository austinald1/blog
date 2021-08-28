const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const userSchema = new Schema(
    {
        username: {
        type: String,
        required: true,
        trim: true,
        unique: true
        },
        email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/,'email address is not valid!']
        },
        createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
        },
        thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
        ],
        friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Friend'
        }
        ]
    },
    {
        toJSON: {
        virtuals: true,
        getters: true
        },
        // prevents virtuals from creating duplicate of _id as `id`
        id: false
    }
    );

    // get total count of comments and replies on retrieval
    userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
