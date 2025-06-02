import { DailyChecks } from "@/interfaces/Index";

const apiUrl =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "http://192.168.182.113:8080";

const getToken = () => localStorage.getItem("token");

const GetAllCheckSystems = async () => {
  const token = getToken();
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  };

  const response = await fetch(`${apiUrl}/checksystems/list`, requestOptions);
  const res = await response.json();

  if (res) {
    return res;
  } else {
    return false;
  }
};

async function CreateCheckSystems(formData: DailyChecks) {
  const token = getToken();
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
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
  const token = getToken();
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
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
  const token = getToken();
  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  };
  const res = await fetch(`${apiUrl}/checksystems/delete/${id}`, requestOptions)
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

export { UpdateCheckSystems, DeleteCheckSystems, CreateCheckSystems, GetAllCheckSystems }