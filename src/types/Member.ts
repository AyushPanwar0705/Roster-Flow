export interface Member {
  _id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage: string;
  createdAt?: string;
  updatedAt?: string;
}