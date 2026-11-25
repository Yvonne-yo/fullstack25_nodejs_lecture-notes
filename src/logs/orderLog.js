// Orderloggen: en textfil där varje beställning blir en rad.
// Här använder vi streams från föreläsning 3: en Writable för att skriva,
// och readline + for await för att läsa rad för rad.
import { createReadStream, createWriteStream, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

export const orderLogFile = path.join(import.meta.dirname, '..', '..', 'logs', 'orders.log');

// Sync är okej vid uppstart: det körs en gång, innan servern tar emot gäster
mkdirSync(path.dirname(orderLogFile), { recursive: true });

// En Writable stream som är öppen hela tiden. flags: 'a' = lägg till, skriv inte över.
const logStream = createWriteStream(orderLogFile, { flags: 'a' });
logStream.on('error', (err) => console.error('Kunde inte skriva till orderloggen:', err.message));

// En tab-separerad rad: tid, bord, rätt, antal
export function logOrder(order, dish) {
  // write() returnerar false när bufferten är full (backpressure).
  // För en kort rad per beställning spelar det ingen roll, men skriver man
  // massor av data i en loop ska man vänta på 'drain'.
  logStream.write(`${order.createdAt}\t${order.table}\t${dish.name}\t${order.quantity}\n`);
}

// Räknar hur många av varje rätt som sålts, utan att läsa in hela filen i minnet
export async function countDishesSold() {
  const lines = createInterface({
    input: createReadStream(orderLogFile, { encoding: 'utf8' }),
    crlfDelay: Infinity, // räkna \r\n (Windows) som en radbrytning
  });

  const sold = {};
  for await (const line of lines) {
    if (line.trim() === '') continue;
    const [, , dishName, quantity] = line.split('\t');
    sold[dishName] = (sold[dishName] ?? 0) + Number(quantity);
  }
  return sold;
}
