// src/api/auth.api.ts
export type Role = 'Driver' | 'Admin';

export interface User {
  name: string;
  role: Role;
  token: string;
}

const USERS: User[] = [
  { name: 'alice', role: 'Driver', token: 'token-driver-alice' },
  { name: 'bob', role: 'Admin', token: 'token-admin-bob' },
];

function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function loginApi(username: string, password: string): Promise<User> {
  await delay(300);
  // simple mock auth: password must be "password"
  const found = USERS.find((u) => u.name === username.toLowerCase());
  if (!found || password !== 'password') {
    throw new Error('Invalid credentials');
  }
  return found;
}

export async function signupApi(username: string, password: string, role: Role): Promise<User> {
  await delay(300);
  const exists = USERS.find((u) => u.name === username.toLowerCase());
  if (exists) throw new Error('User already exists');
  const user: User = { name: username.toLowerCase(), role, token: `token-${username}-${Date.now()}` };
  USERS.push(user);
  return user;
}
