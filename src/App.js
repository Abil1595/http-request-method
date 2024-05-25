
import { useEffect, useState } from 'react';
import './App.css';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,Container } from 'reactstrap';
import axios from 'axios'
function App() {
  const [users,setUsers]=useState([])
 
  const [username,setUsername]=useState('');  
  const [email,setEmail]=useState('');
  const [phone,setPhone]=useState('');
  const [editMode,setEditmode]=useState(false)
  const [modalOpen, setModalOpen] = useState(false);  
  const [editUserId,setEditUserId]=useState(null)   
  const toggleModal = () => setModalOpen(!modalOpen);
  useEffect(()=>{   
    axios.get("https://jsonplaceholder.typicode.com/users")
    .then(res=>setUsers(res.data))
  },[])
  const handleEdit = (userId) => {   
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {  
      setUsername(selectedUser.name);
      setEmail(selectedUser.email);
      setPhone(selectedUser.phone);
      setEditmode(true);
      setEditUserId(userId);
      toggleModal();
    }
  };
  const handleDelete=(userId)=>{
    axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then(() => {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    })
  }
  const createUser=()=>{
    axios.post(`https://jsonplaceholder.typicode.com/users`,{name:username,email:email,phone:phone})
    .then(res=>{
      setUsers([...users,res.data])
    })
  }
  const updateUser=(userId)=>{
    axios.put(`https://jsonplaceholder.typicode.com/users/${userId}`, { name: username, email: email, phone: phone })
    .then(res => {
      const updatedUsers = users.map(user => (user.id === userId ? res.data : user));
      setUsers(updatedUsers);
      
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (!username || !email || !phone) {
      alert('Please enter all fields.');
      return;
    }

  
    if (users.some(user => user.email === email && user.id !== editUserId)) {
      alert('Email already exists.');
      return;
    }


    if (editMode && editUserId) {
      updateUser(editUserId);
    } else {
      createUser();
    }
  };
  return (
    <div className="App">
      <Container>
      <div>
      <Button color="primary" onClick={toggleModal}>Create User</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {users.map(user => (
            <tr key={user.id}>
             <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Button color="success" onClick={() => handleEdit(user.id)}>Edit</Button>
                {' '}
                <Button color="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{editMode ? 'Edit User' : 'Create User'}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Name" />
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>  
          <Button color="secondary" >Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>{editMode ? 'Update' : 'Create'}</Button>
        </ModalFooter>
      </Modal>
    </div>
      </Container>
    </div>
  );
}

export default App;
