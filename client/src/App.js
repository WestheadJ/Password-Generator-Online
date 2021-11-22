import axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  InputGroup,
  Container,
  Modal,
  S,
} from "react-bootstrap";
import "dotenv";
import "./app.css";
require("dotenv").config();

const authKey = process.env.auth;

function App() {
  const [salt, setSalt] = useState();
  const [key, setKey] = useState();
  const [phrase, setPhrase] = useState("");
  const [password, setPassword] = useState("");

  const [tempSalt, setTempSalt] = useState("");
  const [tempKey, setTempKey] = useState("");
  const [error, setError] = useState(true);

  const [editModalActive, setEditModalActive] = useState(false);
  const [keyModalActive, setKeyModalActive] = useState(false);
  const [saltModalActive, setSaltModalActive] = useState(false);

  function getSalt() {
    const value = localStorage.getItem("salt");
    return setSalt(value);
  }

  function getKey() {
    const value = localStorage.getItem("key");
    return setKey(value);
  }

  function getSettings() {
    getSalt();
    getKey();
  }

  function ifNoKey() {
    if (localStorage.getItem("key") === null) {
      return createKey();
    }
  }

  function ifNoSalt() {
    if (localStorage.getItem("salt") === null) {
      return createSalt();
    }
  }

  function getIfEmpty() {
    ifNoKey();
    ifNoSalt();
  }

  function generate() {
    const auth = authKey;
    axios
      .get("https://password-online.herokuapp.com/generate", {
        params: { auth, phrase, salt, key },
      })
      .then(result => {
        setPassword(result.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function createKey() {
    const auth = authKey;
    axios
      .get("https://password-online.herokuapp.com/create_key", {
        params: { auth },
      })
      .then(result => {
        if (result.data === "Incorrect Authentication") {
          alert("Incorrect Authentication");
        } else {
          localStorage.setItem("key", result.data);
          setKey(result.data);
        }
      });
  }

  function createSalt() {
    const auth = authKey;
    axios
      .get("https://password-online.herokuapp.com/create_salt", {
        params: { auth },
      })
      .then(result => {
        if (result.data === "Incorrect Authentication") {
          alert("Incorrect Authentication");
        } else {
          localStorage.setItem("salt", result.data);
          setSalt(result.data);
        }
      });
  }

  function copy(item) {
    navigator.clipboard.writeText(item);
  }

  function refresh() {
    getSettings();
    getIfEmpty();
  }

  function saveEdits() {
    setKey(tempKey);
    setSalt(tempSalt);
    hideEditModal();
  }

  function closeEdits() {
    setTempKey("");
    setTempSalt("");
    hideEditModal();
  }

  function showEditModal() {
    setEditModalActive(true);
  }

  function hideEditModal() {
    setEditModalActive(false);
  }

  function showKeyModal() {
    setKeyModalActive(true);
  }

  function hideKeyModal() {
    setKeyModalActive(false);
  }

  function showSaltModal() {
    setSaltModalActive(true);
  }

  function hideSaltModal() {
    setSaltModalActive(false);
  }

  function clearStorage() {
    localStorage.clear();
    getSettings();
  }

  function deleteKey() {
    localStorage.removeItem("key");
    setKey("");
  }

  function deleteSalt() {
    localStorage.removeItem("salt");
    setSalt("");
  }

  useEffect(() => {
    getSettings();
    getIfEmpty();
  }, []);

  return (
    <div
      style={{
        margin: "auto",
        width: "100%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container style={{ justifyContent: "center ", alignItems: "center", width:"400px", }}>
        <Row>
          <Col>
            <input
              id="input"
              style={{
                borderTopStyle: "none",
                borderColor: error && "#EF467F",
                marginTop: "15px",
              }}
              onChange={e => {
                setPhrase(e.target.value);
                if (e.target.value === "") {
                  return setError(true);
                } else {
                  return setError(false);
                }
              }}
              placeholder="Phrase"
            />
          </Col>

          <Col>
            <Button
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
              onClick={generate}
            >
              Generate
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "10px",
                paddingBottom: "10px",
                marginRight: "10px",
                marginLeft: "10px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
              onClick={() => {
                copy(password);
              }}
            >
              Copy to clipboard
            </Button>
          </Col>

          <Col>
            <InputGroup
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "10px",
                paddingBottom: "10px",
                marginRight: "10px",
                marginLeft: "10px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
              className="sm-3"
            >
              <DropdownButton
                style={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  marginRight: "10px",
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
                variant="outline-secondary"
                title="Advanced Settings"
                id="input-group-dropdown-1"
              >
                <Dropdown.Item onClick={createSalt}>
                  Create New Salt
                </Dropdown.Item>
                <Dropdown.Item onClick={createKey}>
                  Create New Key
                </Dropdown.Item>
                <Dropdown.Item onClick={refresh}>
                  Refresh Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={clearStorage}>
                  Delete Key & Salt
                </Dropdown.Item>
                <Dropdown.Item onClick={showKeyModal}>
                  Key Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={showSaltModal}>
                  Salt Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={showEditModal}>
                  Key & Salt Edits
                </Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </Col>
        </Row>
      </Container>
      <p>Password: {password}</p>

      {/* Edit Modal */}
      <Modal show={editModalActive} onHide={hideEditModal}>
        <Modal.Header closeButton>Change Salt Or Key</Modal.Header>
        <Modal.Body>
          <div>
            <label>Salt:</label>
            <input
              onChange={e => {
                setTempSalt(e.target.value);
              }}
              type="text"
            />
            <p>New Salt: {tempSalt}</p>
          </div>
          <div>
            <label>Key:</label>
            <input
              onChange={e => {
                setTempKey(e.target.value);
              }}
              type="text"
            />
            <p>New Key:{tempKey}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEdits}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEdits}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Key Modal */}
      <Modal show={keyModalActive} onHide={hideKeyModal}>
        <Modal.Header closeButton>Key Settings</Modal.Header>
        <Modal.Body>
          <p className="overflow-auto">Key: {key}</p>
          <Row>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={createKey}
              >
                Create New Key
              </Button>
            </Col>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={() => {
                  copy(key);
                }}
              >
                Copy Key
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={showEditModal}
              >
                Edit Key
              </Button>
            </Col>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                variant="primary"
                onClick={deleteKey}
              >
                Delete Key
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Salt Modal */}
      <Modal show={saltModalActive} onHide={hideSaltModal}>
        <Modal.Header closeButton>Salt Settings</Modal.Header>
        <Modal.Body>
          <p className="overflow-auto">Salt: {salt}</p>
          <Row>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={createSalt}
              >
                Create New Salt
              </Button>
            </Col>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={() => {
                  copy(salt);
                }}
              >
                Copy Salt
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={showEditModal}
              >
                Edit Salt
              </Button>
            </Col>
            <Col>
              <Button
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                variant="primary"
                onClick={deleteSalt}
              >
                Delete Salt
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <div
        id="howToUse"
        style={{ textAlign: "center", margin: "auto" }}
      >
        <h3>How to use?</h3>

        <p>This is a password generator and generator only. </p>
        <p>
          You get a salt and key, make note of these somewhere but make sure
          they aren't seen by anyone. These are used in the password generation
          if they are found out check out
          <a href="#advancedSettings "> this section</a>.
        </p>
        <p>
          First insert a phrase in the phrase box for example the application
          you will use like snapchat. And store this phrase in your password
          manager with the key and salt or in safe place.
        </p>
        <p>
          Then secondly click generate and you get your password, if it doesn't
          show up straight away give it a minute or 2 and the server will start
          up or your network speeds are slow. Then you can click copy to
          clipboard for copying and pasting.
        </p>

        <h3 id="advancedSettings">Advanced Settings?</h3>

        <p>There are advanced settings for change things with the generator.</p>
        <p>
          1. For example if you are going to use a different device it will load
          a new Salt & Key so you can either input a Salt & Key from another
          device.
        </p>
        <p>
          2. Delete your current Salt & Key and generate new ones, or you can
          delete just the Key or Salt.
        </p>
        <p>3. Generate a new Key or generate a new Salt on it's own</p>
      </div>
    </div>
  );
}

export default App;
