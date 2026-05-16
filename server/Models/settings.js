import mongoose from "mongoose";

const settingsSchema = mongoose.Schema({
  entryBy: { type: String, default: "Jibran" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
