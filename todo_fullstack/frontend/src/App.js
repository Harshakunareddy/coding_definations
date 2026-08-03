import { Container, Row, Col, Button, Card, Form, Navbar, 
    Nav, Alert, Modal , Table, Badge, Spinner } from 'react-bootstrap';

const App = () => {

    const users = [
        { id: 1, name: 'John', email: 'john@email.com', status: 'Active' },
        { id: 2, name: 'Sarah', email: 'sarah@email.com', status: 'Inactive' },
        { id: 3, name: 'Mike', email: 'mike@email.com', status: 'Active' },
        { id: 4, name: 'Lisa', email: 'lisa@email.com', status: 'Pending' },
    ];


    return (
        <>
            <Container>
                <h1>Hello</h1>
                <p>This is centered and responsive</p>
            </Container>

            <Container>
                <Row>
                    <Col style={{  background:'lightblue', padding:'10px' }}>One</Col>
                    <Col style={{  background:'lightgreen', padding:'10px' }}>Two</Col>
                    <Col style={{  background:'lightyellow', padding:'10px' }}>Three</Col>
                </Row>

                <Row className='mt-3'>
                    <Col xs={12} md={8} lg={8}>8/12</Col>
                    <Col md={4}>4/12</Col>
                </Row>
            </Container>

            <Container className='mt-4'>
                <Row className='mb-3'>
                    <h1>Solid Buttons</h1>
                    <Col>
                        <Button variant='primary'>Primary</Button>
                        <Button variant='success'>success</Button>
                        <Button variant='danger'>danger</Button>
                        <Button variant='warning'>warning</Button>
                        <Button variant='info'>info</Button>
                        <Button variant='dark'>dark</Button>
                    </Col>
                </Row>

                <Row className='mb-3'>
                    <h1>Outline Buttons</h1>
                    <Col>
                        <Button variant='outline-primary'>Primary</Button>{' '}
                        <Button variant='outline-danger'>Danger</Button>{' '}
                        <Button variant='outline-success'>Success</Button>
                    </Col>
                </Row>
                
                <Row className='mb-3'>
                    <h1>Button Sizes</h1>
                    <Col>
                        <Button variant='primary' size='sm'>Small</Button>{'  '}
                        <Button variant='primary'>Normal</Button>{'  '}
                        <Button variant='primary' size='lg'>Small</Button>{'  '}
                    </Col>
                </Row>

                <Row>
                    <h1>Disabled and block</h1>
                    <Col>
                        <Button variant='primary' disabled>Disabled Btn</Button>{'  '}
                        <Button variant='success' className='w-100 mt-2'>Disabled Btn</Button>
                    </Col>
                </Row>
            </Container>

            <Container>
                <h1>Cards</h1>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>This is a simple Card</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} md={4} className='mb-4'>
                        <Card bg="dark" text='white'>
                            <Card.Header>Card Header</Card.Header>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>This is a simple Card</Card.Text>    
                            </Card.Body>
                            <Card.Footer>Card Footer</Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>


            <Container className='mt-4'>
                <h1>Forms in React bootstrap</h1>
                <Row>
                    <Col xs={12} md={6} className='mb-3'>
                        <Card>
                            <Card.Body>
                                <Card.Title>Login Form</Card.Title>
                                <Form>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Email : </Form.Label>
                                        <Form.Control type='email' placeholder='Enter Email' />
                                    </Form.Group>

                                    <Form.Group className='mb-3'>
                                        <Form.Label>Password : </Form.Label>
                                        <Form.Control type='password' placeholder='Enter Password' />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Check type='checkbox' label="Remember Password" />
                                        <Form.Check type='radio' label="Radio" name='gender' />
                                        <Form.Check type='radio' label="Femake" name='gender' />
                                    </Form.Group>
                                    
                                    <Button variant='primary'>Login</Button>
                                </Form>

                                <Form>
                                    <Form.Group>
                                        <Form.Label>Select Dropdown</Form.Label>
                                        <Form.Select>
                                            <option>Select Country</option>
                                            <option>India</option>
                                            <option>China</option>
                                            <option>Nepal</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>

                                <Form.Control as='textarea' rows={3} placeholder='Type Here' />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>


            <Container>
                <Navbar bg='dark' variant='dark' expand='md' sticky='top'>
                    <Navbar.Brand href="#">Brand Name</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar' />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href='#'>Home</Nav.Link>
                            <Nav.Link href='#'>About</Nav.Link>
                            <Nav.Link href='#'>Contact</Nav.Link>
                        </Nav>
                        <Button variant='outline-light'>Login</Button>
                    </Navbar.Collapse>
                </Navbar>
            </Container>

            <Container className='mt-6'>
                <h1>Alerts</h1>
                <Alert variant='success'>Sucess Alert!</Alert>
                <Alert variant='danger'>Danger Alert!</Alert>
                <Alert variant='warning'>Warning Alert!</Alert>
                <Alert variant='info'>Info Alert!</Alert>

                <Alert variant='primary'>
                    <Alert.Heading>Well Done!</Alert.Heading>
                    <Alert.Link href='#'>LogOut</Alert.Link>
                    <p className='mb-0'>Hmm Nice Bro!!!!!</p>
                </Alert>

                {/* <Alert dismissible onClose={() => setShow(false)}>
                    X Btn press for closing the alert
                </Alert> */}
            </Container>


            <Container>
                <Modal show={show} onHide={() => setShow(true)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Hello Namaste Bossu!!</Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => setShow(true)}>Cancel</Button>
                        <Button onClick={() => setShow(true)}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </Container>

            <Container className='mt-4'>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                {/* <td>{user.Status}</td> */}
                                <td>
                                    <Badge bg={
                                        user.status === 'Active' ? 'success' : user.status === 'Inavtive' ? 'danger' : 'warning'
                                    }>
                                        {user.status}
                                    </Badge>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default App;