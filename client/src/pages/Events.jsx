import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { useAuth } from '../context/authcontext.jsx';
import '../styles/events.css';

Modal.setAppElement('#root');

export default function Events() {
	const { user } = useAuth();
	const [events, setEvents] = useState([]);
	const [friends, setFriends] = useState([]);
	const [selectedFriend, setSelectedFriend] = useState(null);

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const pastelColors = ['#ffd6a5', '#caffbf', '#9bf6ff', '#ffadad', '#bdb2ff'];
	const [color, setColor] = useState(pastelColors[0]);
	const [sharedWith, setSharedWith] = useState([]); // IDs de amigos con los que compartes
	const [newFriendEmail, setNewFriendEmail] = useState('');


	useEffect(() => {
		if (!user) return;
		const fetchFriends = async () => {
			try {
				const token = await user.getIdToken();
				const res = await fetch('http://localhost:4000/api/friends', {
					headers: { Authorization: 'Bearer ' + token }
				});
				const data = await res.json();
				setFriends(data); // data = [{id, email}, ...]
			} catch (err) {
				console.error('Error cargando amigos:', err);
			}
		};
		fetchFriends();
	}, [user]);

	
	useEffect(() => {
		if (!user) return;
		const fetchEvents = async () => {
			try {
				const token = await user.getIdToken();
				let url = 'http://localhost:4000/api/events';
				if (selectedFriend) url += `?userId=${selectedFriend}`;
				const res = await fetch(url, {
					headers: { Authorization: `Bearer ${token}` }
				});
				const data = await res.json();
				setEvents(data);
			} catch (err) {
				console.error('Error cargando eventos:', err);
			}
		};
		fetchEvents();
	}, [user, selectedFriend]);

	
	const handleAddFriend = async () => {
		if (!newFriendEmail) return alert('Escribe un email');

		try {
			const token = await user.getIdToken();
			const res = await fetch('http://localhost:4000/api/friends', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ friendEmail: newFriendEmail })
			});

			if (!res.ok) {
				const errorData = await res.json();
				return alert(errorData.error || 'Error añadiendo amigo');
			}

			const addedFriend = await res.json();
			setFriends(prev => [
				...prev,
				{ id: addedFriend.friend, email: newFriendEmail }
			]);
			setNewFriendEmail('');
		} catch (err) {
			console.error('Error añadiendo amigo:', err);
		}
	};

	const handleDateClick = info => {
		setSelectedDate(info.dateStr);
		setSelectedEvent(null);
		setTitle('');
		setDescription('');
		setColor(pastelColors[Math.floor(Math.random() * pastelColors.length)]);
		setSharedWith([]);
		setModalOpen(true);
	};

	const handleEventClick = info => {
		const e = events.find(ev => ev._id === info.event.id);
		if (!e) return;
		setSelectedEvent(e);
		setSelectedDate(e.date);
		setTitle(e.title);
		setDescription(e.description || '');
		setColor(e.color);
		setSharedWith(e.sharedWith || []);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedEvent(null);
		setSelectedDate(null);
		setSharedWith([]);
	};

	const handleSave = async e => {
		e?.preventDefault();
		if (!title) {
			alert('El título es obligatorio');
			return;
		}
		if (!selectedEvent && !selectedDate) {
			alert('Debes seleccionar una fecha');
			return;
		}
		if (!user) {
			console.error('Usuario no autenticado');
			return;
		}

		try {
			const token = await user.getIdToken();
			if (selectedEvent) {
				const res = await fetch(
					`http://localhost:4000/api/events/${selectedEvent._id}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify({ title, description, color, sharedWith })
					}
				);
				const updatedEvent = await res.json();
				setEvents(prev =>
					prev.map(e => (e._id === updatedEvent._id ? updatedEvent : e))
				);
			} else {
				const res = await fetch('http://localhost:4000/api/events', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						title,
						description,
						date: selectedDate,
						color,
						sharedWith
					})
				});
				const newEvent = await res.json();
				setEvents(prev => [...prev, newEvent]);
			}
			closeModal();
		} catch (err) {
			console.error('Error guardando evento:', err);
		}
	};

	const handleDelete = async () => {
		if (!selectedEvent) return;
		if (!confirm('¿Estás seguro que quieres borrar este evento?')) return;
		if (!user) {
			console.error('Usuario no autenticado');
			return;
		}

		try {
			const token = await user.getIdToken();
			await fetch(`http://localhost:4000/api/events/${selectedEvent._id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` }
			});
			setEvents(prev => prev.filter(e => e._id !== selectedEvent._id));
			closeModal();
		} catch (err) {
			console.error('Error borrando evento:', err);
		}
	};

	const renderEventContent = eventInfo => (
		<div
			style={{
				backgroundColor: eventInfo.event.backgroundColor,
				borderRadius: '6px',
				padding: '2px 4px',
				marginBottom: '2px',
				fontSize: '0.75rem',
				color: '#333',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap'
			}}
			title={eventInfo.event.title}
		>
			{eventInfo.event.title}
		</div>
	);

	return (
		<div className='events-container'>
			<h1>Calendario de {user?.email}</h1>

			{}
			<div style={{ marginBottom: '1rem' }}>
				<h4>Añadir amigo</h4>
				<input
					type='email'
					placeholder='Email del amigo'
					value={newFriendEmail}
					onChange={e => setNewFriendEmail(e.target.value)}
					style={{
						padding: '0.5rem',
						borderRadius: '6px',
						marginRight: '0.5rem'
					}}
				/>
				<button
					onClick={handleAddFriend}
					style={{
						padding: '0.5rem 1rem',
						borderRadius: '6px',
						backgroundColor: '#4dabf7',
						color: 'white',
						border: 'none',
						cursor: 'pointer'
					}}
				>
					Añadir
				</button>
			</div>

			{}
			<select
				value={selectedFriend || ''}
				onChange={e => setSelectedFriend(e.target.value)}
				style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '6px' }}
			>
				<option value=''>Mi calendario</option>
				{friends.map(f => (
					<option key={f.id} value={f.id}>
						{f.email}
					</option>
				))}
			</select>

			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView='dayGridMonth'
				events={events.map(e => ({
					id: e._id.toString(),
					title: e.title,
					start: e.date,
					color: e.owner === user.uid ? e.color : '#ccc'
				}))}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
				editable={true}
				selectable={true}
				eventContent={renderEventContent}
			/>

			<Modal
				isOpen={modalOpen}
				onRequestClose={closeModal}
				style={{
					overlay: { backgroundColor: 'rgba(0,0,0,0.3)' },
					content: {
						maxWidth: '400px',
						margin: 'auto',
						borderRadius: '12px',
						padding: '1.5rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.5rem'
					}
				}}
			>
				<h2>{selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}</h2>
				<input
					type='text'
					placeholder='Título'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<textarea
					placeholder='Descripción'
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<input
					type='color'
					value={color}
					onChange={e => setColor(e.target.value)}
				/>

				{}
				<div>
					<h4>Compartir con:</h4>
					{friends.map(f => (
						<label key={f.id} style={{ display: 'block' }}>
							<input
								type='checkbox'
								checked={sharedWith.includes(f.id)}
								onChange={ev => {
									if (ev.target.checked) {
										setSharedWith(prev => [...prev, f.id]);
									} else {
										setSharedWith(prev => prev.filter(id => id !== f.id));
									}
								}}
							/>
							{f.email}
						</label>
					))}
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '1rem'
					}}
				>
					{selectedEvent && (
						<button
							onClick={handleDelete}
							style={{
								backgroundColor: '#ff6b6b',
								color: 'white',
								border: 'none',
								padding: '0.5rem 1rem',
								borderRadius: '6px',
								cursor: 'pointer'
							}}
						>
							Borrar
						</button>
					)}
					<button
						onClick={handleSave}
						style={{
							backgroundColor: '#4dabf7',
							color: 'white',
							border: 'none',
							padding: '0.5rem 1rem',
							borderRadius: '6px',
							cursor: 'pointer'
						}}
					>
						Guardar
					</button>
				</div>
			</Modal>
		</div>
	);
}
