// const { Storage } = require("@google-cloud/storage");

// const storage = new Storage({
//     keyFilename: "path-to-your-gcp-service-account-key.json", // Update with your GCP key file
//     projectId: "your-project-id", // Update with your GCP project ID
// });

// const bucketName = "your-bucket-name"; // Update with your bucket name
// const bucket = storage.bucket(bucketName);

// module.exports = { bucket };

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  credentials: {
    client_email: "", // Replace with your service account's client email
    private_key:  ""// Replace with your private key
  },
  projectId: "citric-cubist-443302-n0", // Replace with your Google Cloud Project ID
});

const bucketName = "sk-test-file"; // Replace with your bucket name
const bucket = storage.bucket(bucketName);

module.exports = { bucket };
