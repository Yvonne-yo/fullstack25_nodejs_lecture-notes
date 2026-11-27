// Gästen: bara läsa
const guest = ['read'];

// Personalen: allt gästen får, plus update
const staff = [...guest, 'update'];

// Chefen: allt personalen får, plus create och delete
const admin = [...staff, 'create', 'delete', 'readAll'];

export const permissions = { guest, staff, admin };
export const ROLES = Object.keys(permissions);