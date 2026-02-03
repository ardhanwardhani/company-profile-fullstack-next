import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
const SALT_ROUNDS = 12;

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'editor'
): Promise<User> {
  const passwordHash = await hashPassword(password);
  
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash, name, role, status)
     VALUES ($1, $1, $2, $3, $4, 'active')
     RETURNING id, username, email, name, role, status, created_at`,
    [email, passwordHash, name, role]
  );
  
  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, username, email, password_hash, name, role, status, last_login_at, created_at FROM users WHERE email = $1',
    [email]
  );
  
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, username, email, name, role, status, last_login_at, created_at FROM users WHERE id = $1',
    [id]
  );
  
  return result.rows[0] || null;
}

export async function updateLastLogin(userId: string): Promise<void> {
  await pool.query(
    'UPDATE users SET last_login_at = NOW() WHERE id = $1',
    [userId]
  );
}

export async function getUsers(): Promise<User[]> {
  const result = await pool.query(
    'SELECT id, username, email, name, role, status, last_login_at, created_at FROM users ORDER BY created_at DESC'
  );
  
  return result.rows;
}

export async function updateUserRole(userId: string, role: UserRole): Promise<User | null> {
  const result = await pool.query(
    'UPDATE users SET role = $2 WHERE id = $1 RETURNING id, username, email, name, role, status',
    [userId, role]
  );
  
  return result.rows[0] || null;
}
