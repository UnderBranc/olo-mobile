import logo from './logo2.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import axios from "axios";

function App() {

  const [bin_id, setBinId] = useState("")
  const [notification_id, setNotificationId] = useState(0)
  const inputFile = useRef(null)
  const [notificationOk, setNotificationOk] = useState(Boolean)
  const [photoUploaded, setPhotoUploaded] = useState(Boolean)
  const [responseMsg, setResponseMsg] = useState("")

  const [binInfo, setBinInfo] = useState({})
  useEffect(() => {

    let x = window.location.pathname.split("/")[2]

    setBinId(x)

    let url = 'http://20.105.168.42/api/frontend/notify/' + x
    const options = { method: 'GET', url: url };
    axios.request(options).then(function (response) {
      setNotificationId(response.data['id'])
      setResponseMsg(response.data['message'])

    }).catch(function (error) {
      setResponseMsg("OMG, Errorik.")
    });

    url = 'http://20.105.168.42/api/dashboard/bins/' + x
    const options2 = { method: 'GET', url: url };
    axios.request(options2).then(function (response) {
      setBinInfo(response.data)
      setNotificationOk(true)
    }).catch(function (error) {
      setResponseMsg("OMG, Errorik.")
    });
  }, []);


  const handleFileSelected = (e) => {
    const files = e.target.files[0]
    const form = new FormData();
    form.append("file", files);
    axios.post(
      'http://20.105.168.42/api/frontend/notify/' + notification_id + '/image',
      form,
      {
        headers: {
          "Content-type": "multipart/form-data"
        },
      }
    )
      .then((res) => {
        console.log("image done.")
        console.log(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        {!notificationOk ? (
          <div>
            <p>
              Thanks for notifying us!
            </p>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        ) :
          (
            <div>
              <p>
                Thanks for notifying us!
              </p>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Garbage Bin additional info.
              </p>
              <div style={{ 'margin': '5%' }}>
                <p>
                  Bin id : <code>{bin_id}</code>
                </p>
                <ListGroup>
                  <ListGroup.Item><b>Last pickup : </b>23.10.2021</ListGroup.Item>
                  <ListGroup.Item><b>Location : </b>{binInfo[0]['city_part']}, {binInfo[0]['street']} {binInfo[0]['orientation_number']}</ListGroup.Item>
                  <ListGroup.Item><b>Garbage type : </b>{binInfo[0]['waste_type']}</ListGroup.Item>
                  <ListGroup.Item><b>Bin type : </b>{binInfo[0]['material']}</ListGroup.Item>
                </ListGroup>
              </div>

              <div>
                <p><b>Help us</b></p>
                <p>Take a picture of the bin.</p>
                <input type='file' id='file' onChange={e => handleFileSelected(e)} ref={inputFile} style={{ display: 'none' }} />
                <Button onClick={() => inputFile.current.click()} variant="success">Upload</Button>{' '}
              </div>
            </div>
          )
        }
      </header>
    </div>
  );
}

export default App;
