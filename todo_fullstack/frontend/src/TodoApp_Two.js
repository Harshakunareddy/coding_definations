import { Badge, Container, Navbar, Nav } from "react-bootstrap";

const TodoApp_Two = () => {
    return (
        <>
            <Navbar bg='dark' variant="dark" expand='md' sticky="top">
                <Container>
                    <Navbar.Brand href="#">
                        <strong>Todo App</strong>
                        <Badge pill>Harsha</Badge>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="nav" />
                    <Navbar.Collapse id='nav'>
                        <Nav.Link href='#'>Home</Nav.Link>
                        <Nav.Link href="#">About</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
export default TodoApp_Two;