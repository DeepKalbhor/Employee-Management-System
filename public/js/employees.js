const table = document.getElementById("employeeTable");


// =========================
// LOAD EMPLOYEES
// =========================

async function loadEmployees(url = "/api/employees") {

    try {

        const response = await fetch(url);

        const data = await response.json();

        table.innerHTML = "";

        data.employees.forEach(employee => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${employee.employee_id}</td>

                <td>${employee.name}</td>

                <td>${employee.department || "-"}</td>

                <td>${employee.designation || "-"}</td>

                <td>${formatDate(employee.joining_date)}</td>

                <td>
                    <span class="status">
                        ${employee.status}
                    </span>
                </td>

                <td>

                    <button
                        class="table-btn"
                        onclick="deactivateEmployee('${employee.employee_id}')">

                        Deactivate

                    </button>

                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }

}


// =========================
// DATE
// =========================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");

}


// =========================
// SEARCH
// =========================

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const value = this.value.trim();

        if (value === "") {

            loadEmployees();

        } else {

            loadEmployees(
                `/api/employees/search?q=${encodeURIComponent(value)}`
            );

        }

    });


// =========================
// MODAL
// =========================

function openModal() {

    document
        .getElementById("employeeModal")
        .style.display = "flex";

}


function closeModal() {

    document
        .getElementById("employeeModal")
        .style.display = "none";

}


// =========================
// ADD EMPLOYEE
// =========================

document
    .getElementById("employeeForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const employee = {

            employee_id:
                document.getElementById("employee_id").value,

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            phone:
                document.getElementById("phone").value,

            address:
                document.getElementById("address").value,

            department:
                document.getElementById("department").value,

            designation:
                document.getElementById("designation").value,

            joining_date:
                document.getElementById("joining_date").value

        };


        const response = await fetch(
            "/api/employees",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(employee)
            }
        );


        const data = await response.json();


        if (data.success) {

            alert("Employee added successfully");

            this.reset();

            closeModal();

            loadEmployees();

        } else {

            alert(data.message);

        }

    });


// =========================
// DEACTIVATE
// =========================

async function deactivateEmployee(id) {

    const confirmDelete =
        confirm("Deactivate this employee?");

    if (!confirmDelete) return;


    const response = await fetch(
        `/api/employees/${id}/deactivate`,
        {
            method: "PUT"
        }
    );


    const data = await response.json();


    if (data.success) {

        loadEmployees();

    } else {

        alert(data.message);

    }

}


// Initial load

loadEmployees();