import { User } from "@/interfaces/Index";

const apiUrl = "http://localhost:8080";

const GetCustomerByID = async (id: number) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  };

  const res = await fetch(`${apiUrl}/customer/${id}`, requestOptions)
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

async function CreateCustomer(formData: User) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  };

  const res = await fetch(`${apiUrl}/customer/create`, requestOptions)
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

async function UpdateCustomer(formData: User, id: number | undefined) {
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include"
  };

  const res = await fetch(`${apiUrl}/customer/edit/${id}`, requestOptions)
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

async function DeleteCustomer(id: number | undefined) {
  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
  };
  const res = await fetch(`${apiUrl}/customer/delete/${id}`, requestOptions)
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


export { UpdateCustomer, DeleteCustomer,  CreateCustomer,  GetCustomerByID }