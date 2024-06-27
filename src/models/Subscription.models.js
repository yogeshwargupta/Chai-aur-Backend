import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //jo subcribe kr rha h
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, //jisko subcribe kiya jaa rha h
        ref: "User"
    },

}, {timestamps: true})

export const Subscription = mongooseAggregatePaginate.model("Subscription", subscriptionSchema)