import Settings from "../Models/settings.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.userId });
    if (!settings) {
      settings = new Settings({ entryBy: "User", userId: req.user.userId });
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  const { entryBy } = req.body;
  try {
    const settings = await Settings.findOneAndUpdate({ userId: req.user.userId }, { entryBy }, { new: true, upsert: true });
    res.status(200).json(settings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
