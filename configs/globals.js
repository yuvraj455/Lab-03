require("dotenv").config();
// Global configurations object contains Application Level variables such as:
// client secrets, passwords, connection strings, and misc flags
const configurations = {
  ConnectionStrings: {
    MongoDB: "mongodb+srv://jindalyuvraj4:Ramram74@cluster0.k5iom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  },
  Authentication: {
    Google: {
      ClientId: "300397430099-qg9fjpuuof8oi0mi10ujdo57hnnh6d6s.apps.googleusercontent.com",
      ClientSecret: "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",
      CallbackUrl: "http://localhost:3000/auth/google/callback"
    },
  },
};
module.exports = configurations;
