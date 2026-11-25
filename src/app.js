import express from 'express';
import path from 'node:path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { logger } from './middleware/logger.js';
import * as authorization from './middleware/authorization.js'
import { notFound, errorHandler } from './middleware/errors.js';
import dishesRouter from './routes/dishes.js';
import ordersRouter from './routes/orders.js';
import { register, specificUser, findUser } from '../db/db.js'
import { isText } from './validation.js'

// Sökvägen utgår från den här filen, inte från mappen där du startade node
const filesDir = path.join(import.meta.dirname, '..', 'files');

export const app = express();

// 1. Middleware för alla förfrågningar. Ordningen spelar roll:
//    loggern först, så att även förfrågningar med trasig JSON antecknas,
//    och express.json() före rutterna, annars är req.body undefined.
app.use(logger);
app.use(express.json());

// 2. Rutterna
app.get('/', (req, res) => {
  res.sendFile(path.join(filesDir, 'index.html'));
});

// En hel fil till klienten: sendFile streamar den och sätter Content-Type åt oss
app.get('/menu.txt', (req, res) => {
  res.sendFile(path.join(filesDir, 'meny.txt'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!isText(username) || !isText(password)) {
    return res.status(400).json({ error: 'Fyll i namn och lösenord' });
  }
  try {
    const user = await register(username, password)
    res.status(201).json({ id: user.id, username: user.username });
  } catch(err){
    console.error(err)
    res.status(500).json({ error: 'Kunde inte skapa ny användare' })
  }
})

app.post('/login', async (req,res) => {
  try {
    const { username, password } = req.body ?? {}
    if (!isText(username) || !isText(password)) {
      return res.status(400).json({ error: 'Fyll i namn och lösenord' });
    }

    const user = await findUser(username);
    const isValid = user && (await bcrypt.compare(password, user.password))

    if(!isValid) {
      res.status(401).json({error: 'Kunde inte authentisera användaren'})
    }

    const payload = { id: user.id, username: user.username }

    const token = jwt.sign(payload, 'password', {
      expiresIn: '1h',
    });
    
    res.status(200).json({ token });
  } catch(err){
    console.error(err)
    res.status(500).json({ error: 'Kunde inte logga in användare' })
  }
})


app.get('/user', authorization.byPassword, async (req, res) => {
  try {
    const userData = await specificUser(req.user.id)
    res.status(200).json(userData);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde hämta användare' })
  }
})

app.use('/dishes', dishesRouter);
app.use('/orders', ordersRouter);

// 3. Ingen rutt matchade: 404
app.use(notFound);

// 4. Felhanteraren allra sist
app.use(errorHandler);
