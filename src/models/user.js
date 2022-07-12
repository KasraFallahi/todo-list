// imports
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

// user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value) { // username validator to check if has appropitate length
            if (value.length < 5) {
                throw new Error('Username must be more than 4 characters');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{ // JWT tokens
        token: {
            type: String
        }
    }]
});

// virtual task list model
userSchema.virtual('taskLists', {
    ref: 'TaskList',
    localField: '_id',
    foreignField: 'owner'
});

// jwt token generator method for user
userSchema.methods.authUser = async function () {
    const user = this;

    // generate token
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET);

    // assign token to that user
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// user schema middleware to hash the password
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        if (user.password.length < 5) throw new Error('Password must be more than 4 characters');

        // hash password here
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// a static user method to check the credentials
userSchema.statics.findByCredentials = async (username, password) => {

    const user = await User.findOne({ username });

    if (!user) throw new Error('User does not exist');

    // check whether the password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        return user;
    } else {
        throw new Error('Wrong credentials');
    }

}

// export user model
const User = mongoose.model('User', userSchema, 'User');
export default User;