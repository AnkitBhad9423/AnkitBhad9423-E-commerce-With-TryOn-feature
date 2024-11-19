import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../css_files/tryOn.css";
import LoadingSpinner from "../components/LoadingSpinner";

const TryOn = () => {
  const { state } = useLocation();
  const { garment } = state;

  const [userImage, setUserImage] = useState(null); // File for the image the user uploads
  const [garmentImage] = useState(garment.link); // Garment image image passed from state
  const [outputImage, setOutputImage] = useState(null); // Output image URL from backend
  const [description, setDescription] = useState(""); // User description
  const [isfetch, setIsFetch] = useState(false);

  // Handle file upload for the user image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUserImage(file); // Set the local URL for preview
    console.log(userImage);
  };

  // Handle description input
  // const handleDescriptionChange = (e) => {
  //   setDescription(e.target.value);
  // };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userImage) {
      alert("Please upload an image of yourself.");
      return;
    }
    setIsFetch(true);

    const formData = new FormData();
    formData.append("userImage", userImage); // Upload the actual file
    formData.append("garmentImage", garmentImage); // You can keep the garment image URL or pass its file if needed
    // formData.append("description", description); // Additional description
    try {
      const response = await fetch("http://localhost:5000/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }
      setIsFetch(false);
      const result = await response.json();
      console.log("Response from backend:", result);
      setOutputImage(result.image_url);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="try-on-page">
      <div className="inner-div">
        <h1 className="title">Try-on {garment.item_name}</h1>

        <div className="image-container">
          <div className="image-box">
            <h3>Garment Image</h3>
            <img
              src={garment.link}
              alt={garment.item_name}
              className="display-image"
            />
          </div>

          <div className="image-box">
            <h3>Uploaded Image</h3>
            {userImage ? (
              <img
                src={URL.createObjectURL(userImage)} // Create a preview
                alt="User upload"
                className="display-image"
              />
            ) : (
              <p>No image uploaded</p>
            )}
            <input
              type="file"
              id="userImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-input"
            />
          </div>

          <div className="image-box">
            <h3>Output Image</h3>

            {outputImage ? (
              <img
                src={outputImage.image.url}
                alt="Try-on result"
                className="display-image"
              />
            ) : isfetch ? (
              <LoadingSpinner />
            ) : (
              <p>No result yet</p>
            )}
          </div>
        </div>
        <p>
          For better experience upload a vertical image, in which you at some
          distance away from camera and make sure only you are in the frame.
        </p>
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TryOn;
