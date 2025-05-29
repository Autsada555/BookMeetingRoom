
export interface User {
  [x: string]: unknown;

  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password?: string;

  GenderID: number;
  UserTypeID: number;

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
export interface CheckItem {
  id?: number;
  name: string;
  section: string;
  checked: boolean;
  remark: string;
}

export interface DailyChecks {
  id: number;
  date: string;
  checkedBy: string;
  userID: number;
  checks: string | CheckItem[];
  images?: string[];
}



