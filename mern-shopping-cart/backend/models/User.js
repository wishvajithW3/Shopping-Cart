import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const passkeySchema = new mongoose.Schema(
  {
    credentialID: {
      type: String,
      required: true,
    },
    credentialPublicKey: {
      type: String,
      required: true,
    },
    counter: {
      type: Number,
      default: 0,
    },
    transports: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    provider: {
      type: String,
      default: "local",
    },

    providerId: {
      type: String,
    },

    passkeys: {
      type: [passkeySchema],
      default: [],
    },

    currentChallenge: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;