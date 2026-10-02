const table =
    document.getElementById("tasks");


async function loadTasks() {

    const response =
        await fetch("/api/tasks");

    const data =
        await response.json();

    table.innerHTML = "";

    data.forEach(task => {

        table.innerHTML += `

            <tr>

                <td>${task.task_id}</td>

                <td>${task.employee_id}</td>

                <td>${task.title}</td>

                <td>${task.due_date}</td>

                <td>

                    <select
                        onchange="updateTask(
                            ${task.task_id},
                            this.value
                        )">

                        <option
                            ${task.status === "Pending"
                                ? "selected" : ""}>
                            Pending
                        </option>

                        <option
                            ${task.status === "In Progress"
                                ? "selected" : ""}>
                            In Progress
                        </option>

                        <option
                            ${task.status === "Completed"
                                ? "selected" : ""}>
                            Completed
                        </option>

                    </select>

                </td>

            </tr>

        `;

    });
}


function openTask() {

    document
        .getElementById("taskModal")
        .style.display = "flex";

}


document
    .getElementById("taskForm")
    .addEventListener("submit", async e => {

        e.preventDefault();

        await fetch("/api/tasks", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "role": localStorage.getItem("role")
            },

            body: JSON.stringify({

                employee_id:
                    document.getElementById(
                        "employeeId"
                    ).value,

                title:
                    document.getElementById(
                        "title"
                    ).value,

                due_date:
                    document.getElementById(
                        "dueDate"
                    ).value

            })

        });

        document
            .getElementById("taskModal")
            .style.display = "none";

        e.target.reset();

        loadTasks();

    });


async function updateTask(id, status) {

    await fetch(`/api/tasks/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "role": localStorage.getItem("role")
        },

        body: JSON.stringify({
            status
        })

    });

}


loadTasks();