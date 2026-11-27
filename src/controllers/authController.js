import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, specificUser, findUser, allUsers, updateUserById } from '../../db/db.js';
import { isText } from '../validation.js';
import { permissions } from '../roles.js'

export const registerUser = async (req, res) => {
  const { username, password, role } = req.body ?? {};
  if (!isText(username) || !isText(password)) {
    return res.status(400).json({ error: 'Fyll i namn och lösenord' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await register(username, hash, role);
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
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

    const payload = { id: user.id, username: user.username, role:user.role };

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

export const getAllUsers = async (req, res) => {
  try {
    const allUserData = await allUsers();
    res.status(200).json(allUserData);
  } catch(err){
    console.error(err);
    res.status(500).json({error: 'Kunde inte hämta alla användare'})
  }
}

export const updateUser = async (req, res) => {
  try {
    const newData = req.body;
    const userId = req.params.id;

    // TODO: Datavalidation need

    const currentUserData = await specificUser(userId)

    const myPermissions = permissions[req.user.role];
    const usersPermissions = permissions[currentUserData.role];

    const allIncluded = usersPermissions.every((permission) => {
        return myPermissions.includes(permission)
    })

    /*
      Only username and role should be changable
    */

    /*
        TODO: Should not be able to upgrade someone to same role or higher as self. 
    */

    /*
      Update self is fine but not change role??
    */

    if(!allIncluded || req.user.role === currentUserData.role){
      res.status(403).json({error: 'You can not update this user'})
    }

    console.log(currentUserData, newData)

    const updatedUser = await updateUserById(userId, newData)

    res.status(200).json({updatedUser})
  } catch(err){
    console.error(err)
    res.status(500).json({})
  }
}
