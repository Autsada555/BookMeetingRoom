
export interface User {
  [x: string]: unknown;

  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password?: string;
  Phone: string;
  UserName?: string;
  Address: string;
  GenderID: number;
  UserTypeID: number;
  CreditCardNumber: string;

  Gender: Gender;
  UserType: UserType;
}

export interface Gender {
  ID: number;
  Name: string;
}

export interface UserType {
  ID: number;
  Name: string;
}






