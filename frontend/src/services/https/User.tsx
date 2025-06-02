import { User } from "@/interfaces/Index";

const apiUrl =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "http://192.168.182.113:8080";

const GetUserByID = async (id: number) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  };

  const res = await fetch(`${apiUrl}/user/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });

  return res;
}

async function CreateUser(formData: User) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  };

  const res = await fetch(`${apiUrl}/user/create`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

async function UpdateUser(formData: User, id: number | undefined) {
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include"
  };

  const res = await fetch(`${apiUrl}/user/patch/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

async function DeleteUser(id: number | undefined) {
  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
  };
  const res = await fetch(`${apiUrl}/user/delete/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      console.log(res)
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}
async function LoginUser(data: { Email: string, password: string }) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  };

  try {
    const response = await fetch(`${apiUrl}/login`, requestOptions);
    const res = await response.json();
    console.log(res);
    if (res.token && res.usertypeid && res.userid && res.usertype) {
      return { status: true, token: res.token, usertypeid: res.usertypeid, userid: res.userid, usertype: res.usertype };
    } else {

      return { status: false, message: res.error };
    }
  } catch (error) {
    return { status: false, message: 'An error occurred: ' + error };
  }
}

async function LogOutUser(id: string) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  try {
    const response = await fetch(`${apiUrl}/logout/${id}`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to log out");
    }
    const data = await response.json();
    return { status: true, message: "Logout successful", data };
  } catch (error: any) {
    console.error("Error logging out:", error.message);
    return { status: false, message: error.message };
  }
}


export { UpdateUser, DeleteUser, CreateUser, GetUserByID, LogOutUser, LoginUser }