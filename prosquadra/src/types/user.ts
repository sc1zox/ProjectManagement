export interface User {
  role: UserRole;
  id: number;
  username: string;
  skills: string;
  token?: string;
}
enum UserRole {
  PO = 'Product Owner',
  SM = 'Scrum Master',
  Developer = 'Developer',
  Admin = 'Admin'
}
