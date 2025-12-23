const BASE = "http://localhost:8000/api/users";

export async function getUsers() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(BASE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Not authorized");
    }
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function updateRole(userId, role) {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No token");

  const res = await fetch(
    `http://localhost:8000/api/users/${userId}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!res.ok) throw new Error("Update role failed");

  return res.json();
}
