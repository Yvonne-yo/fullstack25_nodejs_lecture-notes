// Controllers säger VAD som händer. Rutterna (routes/) säger VAR.
import * as dishes from '../data/dishes.js';
import { httpError } from '../utils/httpError.js';
import { parseId, validateDish, pickDishFields } from '../validation.js';
import * as db from '../../db/db.js';

// GET /dishes?category=main&maxPrice=200
export async function listDishes(req, res) {
  // req.query är alltid text: ?maxPrice=200 ger '200'
  const { category } = req.query;
  const maxPrice = req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);
  if (Number.isNaN(maxPrice)) throw httpError(400, 'maxPrice måste vara ett tal');

  const dishes = await db.readDishes({ category, maxPrice });
  res.json(dishes);
}

// GET /dishes/:id
export async function getDish(req, res) {
  const dish = await dishes.getDish(parseId(req.params.id));
  if (!dish) return res.status(404).json({ error: 'Rätten finns inte' });

  res.json(dish);
}

// POST /dishes
export async function createDish(req, res) {
  const errors = validateDish(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });
  const dish = db.createDish(pickDishFields(req.body))  
  res.status(201).json(dish);
}

// PATCH /dishes/:id – ändra bara de fält som skickas
export async function updateDish(req, res) {
  const id = req.params.id;
  console.log(req.params.id, req.body)
  const errors = validateDish(req.body, { partial: true });
  if (errors.length > 0) return res.status(400).json({ errors });

  const dish = await db.updateDish(id, pickDishFields(req.body));
  if (!dish) return res.status(404).json({ error: 'Rätten finns inte' });

  res.json(dish);
}

// DELETE /dishes/:id
export async function deleteDish(req, res) {
  const deleted = await db.deleteDish(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Rätten finns inte' });

  res.status(204).end(); // 204 = gick bra, men ingen body att skicka
}
