const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");


const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("❌ No se encontró serviceAccountKey.json. Crea la clave privada desde Firebase.");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authenticate };