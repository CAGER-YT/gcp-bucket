const { Storage } = require('@google-cloud/storage');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const privateKeyString =  '';
const clientEmail = '';
const getAuthenticatedStorageClient = async () => {
  const auth = new GoogleAuth({
    credentials: {
      private_key: privateKeyString,  // Directly use the private key string
      client_email: clientEmail,  // Use the service account email
  },
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const authClient = await auth.getClient();
  const storage = new Storage({ authClient });
  return storage;
};

const uploadToGCP = async (fileBuffer, filename) => {
  const storage = await getAuthenticatedStorageClient();
  const bucket = storage.bucket('sk-test-file');
  const file = bucket.file(`documents/${filename}`);
  await file.save(fileBuffer);
  return file.publicUrl();
};

module.exports = { uploadToGCP };
