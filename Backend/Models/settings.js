import mongoose from "mongoose";

const settingsSchema = mongoose.Schema({
  entryBy: { type: String, default: "Jibran" },
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
