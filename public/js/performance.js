const performanceTable =
    document.getElementById("performanceTable");


// =========================
// LOAD PERFORMANCE
// =========================

async function loadPerformance(
    url = "/api/performance"
) {

    try {

        const response =
            await fetch(url);

        const data =
            await response.json();

        performanceTable.innerHTML = "";

        data.performance.forEach(record => {

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
                    ${formatDate(record.review_date)}
                </td>

                <td>
                    <strong>
                        ${record.rating}/5
                    </strong>
                </td>

                <td>
                    ${record.comments || "-"}
                </td>

            `;

            performanceTable.appendChild(row);

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

            loadPerformance();

        } else {

            loadPerformance(
                `/api/performance/search?q=${encodeURIComponent(value)}`
            );

        }

    });


// =========================
// MODAL
// =========================

function openPerformanceModal() {

    document
        .getElementById("performanceModal")
        .style.display = "flex";

    document
        .getElementById("reviewDate")
        .valueAsDate = new Date();

}


function closePerformanceModal() {

    document
        .getElementById("performanceModal")
        .style.display = "none";

}


// =========================
// ADD REVIEW
// =========================

document
    .getElementById("performanceForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const review = {

                employee_id:
                    document.getElementById(
                        "performanceEmployeeId"
                    ).value,

                review_date:
                    document.getElementById(
                        "reviewDate"
                    ).value,

                rating:
                    document.getElementById(
                        "rating"
                    ).value,

                comments:
                    document.getElementById(
                        "performanceComments"
                    ).value

            };


            const response =
                await fetch(
                    "/api/performance",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(review)
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "Performance review added"
                );

                this.reset();

                closePerformanceModal();

                loadPerformance();

            } else {

                alert(data.message);

            }

        }
    );


// Initial load

loadPerformance();