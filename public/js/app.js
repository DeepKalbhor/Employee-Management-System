const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const employeeId =
        document.getElementById("employeeId").value;

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                employeeId,
                password
            })
        });

        const data = await response.json();

        if (data.success) {

            message.textContent = "Login successful";
      localStorage.setItem("employeeId", data.employee_id);
localStorage.setItem("role", data.role);
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);

        } else {

            message.textContent = data.message;
        }

    } catch (error) {

        message.textContent =
            "Unable to connect to server.";

        console.error(error);
    }
});
