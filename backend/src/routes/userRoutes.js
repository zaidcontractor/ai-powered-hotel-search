import express from "express";
import admin from "../services/firebase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: userRecord });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    res.status(200).json({ users: listUsersResult.users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().deleteUser(uid);
    res
      .status(200)
      .json({ message: `User with UID ${uid} deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;
