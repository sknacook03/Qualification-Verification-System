const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes("Only .xlsx files are allowed")) {
    return res.status(400).json({ error: err.message });
  }
  console.error('Unhandled upload error:', err);
  return res.status(500).json({ error: 'Internal server error' });
};

export default handleUploadError;
