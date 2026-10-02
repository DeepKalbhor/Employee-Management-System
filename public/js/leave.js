const leaveTable =
    document.getElementById("leaveTable");


// =========================
// LOAD LEAVES
// =========================

async function loadLeaves(
    url = "/api/leaves"
) {

    try {

        const response =
            await fetch(url);

        const data =
            await response.json();

        leaveTable.innerHTML = "";

        data.leaves.forEach(leave => {

            const row =
                document.createElement("tr");

            let action = "-";


            if (leave.status === "Pending") {

                action = `

                    <button
                        class="table-btn"
                        onclick="updateLeave(
                            ${leave.leave_id},
                            'Approved'
                        )">

                        Approve

                    </button>

                    <button
                        class="table-btn"
                        onclick="updateLeave(
                            ${leave.leave_id},
                            'Rejected'
                        )">

                        Reject

                    </button>

                `;

            }


            row.innerHTML = `

                <td>
                    ${leave.leave_id}
                </td>

                <td>
                    ${leave.employee_id}
                    <br>
                    <small>${leave.name}</small>
                </td>

                <td>
                    ${leave.leave_type}
                </td>

                <td>
                    ${formatDate(leave.start_date)}
                    -
                    ${formatDate(leave.end_date)}
                </td>

                <td>
                    ${leave.days}
                </td>

                <td>
                    <span class="status">
                        ${leave.status}
                    </span>
                </td>

                <td>
                    ${action}
                </td>

            `;

            leaveTable.appendChild(row);

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

            loadLeaves();

        } else {

            loadLeaves(
                `/api/leaves/search?q=${encodeURIComponent(value)}`
            );

        }

    });


// =========================
// MODAL
// =========================

function openLeaveModal() {

    document
        .getElementById("leaveModal")
        .style.display = "flex";

}


function closeLeaveModal() {

    document
        .getElementById("leaveModal")
        .style.display = "none";

}


// =========================
// CALCULATE DAYS
// =========================

function calculateLeaveDays() {

    const start =
        document.getElementById("startDate").value;

    const end =
        document.getElementById("endDate").value;


    if (!start || !end) {

        document.getElementById("leaveDays").value = "";

        return;

    }


    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    if (endDate < startDate) {

        document.getElementById("leaveDays").value = "";

        return;

    }


    const difference =
        endDate - startDate;


    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ) + 1;


    document.getElementById("leaveDays").value =
        days;

}


document
    .getElementById("startDate")
    .addEventListener(
        "change",
        calculateLeaveDays
    );


document
    .getElementById("endDate")
    .addEventListener(
        "change",
        calculateLeaveDays
    );


// =========================
// APPLY LEAVE
// =========================

document
    .getElementById("leaveForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const days =
                document.getElementById(
                    "leaveDays"
                ).value;


            if (!days) {

                alert(
                    "Please select valid dates."
                );

                return;

            }


            const leave = {

                employee_id:
                    document.getElementById(
                        "leaveEmployeeId"
                    ).value,

                leave_type:
                    document.getElementById(
                        "leaveType"
                    ).value,

                start_date:
                    document.getElementById(
                        "startDate"
                    ).value,

                end_date:
                    document.getElementById(
                        "endDate"
                    ).value,

                days: days,

                reason:
                    document.getElementById(
                        "leaveReason"
                    ).value

            };


            const response =
                await fetch(
                    "/api/leaves",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(leave)
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "Leave request submitted"
                );

                this.reset();

                closeLeaveModal();

                loadLeaves();

            } else {

                alert(data.message);

            }

        }
    );


// =========================
// APPROVE / REJECT
// =========================

async function updateLeave(
    id,
    status
) {

    const confirmed =
        confirm(
            `Are you sure you want to ${status.toLowerCase()} this leave?`
        );


    if (!confirmed) return;


    const response =
        await fetch(
            `/api/leaves/${id}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


    const data =
        await response.json();


    if (data.success) {

        loadLeaves();

    } else {

        alert(data.message);

    }

}


// Initial load

loadLeaves();