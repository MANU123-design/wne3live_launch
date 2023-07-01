import mongoose from "mongoose";
import validator from 'validator';

const UserSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error('Invalid Email');
      }
    }

  },
  timestamp: 
  { 
    type: Date,
    default: Date.now 
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
