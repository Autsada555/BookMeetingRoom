
export interface User {
  [x: string]: unknown;

  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password?: string;
  // Phone: string;
  // UserName?: string;
  // Address: string;
  GenderID: number;
  UserTypeID: number;
  // CreditCardNumber: string;

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
  name: string;
  checked: boolean;
  remark: string;
}

export interface DailyChecks {
  ID?: number;                // optional ถ้าใช้ตอนส่งข้อมูลใหม่
  date: string;
  checkedBy: string;
  userID: number;
  checks: CheckItem[];
  images: string[];           // หรือ base64 ถ้าเป็นรูปที่ encode แล้ว
  createdAt?: string;         // ถ้ามาจาก backend
  updatedAt?: string;
}




