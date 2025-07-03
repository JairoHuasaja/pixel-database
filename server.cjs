const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI);

// Esquema de usuario
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

// Registro
app.post('/signup', async (req, res) => {
  try {
 const { email, password } = req.body;
 const hash = await bcrypt.hash(password, 10);
 await User.create({ email, password: hash });
 res.json({ success: true });
  } catch (err) {
 res.status(400).json({ error: 'El usuario ya existe' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json({ success: true });
});

app.listen(4000, () => console.log('Servidor backend en http://localhost:4000'));