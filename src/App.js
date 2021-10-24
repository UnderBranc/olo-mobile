import logo from './logo2.svg';
import check from './checkmark.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner'

function App() {

  const [bin_id, setBinId] = useState("")
  const [notification_id, setNotificationId] = useState(0)
  const inputFile = useRef(null)
  const [notificationOk, setNotificationOk] = useState(Boolean)
  const [photoUploaded, setPhotoUploaded] = useState(Boolean)
  const [responseMsg, setResponseMsg] = useState("")
  const [photoError, setPhotoError] = useState(Boolean)
  const [binInfo, setBinInfo] = useState({})
  const [errorId, setErrorId] = useState(Boolean)
  const [uploading, setUploading] = useState(Boolean)
  useEffect(() => {

    let x = window.location.pathname.split("/")[2]

    setBinId(x)

    let url = 'http://20.105.168.42/api/frontend/notify/' + x
    const options = { method: 'GET', url: url };
    axios.request(options).then(function (response) {
      setNotificationId(response.data['id'])
      setResponseMsg(response.data['message'])
      if (response.status != 200) {
        console.log("ti som")
        setErrorId(true)
      } else {
        url = 'http://20.105.168.42/api/dashboard/bins/' + x
        const options2 = { method: 'GET', url: url };
        axios.request(options2).then(function (response) {
          setBinInfo(response.data)
          setNotificationOk(true)
        }).catch(function (error) {
          setErrorId(true)
          setResponseMsg("OMG, Errorik.")
        });

      }
    }).catch(function (error) {
      setErrorId(true)
      setResponseMsg("OMG, Errorik.")
    });

  }, []);


  const handleFileSelected = (e) => {
    const files = e.target.files[0]
    const form = new FormData();
    form.append("file", files);
    setUploading(true)
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
        setPhotoUploaded(true)
        setUploading(false)
        setPhotoError(false)
      })
      .catch(err => {
        setPhotoError(true)
        setUploading(false)
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        {errorId ? (
          <div>
            <p>
              This bin ID is not valid.
            </p>
            <p>
              Try scanning the QR code again.
            </p>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        ) : (
          photoUploaded || uploading ? (

            uploading ? (

              <div>
                <p>
                  <b>Uploading photo...</b>
                </p>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <div>
                <p>
                  <b>Thank you for notifiying us!</b>
                </p>
                <p>
                  You have positively impacted the enviroment.
                </p>
                <img src={check} className="App-logo" alt="logo" />
              </div>
            )

          ) : (
            !notificationOk ? (
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
                      Bin id: <code>{bin_id}</code>
                    </p>
                    <ListGroup>
                      <ListGroup.Item><b>Last pickup: </b>23.10.2021</ListGroup.Item>
                      <ListGroup.Item><b>Location: </b>{binInfo[0]['city_part']}, {binInfo[0]['street']} {binInfo[0]['orientation_number']}</ListGroup.Item>
                      <ListGroup.Item><b>Garbage type: </b>{binInfo[0]['waste_type']}</ListGroup.Item>
                      <ListGroup.Item><b>Bin type: </b>{binInfo[0]['material']}</ListGroup.Item>
                    </ListGroup>
                  </div>

                  {photoUploaded ?
                    (
                      photoError ? (
                        <div>
                          <p><b>Error with photo.</b></p>
                        </div>
                      ) : (
                        <div>
                          <p><b>Thanks for your photo.</b></p>
                        </div>
                      )

                    ) : (
                      <div>
                        <p><b>Help us</b></p>
                        <p>Take a picture of the bin.</p>
                        <input accept="image/*" capture="environment" type='file' id='file' onChange={e => handleFileSelected(e)} ref={inputFile} style={{ display: 'none' }} />
                        <Button onClick={() => inputFile.current.click()} variant="success">Upload</Button>{' '}
                      </div>
                    )}
                </div>
              )
          )
        )}

      </header >
    </div >
  );
}

export default App;
