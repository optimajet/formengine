const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS to allow cross-origin requests
app.use(cors());

// Folder to store uploaded files
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  // Create the folder if it doesn't exist
  fs.mkdirSync(uploadFolder, {recursive: true});
}

// Configure Multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({storage});

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    // Respond with success if the file is uploaded
    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}` // File's accessible path
    });
  } else {
    // Respond with an error if the upload fails
    res.status(400).json({
      success: false,
      message: 'Error during file upload'
    });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadFolder));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
