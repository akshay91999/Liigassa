import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayer extends Document {
  fullname: string;
  dob: string;
  email: string;
  phone: string;
  position: string;
  place: string;
  image: string;
}

const PlayerSchema: Schema<IPlayer> = new Schema(
  {
    fullname: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    place: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Player: Model<IPlayer> =
  mongoose.models.Player || mongoose.model<IPlayer>("Player", PlayerSchema);

export default Player;
