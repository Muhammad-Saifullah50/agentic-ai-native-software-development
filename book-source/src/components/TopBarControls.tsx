import React, { useEffect } from 'react';
import { Navbar, Nav, NavDropdown, ButtonGroup, Button } from 'react-bootstrap';
import { FaSave, FaFolderOpen, FaFileExport, FaQuestionCircle, FaEdit, FaQuestion, FaPlay } from 'react-icons/fa';

type PanelMode = 'explanation' | 'quiz' | 'simulation';

interface TopBarControlsProps {
  onModeChange: (mode: PanelMode) => void;
  currentMode: PanelMode;
}

const TopBarControls: React.FC<TopBarControlsProps> = ({ onModeChange, currentMode }) => {
  // Log component mount/unmount
  useEffect(() => {
    console.log('TopBarControls mounted');
    return () => {
      console.log('TopBarControls unmounted');
    };
  }, []);

  // Log prop changes
  useEffect(() => {
    console.log('TopBarControls currentMode changed to:', currentMode);
  }, [currentMode]);

  const handleModeButtonClick = (mode: PanelMode) => {
    console.log('Mode button clicked:', mode);
    onModeChange(mode);
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Navbar.Brand href="#home">AI-Native Playground</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#save">
            <FaSave /> Save
          </Nav.Link>
          <Nav.Link href="#load">
            <FaFolderOpen /> Load
          </Nav.Link>
          <NavDropdown title={<><FaFileExport /> Export</>} id="basic-nav-dropdown">
            <NavDropdown.Item href="#export-png">PNG</NavDropdown.Item>
            <NavDropdown.Item href="#export-json">JSON</NavDropdown.Item>
          </NavDropdown>
        </Nav>
                <ButtonGroup aria-label="Mode Switcher" className="me-2">
                  <Button
                    variant={currentMode === 'explanation' ? 'dark' : 'outline-secondary'}
                    title="Explanation Mode"
                    onClick={() => handleModeButtonClick('explanation')}
                  >
                    <FaEdit /> Explanation
                  </Button>
                  <Button
                    variant={currentMode === 'quiz' ? 'dark' : 'outline-secondary'}
                    title="Quiz Mode"
                    onClick={() => handleModeButtonClick('quiz')}
                  >
                    <FaQuestion /> Quiz
                  </Button>
                  <Button
                    variant={currentMode === 'simulation' ? 'dark' : 'outline-secondary'}
                    title="Simulation Mode"
                    onClick={() => handleModeButtonClick('simulation')}
                  >
                    <FaPlay /> Simulate
                  </Button>
                </ButtonGroup>        <Nav>
          <Nav.Link href="#help">
            <FaQuestionCircle /> Help
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopBarControls;
