import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, specificUser, findUser } from '../../db/db.js';
import { isText } from '../validation.js';

export const registerUser = async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!isText(username) || !isText(password)) {
    return res.status(400).json({ error: 'Fyll i namn och lösenord' });
  }
  try {
    const user = await register(username, password);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte skapa ny användare' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!isText(username) || !isText(password)) {
      return res.status(400).json({ error: 'Fyll i namn och lösenord' });
    }

    const user = await findUser(username);
    const isValid = user && (await bcrypt.compare(password, user.password));

    if (!isValid) {
      res.status(401).json({ error: 'Kunde inte authentisera användaren' });
    }

    const payload = { id: user.id, username: user.username };

    const token = jwt.sign(payload, 'password', {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte logga in användare' });
  }
};

export const getUser = async (req, res) => {
  try {
    const userData = await specificUser(req.user.id);
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde hämta användare' });
  }
};
