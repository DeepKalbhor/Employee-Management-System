async function loadDashboardStats() {

    try {

        const response =
            await fetch("/api/dashboard-stats");

        const data =
            await response.json();

        if (!data.success) {
            console.log(data.message);
            return;
        }

        document.getElementById(
            "totalEmployees"
        ).textContent = data.totalEmployees;

        document.getElementById(
            "presentToday"
        ).textContent = data.presentToday;

        document.getElementById(
            "onLeave"
        ).textContent = data.onLeave;

        document.getElementById(
            "pendingRequests"
        ).textContent = data.pendingRequests;

    } catch (error) {

        console.log(
            "Dashboard stats error:",
            error
        );

    }
}


// Load immediately
loadDashboardStats();


// Update every 30 seconds
setInterval(
    loadDashboardStats,
    30000
);