import { permissions } from '../roles.js';

export function authorize(permission) {
  // Returnerar en middleware, precis som requireRole
  return (req, res, next) => {
    // req.user kommer från requireAuth (föreläsning 6)
    const allowed = permissions[req.user.role] ?? [];

    /*
      Update self is fine 
    */

    if (!allowed.includes(permission)) {
      return res.status(403).json({ error: 'Ingen behörighet' });
    }
    next(); // rollen har rättigheten: vidare till rutten
  };
}