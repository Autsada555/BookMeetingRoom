import { DailyChecks } from "@/interfaces/Index";

const apiUrl = "http://localhost:8080";

const GetAllCheckSystems = async () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/checksystems/list`, requestOptions)
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

async function CreateCheckSystems(formData: DailyChecks) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  };

  const res = await fetch(`${apiUrl}/checksystems/create`, requestOptions)
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

async function UpdateCheckSystems(formData: DailyChecks, id: number | undefined) {
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include"
  };

  const res = await fetch(`${apiUrl}/checksystems/patch/${id}`, requestOptions)
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

async function DeleteCheckSystems(id: number | undefined) {
  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
  };
  const res = await fetch(`${apiUrl}/checksystems/delete/${id}`, requestOptions)
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


export { UpdateCheckSystems, DeleteCheckSystems, CreateCheckSystems, GetAllCheckSystems }