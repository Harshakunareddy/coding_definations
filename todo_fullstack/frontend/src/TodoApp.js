// 1. todo see it once 

// 2. api call one see once fetch , axios => 9:10
// 3. nextjs run it and cmds write in a note pad file on the laptop + bootstrap file 
// 	also => 9:20
// 4. basic normal css 3 blocks practise for hands on only => 9:30
// 5. all reactjs things revise once on the reactjs folder => upto 10 
// 6. js codes see once upto 10:30 

import { useState } from 'react';
import {
  Container, Row, Col, Navbar, Nav, Button,
  Card, Form, Table, Badge, Spinner, Modal,
  Alert, Toast, ToastContainer, Pagination, Accordion
} from 'react-bootstrap';

function TodoApp() {
  // ── State ──────────────────────────────────────────
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React Bootstrap', priority: 'High', done: false },
    { id: 2, text: 'Build a Todo App', priority: 'Medium', done: false },
    { id: 3, text: 'Deploy to production', priority: 'Low', done: false },
  ]);

  const [input, setInput]           = useState('');
  const [priority, setPriority]     = useState('Medium');
  const [loading, setLoading]       = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [showAlert, setShowAlert]   = useState(false);
  const [alertMsg, setAlertMsg]     = useState('');
  const [alertType, setAlertType]   = useState('success');
  const [showToast, setShowToast]   = useState(false);
  const [toastMsg, setToastMsg]     = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  const totalPages   = Math.ceil(todos.length / itemsPerPage);
  const startIndex   = (currentPage - 1) * itemsPerPage;
  const currentTodos = todos.slice(startIndex, startIndex + itemsPerPage);

  // ── Helpers ────────────────────────────────────────
  const notify = (msg, type = 'success') => {
    setToastMsg(msg);
    setShowToast(true);
    setAlertMsg(msg);
    setAlertType(type);
    setShowAlert(true);
  };

  const priorityColor = (p) =>
    p === 'High' ? 'danger' : p === 'Medium' ? 'warning' : 'success';

  const completedCount = todos.filter(t => t.done).length;
  const pendingCount   = todos.length - completedCount;

  // ── Actions ────────────────────────────────────────
  const handleAdd = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const newTodo = { id: Date.now(), text: input, priority, done: false };
      setTodos([...todos, newTodo]);
      setInput('');
      setLoading(false);
      notify('Todo added successfully!', 'success');
      setCurrentPage(Math.ceil((todos.length + 1) / itemsPerPage));
    }, 800);
  };

  const handleToggle = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    setTodos(todos.filter(t => t.id !== deleteId));
    setShowModal(false);
    notify('Todo deleted!', 'danger');
    if (currentPage > Math.ceil((todos.length - 1) / itemsPerPage)) {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
  };

  // ── UI ─────────────────────────────────────────────
  return (
    <>
      {/* ── LESSON 6: Navbar ── */}
      <Navbar bg="dark" variant="dark" expand="md" sticky="top">
        <Container>
          <Navbar.Brand href="#">
            <strong>TodoApp</strong>{' '}
            <Badge bg="primary" pill>{todos.length}</Badge>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="nav" />
          <Navbar.Collapse id="nav">
            <Nav className="me-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
            </Nav>
            <Badge bg="success" className="me-2">{completedCount} Done</Badge>
            <Badge bg="danger">{pendingCount} Pending</Badge>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">

        {/* ── LESSON 7: Alert ── */}
        {showAlert && (
          <Alert
            variant={alertType}
            dismissible
            onClose={() => setShowAlert(false)}
            className="mb-3"
          >
            {alertMsg}
          </Alert>
        )}

        {/* ── LESSON 2: Row & Col ── */}
        <Row className="mb-4 g-3">

          {/* Stats Cards - LESSON 4 */}
          <Col xs={12} md={4}>
            <Card bg="primary" text="white" className="text-center">
              <Card.Body>
                <Card.Title className="fs-1 fw-bold">{todos.length}</Card.Title>
                <Card.Text>Total Todos</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card bg="success" text="white" className="text-center">
              <Card.Body>
                <Card.Title className="fs-1 fw-bold">{completedCount}</Card.Title>
                <Card.Text>Completed</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card bg="danger" text="white" className="text-center">
              <Card.Body>
                <Card.Title className="fs-1 fw-bold">{pendingCount}</Card.Title>
                <Card.Text>Pending</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">

          {/* ── Left Column: Add Todo + Accordion ── */}
          <Col xs={12} md={4}>

            {/* LESSON 5: Form inside Card */}
            <Card className="mb-4">
              <Card.Header className="fw-bold">Add New Todo</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Task</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your task..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </Form.Select>
                  </Form.Group>

                  {/* LESSON 3 + 10: Button with Spinner */}
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Adding...
                      </>
                    ) : 'Add Todo'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* LESSON 11: Accordion */}
            <Accordion flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>How to use</Accordion.Header>
                <Accordion.Body className="text-muted small">
                  Type a task, choose priority, and click Add Todo or press Enter.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Priority guide</Accordion.Header>
                <Accordion.Body className="small">
                  <Badge bg="danger" className="me-1">High</Badge> Urgent tasks<br />
                  <Badge bg="warning" text="dark" className="me-1 mt-1">Medium</Badge> Normal tasks<br />
                  <Badge bg="success" className="me-1 mt-1">Low</Badge> Whenever possible
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>

          {/* ── Right Column: Table + Pagination ── */}
          <Col xs={12} md={8}>
            <Card>
              <Card.Header className="fw-bold">
                My Todos{' '}
                <Badge bg="secondary">{todos.length} total</Badge>
              </Card.Header>
              <Card.Body>

                {todos.length === 0 ? (
                  <Alert variant="info">No todos yet. Add one!</Alert>
                ) : (
                  <>
                    {/* LESSON 9: Table */}
                    <Table striped bordered hover responsive className="mb-3">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Task</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTodos.map((todo, index) => (
                          <tr key={todo.id} className={todo.done ? 'table-secondary' : ''}>
                            <td>{startIndex + index + 1}</td>
                            <td className={todo.done ? 'text-decoration-line-through text-muted' : ''}>
                              {todo.text}
                            </td>
                            <td>
                              {/* LESSON 10: Badge */}
                              <Badge bg={priorityColor(todo.priority)} pill>
                                {todo.priority}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={todo.done ? 'success' : 'warning'} text={todo.done ? 'white' : 'dark'}>
                                {todo.done ? 'Done' : 'Pending'}
                              </Badge>
                            </td>
                            <td>
                              {/* LESSON 3: Buttons */}
                              <Button
                                size="sm"
                                variant={todo.done ? 'outline-secondary' : 'outline-success'}
                                className="me-1"
                                onClick={() => handleToggle(todo.id)}
                              >
                                {todo.done ? 'Undo' : 'Done'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => confirmDelete(todo.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    {/* LESSON 13: Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Page {currentPage} of {totalPages}
                        </small>
                        <Pagination size="sm" className="mb-0">
                          <Pagination.Prev
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 1}
                          />
                          {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                              key={i + 1}
                              active={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </Pagination.Item>
                          ))}
                          <Pagination.Next
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage === totalPages}
                          />
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ── LESSON 8: Modal (delete confirm) ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this todo? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* ── LESSON 12: Toast ── */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={alertType}
        >
          <Toast.Header>
            <strong className="me-auto">TodoApp</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default TodoApp;
