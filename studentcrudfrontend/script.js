const apiUrl = "http://localhost:8080/api/students";

//  Load all students when the page loads
window.addEventListener("DOMContentLoaded", loadStudents);

//  Add a new student
document.getElementById("studentForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const student = {
    id: Number(document.getElementById("id").value),
    name: document.getElementById("name").value.trim(),
    rollNumber: document.getElementById("rollNumber").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    department: document.getElementById("department").value.trim()
  };

  console.log("Submitting student:", student);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save student. Server says: ${errorText}`);
    }

    this.reset(); // clear form
    await loadStudents(); // reload table
  } catch (err) {
    console.error("Error adding student:", err);
    alert("Failed to add student. Check console for details.");
  }
});

//  Load all students and populate the table
async function loadStudents() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch students.");
    }

    const students = await response.json();
    console.log("Fetched students:", students);

    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = "";

    students.forEach(student => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.rollNumber}</td>
        <td>${student.mobile}</td>
        <td>${student.department}</td>
        <td>
          <button onclick="deleteStudent(${student.id})" class="delete-btn">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading students:", err);
    alert("Could not load student list.");
  }
}

//  Delete a student
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete student.");
    }

    await loadStudents(); // refresh table
  } catch (err) {
    console.error("Error deleting student:", err);
    alert("Could not delete student.");
  }
}




