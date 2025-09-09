import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import { useAuth } from "../context/authcontext.jsx";
import "../styles/events.css";

Modal.setAppElement("#root"); // Para accesibilidad

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const pastelColors = ["#ffd6a5", "#caffbf", "#9bf6ff", "#ffadad", "#bdb2ff"];
  const [color, setColor] = useState(pastelColors[0]);

  // Cargar eventos del usuario
  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:3000/api/events", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, [user]);

  // Abrir modal para crear evento
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    setTitle("");
    setDescription("");
    setColor(pastelColors[Math.floor(Math.random() * pastelColors.length)]);
    setModalOpen(true);
  };

  // Abrir modal para ver/editar evento
  const handleEventClick = (info) => {
    const e = events.find((ev) => ev._id === info.event.id);
    if (!e) return;
    setSelectedEvent(e);
    setSelectedDate(e.date);
    setTitle(e.title);
    setDescription(e.description || "");
    setColor(e.color);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  // Guardar evento (crear o actualizar)
  const handleSave = async () => {
    const token = await user.getIdToken();
    if (!title) return;

    if (selectedEvent) {
      // Actualizar evento existente
      const res = await fetch(`http://localhost:3000/api/events/${selectedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, color }),
      });
      const updatedEvent = await res.json();
      setEvents((prev) => prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));
    } else {
      // Crear nuevo evento
      const res = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, date: selectedDate, color }),
      });
      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
    }
    closeModal();
  };

  // Borrar evento
  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (!confirm("¿Estás seguro que quieres borrar este evento?")) return;

    const token = await user.getIdToken();
    await fetch(`http://localhost:3000/api/events/${selectedEvent._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents((prev) => prev.filter((e) => e._id !== selectedEvent._id));
    closeModal();
  };

  // Mini-previsualización de eventos en cada día
  const renderEventContent = (eventInfo) => (
    <div
      style={{
        backgroundColor: eventInfo.event.backgroundColor,
        borderRadius: "6px",
        padding: "2px 4px",
        marginBottom: "2px",
        fontSize: "0.75rem",
        color: "#333",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={eventInfo.event.title}
    >
      {eventInfo.event.title}
    </div>
  );

  return (
    <div className="events-container">
      <h1>Calendario de {user?.email}</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((e) => ({ id: e._id, title: e.title, start: e.date, color: e.color }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        selectable={true}
        eventContent={renderEventContent}
      />

      {/* Modal de eventos */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.3)" },
          content: {
            maxWidth: "400px",
            margin: "auto",
            borderRadius: "12px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          },
        }}
      >
        <h2>{selectedEvent ? "Editar Evento" : "Nuevo Evento"}</h2>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          {selectedEvent && (
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Borrar
            </button>
          )}
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#4dabf7",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}