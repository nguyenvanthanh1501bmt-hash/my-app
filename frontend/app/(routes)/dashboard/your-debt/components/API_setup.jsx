// ================= DELETE LOAN =================
export async function DeleteLoan(id) {
  try {
    const res = await fetch(`http://localhost:8000/api/loans/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.json();
      throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
    }

    return true; // xoá thành công
  } catch (err) {
    console.error("DeleteLoan error:", err);
    throw err;
  }
}


// ================= UPDATE LOAN =================
export async function UpdateLoan(id, updatedata) {
  try {
    const res = await fetch(`http://localhost:8000/api/loans/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedata),
    });

    if (!res.ok) {
      const text = await res.json();
      throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
    }

    const updatedLoan = await res.json();
    return updatedLoan;
  } catch (err) {
    console.error("UpdateLoan error:", err);
    throw err;
  }
}


// ================= UPDATE LOAN STATUS =================
export async function UpdateLoanStatus(id, status) {
  try {
    const res = await fetch(
      `http://localhost:8000/api/loans/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      const text = await res.json();
      throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
    }

    const updatedLoan = await res.json();
    return updatedLoan;
  } catch (err) {
    console.error("UpdateLoanStatus error:", err);
    throw err;
  }
}


// ================= CREATE LOAN =================
export async function CreateLoan(data) {
  try {
    const res = await fetch(`http://localhost:8000/api/loans/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // LoanCreate object
    });

    if (!res.ok) {
      const text = await res.json();
      throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
    }

    const newLoan = await res.json();
    return newLoan;
  } catch (err) {
    console.error("CreateLoan error:", err);
    throw err;
  }
}
