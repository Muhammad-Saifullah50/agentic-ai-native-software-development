import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  // Log component mount/unmount
  useEffect(() => {
    console.log('Footer mounted');
    return () => {
      console.log('Footer unmounted');
    };
  }, []);

  return (
    <footer className="bg-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="mb-3 text-primary">Book References</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-secondary">Chapter 1: AI-Native Principles</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Chapter 5: Spec-Driven Development</a></li>
              {/* Add more book references dynamically */}
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3 text-primary">Quick Tips</h5>
            <ul className="list-unstyled">
              <li><span className="text-secondary">Use natural language to edit the graph.</span></li>
              <li><span className="text-secondary">Click on nodes for detailed explanations.</span></li>
              {/* Add more quick tips dynamically */}
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3 text-primary">AI-Generated Notes</h5>
            <p className="text-muted">
              "Remember to always define clear success criteria before generating your workflow."
            </p>
            {/* Add more AI-generated notes dynamically */}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center text-muted">
            &copy; {new Date().getFullYear()} AI-Native Software Development. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
