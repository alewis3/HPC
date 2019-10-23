var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
mongoose.set('useFindAndModify', false);

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    address: {
        streetAddress: String,
        city: String,
        state: {
            type: String, 
            minlength: 2,
            maxlength: 2
        },      
        zip: Number
    },
    accountType: {
        type: String,
        enum: ['Contributor', 'Homeowner', 'Business Owner', 'System Admin']
    },
    birthday: {
        type: String, 
        validate: {
            validator: function(b) {
                return /\d{2}\/\d{2}\/\d{4}/.test(b)
            },
            message: props => props.value + ' is not a valid birthday!'
        }
    },
    validated: Boolean,
    validationToken: String,
    blockedUsers: [{ type : Schema.Types.ObjectId, ref: 'User' }],
    blockedBy: [{ type : Schema.Types.ObjectId, ref: 'User' }],
    homeownerInfo: {
        required: false,
        meetingPlace: {   
            streetAddress: String,
            city: String,
            state: String,
            zip: Number
        },
        acceptedMaterials: String,
        isListingOn: Boolean,
        display_radius: Number,
    },
    businessOwnerInfo: {
        required: false,
        acceptedMaterials: String,
        isListingOn: Boolean,
        businessName: String,
        businessPhone:Number,
        businessWebsite: String,
        businessHours: {
            weekdayHours: String,
            weekendHours: String
        }
    },
    contributorInfo: {
        required: false,
        searchRadius: Number
    }
}, 
{
    timestamps: true
});

/*
 * A pre-save hook for hashing the pwd
 */
userSchema.pre('save', function(next) {
    if (this.isModified("password")) {
        var pw = this.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(pw, salt, (err, hash) => {
                if (err) throw err;
                this.password = hash;
                next();
            })
        })
    }
    else {
        next();
    }
});

/*
 * This method will return the list of users blocked by this user
 */
userSchema.methods.findBlockedUsers = function(cb) {
    return this.model('User').find({'_id': {$in: this.blockedUsers}}, cb);
};

/*
 * This method will return the list of users this user is blocked by
 */
userSchema.methods.findBlockedBy = function(cb) {
    return this.model('User').find({'_id': {$in: this.blockedBy}}, cb);
};

/*
 * This method will block a user by taking a user to block (blocked) and will
 * both add that user's _id to this user's blockedUsers array and add this user's
 * _id to the blocked users blockedBy list
 */
userSchema.methods.blockUser = function(blocked, cb) {
    var blockedUser = this.model('User').find({'_id': blocked._id}, cb);
    var blockedUsersSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {blockedUsers: {$addToSet: blockedUser._id}}}, function(err, doc) {
        if (err) return false;
        else return true;
    });
    var blockedBySet = this.model('User').findOneAndUpdate({'_id': {$eq: blockedUser._id}}, {$set: {blockedBy: {$addToSet: this._id}}}, function(err, doc) {
        if (err) return false;
        else return true;
    });
    if(blockedUsersSet && blockedBySet) return true;
    else return false;
};

/*
 * This method will set the homeowner info when it receives an 'info' object
 * that has the keys: isListingOn, acceptedMaterials, displayRadius, and meetingPlace 
 * with keys streetAddress, city, state, and zip, 
 * 
 */
userSchema.methods.addHomeownerInfo = function(info, cb) {
    var homeownerInfoSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {'homeownerInfo': info}}, cb);
    return homeownerInfoSet;
};

/*
 * This method will set the business owner info when it receives an 'info' object
 * that has the keys: isListingOn, businessName, businessPhone, businessWebsite, and
 * businessHours with keys weekdayHours and weekendHours.
 */
userSchema.methods.addBusinessOwnerInfo = function(info, cb) {
    var businessOwnerInfoSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {'businessOwnerInfo': info}}, cb);
    return businessOwnerInfoSet;
};

/*
 * This method will set the contributor info when it receives an 'info' object
 * with key searchRadius
 */
userSchema.methods.addContributorInfo = function(info, cb) {
    var contributerInfoSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {'contributorInfo': info}}, cb);
    return contributerInfoSet;
};

/*
 * This method will check if the current user's validation token 
 * matches the token given, and will update the validated field if so
 * and return true.
 */
userSchema.methods.validateUser = function(token, cb) {
    console.log("In function");
    console.log("Token to match: " + token);
    console.log("Matching to: " + this.validationToken);
    console.log("This user: " + this);
    if (this.validationToken == token) {
        console.log("Tokens matched");
        var o_id = new mongoose.Types.ObjectId(this._id);
        var user = this.model('User').findOneAndUpdate({'_id': o_id}, {$set: {'validated': true}}, cb);
        console.log("User updated")
        user.save();
        console.log("User saved");
        return true;
    }
    console.log("Returning false");
    return false;
    
};

userSchema.statics.findById = async function(userId, cb) {
    var o_id = new mongoose.Types.ObjectId(userId);
    try {
        let data = await this.find({'_id': o_id}, cb);
        return data;
    } catch (reject) {
        return reject;
    }
    
};


var userModel = mongoose.model('User', userSchema);

module.exports = userModel;