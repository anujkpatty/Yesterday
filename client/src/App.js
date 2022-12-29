import React, { useState } from "react";

import "./App.css";
import Axios from "axios";

function App() {
  const [name, setName] = useState();
  const [files, setFiles] = useState();
  const [image, setImage] = useState({src: '',
                                      hash: ''
                                    })
  const [gif, setGif] = useState({src: '',
                                  hash: ''
                                })

  const send = event => {
    const data = new FormData();
    data.append("name", name);

    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }
    console.log(data.images)
    

    Axios.post("http://localhost:3001/upload", data)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  const getImage = () => {

    setImage({
      src: 'http://localhost:3001/0/image',
      hash: Date.now()
    })
  }

  const getGif = () => {

    setGif({
      src: 'http://localhost:3001/gif',
      hash: Date.now()
    })
  }


  return (
    <div className="App">
      <header className="App-header">
        <form action="#">
          <div className="flex">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={event => {
                const { value } = event.target;
                setName(value);
              }}
            />
          </div>
          <div className="flex">
            <label htmlFor="file">Images</label>
            <input
              type="file"
              id="file"
              accept=".jpg"
              multiple
              onChange={event => {
                const files = event.target.files;
                setFiles(files);
              }}
            />
          </div>
        </form>
        <button onClick={send}>Send</button>
        <button onClick={getImage}>Display image</button>
        <div>
          <img src={`${image.src}?${image.hash}`} alt="" height={500}/>
        </div>
        <button onClick={getGif}>Display Gif</button>
        <div>
          <img src={`${gif.src}?${gif.hash}`} alt="" height={500}/>
        </div>
      </header>
    </div>
  );
}

export default App;