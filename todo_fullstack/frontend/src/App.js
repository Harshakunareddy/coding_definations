import { Container, Row, Col, Button, Card, Form, Navbar, 
    Nav, Alert, Modal , 
    Pagination,
    Table, Badge, Spinner, Accordion, Toast, ToastContainer } from 'react-bootstrap';

import { useState } from 'react';

const App = () => {

    const users = [
        { id: 1, name: 'John', email: 'john@email.com', status: 'Active' },
        { id: 2, name: 'Sarah', email: 'sarah@email.com', status: 'Inactive' },
        { id: 3, name: 'Mike', email: 'mike@email.com', status: 'Active' },
        { id: 4, name: 'Lisa', email: 'lisa@email.com', status: 'Pending' },
    ];

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showSuccess, setSuccess] = useState(false);


    const handleClick = () => {
        setLoading(true);
        setTimeout(()=>setLoading(false),2000);
    }

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

            <Container>
                <Badge pill bg='success' className='me-2'>Active</Badge>
                <Badge pill bg='danger' className='me-2'>Deleted</Badge>
                <Badge pill bg='warning' className='me-2'>Pending</Badge>
                <Badge pill bg='info' className='me-2'>New</Badge>
            </Container>

            
            <Container>
                <Spinner animation='border' variant='primary' className='me-2' />
                <Spinner animation='border' variant='success' className='me-2' />
                <Spinner animation='border' variant='danger' className='me-2' />
                <Spinner animation='border' variant='warning' className='me-2' />
                <Spinner animation='border' variant='info' className='me-2' />

                {/* small spinner */}
                <Spinner animation='border' size='sm' className='me-2' />
            </Container>

            <Container>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey='0'>
                        <Accordion.Header>What is React?</Accordion.Header>
                        <Accordion.Body>
                            React is a js library
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='1'>
                        <Accordion.Header>What is React 2 ?</Accordion.Header>
                        <Accordion.Body>
                            React is a js 2 library
                        </Accordion.Body>
                    </Accordion.Item>
                
                </Accordion>

                {/* <Accordion alwaysOpen></Accordion>  many open at a time*/} 

                  
                {/* Flush style - no borders, flat look
                <h4 className="mt-4">Flush Style (no borders)</h4>
                <Accordion flush></Accordion> */}

                <ToastContainer position='top-end' className='p-3'>
                    <Toast show={showSuccess} autohide delay={3000} bg='success'>
                        {/* bg="danger" */}
                        {/* bg="info" */}
                        <Toast.Header>
                            <strong>Success</strong>
                            <small>Just now</small>
                        </Toast.Header>
                        <Toast.Body>Item saved successfully!</Toast.Body>
                    </Toast>
                </ToastContainer>
                
            </Container>


            {/* <Container>
                <h1>pagination concept</h1>
                <Pagination>
                    <Pagination.First disabled={currentPage === 1} />
                    <Pagination.Prev disabled={currentPage === 1} />
                    <Pagination.Item
                        key={index + 1}
                        active="some js"
                    >
                        {index + 1}
                    </Pagination.Item>
                    <Pagination.Next disabled={currentPage === totalPages} />
                    <Pagination.Last disabled={currentPage === totalPages} />
                </Pagination>
            </Container> */}

            <Container>
                <h1>Utility Classes</h1>
                <div className='mt-4 p-3 bg-light'>harsha vardhan</div>
                <div className='mb-4 px-4 py-2 bg-light'>harsha vardhan</div>
                <div className='mx-auto p-4 py-2 bg-light border'>harsha vardhan</div>

                <h1>Text classes</h1>
                <p className='text-start'>text-start</p>
                <p className='text-center'>text-center</p>
                <p className='text-end'>text-end</p>
                <p className='text-uppercase'>text-uppercase</p>
                <p className='text-decoration-underline'>text-decoration-underline</p>
                
                <p className='fw-bold'>fw-bold</p>
                <p className='fst-italic'>italic font style</p>
                <p className='fs-1'>font style one</p>
                <p className='fs-6'>font style six</p>

                
                
                <h1>Colors</h1>
                <p className='text-primary'>Text primary</p>
                <p className='text-success'>Text success</p>
                <p className='text-danger'>Text danger</p>
                <p className='text-warning'>Text warning</p>
                <p className='text-muted'>Text muted</p>

                <span className='bg-primary text-dark'>bg-primary</span>
                <span className='bg-danger text-white'>bg-danger</span>
                <span className='bg-warning'>bg-warning</span>
                <span className='bg-success'>bg-success</span>

                <p className='fs-6 text-dark bg-primary fst-italic'>Display things</p>
                <div className='d-none d-md-block bg-info'>
                    Not on mobile, but on the desktop
                </div>
                <div className='d-block d-md-none bg-danger text-white'>
                    Not on desktop, but on the mobile
                </div>

                <div>Align items space between</div>
                <div className='d-flex justify-content-between border bg-light p-3 mb-2'>
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                </div>

                <div>Items centered</div>
                <div className='d-flex justify-content-center align-items-center border'
                    style={{ height: '80px' }} >
                        <span>Centered both ways</span>
                </div>

                <div className='d-flex gap-2 mb-2'>
                    <Button variant='primary'>One</Button>
                    <Button variant='danger'>Two</Button>
                    <Button variant='warning'>Three</Button>
                    <Button variant='info'>Info</Button>
                </div>

                <div>Borders and Rounded</div>

                {/* ======= 6. BORDERS & ROUNDED ======= */}
                <h4 className="mt-4">6. Borders & Rounded</h4>
                <Row className="g-3">
                    <Col xs={6} md={3}>
                    <div className="border p-3 text-center">border</div>
                    </Col>
                    <Col xs={6} md={3}>
                    <div className="border border-primary p-3 text-center">border-primary</div>
                    </Col>
                    <Col xs={6} md={3}>
                    <div className="border rounded p-3 text-center">rounded</div>
                    </Col>
                    <Col xs={6} md={3}>
                    <div className="border rounded-pill p-3 text-center">rounded-pill</div>
                    </Col>
                </Row>

                {/* ======= 7. WIDTH & HEIGHT ======= */}
                <h4 className="mt-4">7. Width</h4>
                <div className="w-25 bg-light border p-2 mb-1">w-25 (25%)</div>
                <div className="w-50 bg-light border p-2 mb-1">w-50 (50%)</div>
                <div className="w-75 bg-light border p-2 mb-1">w-75 (75%)</div>
                <div className="w-100 bg-light border p-2 mb-4">w-100 (100%)</div>

            </Container>
            

        </>
    )
}

export default App;