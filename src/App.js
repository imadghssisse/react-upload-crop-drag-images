import { useState } from "react";
import ImageUploader from "./package/src/index.ts";
function App() {
  const [pictures, setPictures] = useState([]);
  const onDrop = (pictureFiles, pictureDataURLs) => {
    setPictures(pictureFiles)
  }
  return (
    <div className="App">
      hell
      <ImageUploader
        withIcon={true}
        buttonText='Choose images'
        onChange={onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
        withPreview={true}
        crop={true}
        isSortable={true}
      />
    </div>
  );
}

export default App;
