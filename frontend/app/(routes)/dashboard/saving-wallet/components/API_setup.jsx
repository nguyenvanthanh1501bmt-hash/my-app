import React from "react";

export async function DeleteSaving(id){
    try {
        const res = await fetch(`http://localhost:8000/api/savings/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }); 

        if(!res.ok){
            const text = await res.json();
            throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
        }
    }
    catch (err){
        console.error(err);
        throw  err;
    }
}

export async function CreateSaving(savingData) {
  try {
    const res = await fetch("http://localhost:8000/api/savings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(savingData),
    });

    if (!res.ok) {
      const text = await res.json();
      throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
    }

    const json = await res.json();
    return json; // Trả về saving mới tạo
  } catch (err) {
    console.error("CreateSaving error:", err);
    throw err;
  }
}

export async function UpdateSaving(saving_id, updateData) {
  try {
    const res = await fetch(`http://localhost:8000/api/savings/${saving_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      const text = await res.json();
      throw new Error(`Error ${res.status}: ${JSON.stringify(text)}`);
    }

    const updatedSaving = await res.json();
    return updatedSaving; // trả về dữ liệu đã update
  } catch (err) {
    console.error(err);
    throw err;
  }
}



export { DeleteSaving, CreateSaving, UpdateSaving };