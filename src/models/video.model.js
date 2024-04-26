import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
  videoFile: {
    type: String,         // cloudinary URL
    required: true,
    unique: true
  },
  thumbnail: {
    type: String,         // cloudinary URL
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,         // given by cloudinary
    required: true
  },
  views: {
    type: Number,         // given by cloudinary
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},
{
  timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);