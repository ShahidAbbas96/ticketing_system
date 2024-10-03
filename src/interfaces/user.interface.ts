export interface AddUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  roleId: number;
  password: string;
  phoneNumber: string;
  departmentId: number;
  image?: File;
  regionId: number;
}

export interface EditUser extends AddUser {
  id: number;
}
