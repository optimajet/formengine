# Welcome to the File Uploader Server!

This project is a simple Node.js server built with `express`, `multer`, and `cors` to handle file uploads and serve static files.

## 📖 Features

- Handles file uploads with unique filenames to avoid overwriting.
- Serves uploaded files for download via a static endpoint.
- Uses `cors` to allow cross-origin requests.

## Installation

1. Navigate to the project directory:
   ```file-upload-server```
2. Install dependencies:
   ```npm install```

## Development

Run the server:

```
npm run start
```

By default, the server runs on http://localhost:3001. You can upload files via the `/upload` endpoint and access uploaded files via
the `/uploads` endpoint.

## Endpoints

### Upload Files

**POST** `/upload`

- Accepts a single file in the `file` field of the request.
- Returns the uploaded file's public path on success.

Example Response:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "filePath": "/uploads/<filename>"
}
```

### Access Uploaded Files

**GET** `/uploads/<filename>`

- Serves static files from the `uploads` directory.

You can now use the server to handle file uploads and serve them to clients.

### 📦 Use Example

You can integrate the uploader server using the **Uploader** component.  
For detailed documentation, refer to
the [Uploader Documentation](https://formengine.io/documentation/components-library/fields-components/uploader).

1. **Set the Action URL:**  
   In the component's `Action URL` property, provide the URL to your server's upload endpoint.  
   Example: http://localhost:3001/upload

2. **Upload Workflow:**  
   The component will send the file to the server via the specified `Action URL`.

![Uploader Example](./static/uploader-example.png)
