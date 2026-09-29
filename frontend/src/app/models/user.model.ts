export type UserRole = "client" | "printer" | "admin";
export type UserStatus = "pending" | "approved" | "rejected";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string;
  role: UserRole;
  status: UserStatus;
  isCompany?: boolean;
  companyName?: string;
  address?: string;
  city?: string;
  registrationNumber?: string;
  pib?: string;
}
