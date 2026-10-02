async function loadReports() {

    const response =
        await fetch("/api/reports");

    const data =
        await response.json();

    document.getElementById("employees")
        .textContent = data.employees;

    document.getElementById("attendance")
        .textContent = data.attendance;

    document.getElementById("leave")
        .textContent = data.leave;

    document.getElementById("tasks")
        .textContent = data.tasks;
}

loadReports();