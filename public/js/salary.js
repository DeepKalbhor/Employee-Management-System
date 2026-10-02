const salaryTable =
    document.getElementById("salaryTable");


// =========================
// LOAD SALARIES
// =========================

async function loadSalaries(
    url = "/api/salaries"
) {

    try {

        const response =
            await fetch(url);

        const data =
            await response.json();

        salaryTable.innerHTML = "";

        data.salaries.forEach(salary => {

            const totalDeductions =
                Number(salary.other_deductions || 0) +
                Number(salary.leave_deduction || 0);

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${salary.employee_id}
                </td>

                <td>
                    ${salary.name}
                </td>

                <td>
                    ${salary.month}
                </td>

                <td>
                    ₹${Number(
                        salary.basic_salary
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${Number(
                        salary.allowances
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${totalDeductions.toLocaleString("en-IN")}
                </td>

                <td>
                    <strong>
                        ₹${Number(
                            salary.net_salary
                        ).toLocaleString("en-IN")}
                    </strong>
                </td>

            `;

            salaryTable.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }

}


// =========================
// SEARCH
// =========================

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const value =
            this.value.trim();

        if (value === "") {

            loadSalaries();

        } else {

            loadSalaries(
                `/api/salaries/search?q=${encodeURIComponent(value)}`
            );

        }

    });


// Initial load

loadSalaries();