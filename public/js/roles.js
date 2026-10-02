async function loadRoles() {

    const response =
        await fetch("/api/roles");

    const data =
        await response.json();

    const table =
        document.getElementById("roles");

    table.innerHTML = "";

    data.forEach(employee => {

        table.innerHTML += `

            <tr>

                <td>
                    ${employee.employee_id}
                </td>

                <td>
                    ${employee.name}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>

                    <select
                        onchange="
                            updateRole(
                                '${employee.employee_id}',
                                this.value
                            )
                        ">

                        <option
                            ${employee.role === "Admin"
                                ? "selected" : ""}>
                            Admin
                        </option>

                        <option
                            ${employee.role === "HR"
                                ? "selected" : ""}>
                            HR
                        </option>

                        <option
                            ${employee.role === "Manager"
                                ? "selected" : ""}>
                            Manager
                        </option>

                        <option
                            ${employee.role === "Employee"
                                ? "selected" : ""}>
                            Employee
                        </option>

                    </select>

                </td>

            </tr>

        `;

    });
}


async function updateRole(
    employeeId,
    role
) {

    await fetch(
        `/api/roles/${employeeId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                role: role
            })
        }
    );

}


loadRoles();