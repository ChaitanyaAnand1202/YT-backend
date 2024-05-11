import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber : {  // one who is subscribing
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  channel : {  // one to whom the subscriber subscribes
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},
{
  timestamps: true
})

export const Subscription = new mongoose.model("Subscription", subscriptionSchema);

