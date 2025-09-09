import Event from "../models/event.model.js";

// Crear evento
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      uid: req.user.uid
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar eventos del usuario
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ uid: req.user.uid });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({ _id: id, uid: req.user.uid });
    if (!event) return res.status(404).json({ message: "Event not found" });

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Borrar evento
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOneAndDelete({ _id: id, uid: req.user.uid });
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};