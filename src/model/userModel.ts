import mongoose, { Schema, Model, model, Document } from "mongoose";

interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "pending";
  status: "Active" | "nonActive";
  profile: string;
  bio: string;
}

const userSchema: Schema<UserType> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["Active", "nonActive"],
      default: "Active",
    },
    profile: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userModel: Model<UserType> = mongoose.model<UserType>("user", userSchema);

export default userModel;
