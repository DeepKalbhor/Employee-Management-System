const attendanceTable =
    document.getElementById("attendanceTable");


// =========================
// LOAD ATTENDANCE
// =========================

async function loadAttendance(
    url = "/api/attendance"
) {

    try {

        const response = await fetch(url);

        const data = await response.json();

        attendanceTable.innerHTML = "";

        data.attendance.forEach(record => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${record.employee_id}
                </td>

                <td>
                    ${record.name}
                </td>

                <td>
                    ${record.department || "-"}
                </td>

                <td>
                    ${formatDate(record.attendance_date)}
                </td>

                <td>
                    <span class="status">
                        ${record.status}
                    </span>
                </td>

                <td>
                    ${record.check_in || "-"}
                </td>

                <td>
                    ${record.check_out || "-"}
                </td>

            `;

            attendanceTable.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }

}


// =========================
// DATE FORMAT
// =========================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date)
        .toLocaleDateString("en-IN");

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

            loadAttendance();

        } else {

            loadAttendance(
                `/api/attendance/search?q=${encodeURIComponent(value)}`
            );

        }

    });


// =========================
// MODAL
// =========================

function openAttendanceModal() {

    document
        .getElementById("attendanceModal")
        .style.display = "flex";

    document
        .getElementById("attendanceDate")
        .valueAsDate = new Date();

}


function closeAttendanceModal() {

    document
        .getElementById("attendanceModal")
        .style.display = "none";

}


// =========================
// SAVE ATTENDANCE
// =========================

document
    .getElementById("attendanceForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const attendance = {

                employee_id:
                    document.getElementById(
                        "attendanceEmployeeId"
                    ).value,

                attendance_date:
                    document.getElementById(
                        "attendanceDate"
                    ).value,

                status:
                    document.getElementById(
                        "attendanceStatus"
                    ).value,

                check_in:
                    document.getElementById(
                        "checkIn"
                    ).value,

                check_out:
                    document.getElementById(
                        "checkOut"
                    ).value

            };


            const response = await fetch(
                "/api/attendance",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(attendance)
                }
            );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "Attendance marked successfully"
                );

                this.reset();

                closeAttendanceModal();

                loadAttendance();

            } else {

                alert(data.message);

            }

        }
    );


// Initial load

loadAttendance();