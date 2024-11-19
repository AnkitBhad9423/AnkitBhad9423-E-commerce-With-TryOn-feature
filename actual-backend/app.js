const express = require("express");
const multer = require("multer");
const axios = require("axios"); // For making HTTP requests
const cors = require("cors");
const { getStoredItems, storeItems } = require("./data/items");

const app = express();
app.use(cors());

app.use(express.json());
const upload = multer({ dest: "../vite-project/public/images" });

console.log("3");

app.get("/items", async (req, res) => {
  const storedItems = await getStoredItems();
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 4000));
  res.json({ items: storedItems });
});
console.log(" 4");

app.post(
  "/api/sendToPython",
  upload.fields([{ name: "userImage" }, { name: "garmentImage" }]),
  async (req, res) => {
    console.log("in backend");

    try {
      const userImage = req.files["userImage"][0]; // Get user image file info
      const garmentImage = req.files["garmentImage"][0]; // Get garment image file info

      const formData = new FormData();
      formData.append("userImage", userImage.buffer, userImage.originalname); // Send the buffer and original filename
      formData.append(
        "garmentImage",
        garmentImage.buffer,
        garmentImage.originalname
      ); // Send the buffer and original filename

      const response = await axios.post(
        "http://localhost:5001/api/process",
        formData,
        {
          headers: {
            ...formData.getHeaders,
          },
        }
      );
      result = res.json(response.data);
      console.log(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error processing image" });
    }

    console.log("--------------------------------------");
  }
);

app.get("/items/:id", async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});

app.post("/items", async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: "Stored new item.", item: newItem });
});

app.listen(8080, () => {
  console.log("Node.js backend listening to port 8080");
});
