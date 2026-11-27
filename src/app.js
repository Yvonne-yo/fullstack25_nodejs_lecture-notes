import express from 'express';
import path from 'node:path';
import { logger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/errors.js';
import dishesRouter from './routes/dishes.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import { specificUser } from '../db/db.js';
import { requireAuth, requireRole } from './middleware/validation.js';


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


///auth/register för att skapa ny användare/gäst /auth/login för att logga in
app.use(authRouter);

//Saras alternativ
//app.use('/auth', authRouter);
/*app.get('/user', requireAuth, async (req, res) => {
  try {
    const userData = await specificUser(req.user.id);
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta användare' });
  }
});
*/

app.use('/dishes', dishesRouter);
app.use('/orders', ordersRouter);

// 3. Ingen rutt matchade: 404
app.use(notFound);

// 4. Felhanteraren allra sist
app.use(errorHandler);
