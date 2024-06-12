module.exports = {
  secretKey: "12345-67890-09876-54321",
  mongoUrl: "mongodb://127.0.0.1:27017/ConFusion",
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || "705698308430888",
    clientSecret:
      process.env.FACEBOOK_CLIENT_SECRET || "174a46be8573e9bce42a064a46d69ce3",
  },
};
