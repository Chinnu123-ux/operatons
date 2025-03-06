import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    axios.get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Add or update user
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`${API_URL}/${editingId}`, { name })
        .then((response) => {
          setUsers(users.map((user) => (user.id === editingId ? response.data : user)));
          setEditingId(null);
          setName('');
        });
    } else {
      axios.post(API_URL, { name })
        .then((response) => {
          setUsers([...users, { ...response.data, id: users.length + 1 }]); // Mocking new ID
          setName('');
        });
    }
  };

  // Delete user
  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
  };

  return (
    <div className="App">
      <h1>CRUD Platform with JSONPlaceholder</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} User</button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
