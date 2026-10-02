const employeeId = "EMP001";

async function loadProfile() {

    const response =
        await fetch(
            `/api/profile/${employeeId}`
        );

    const data =
        await response.json();

    document.getElementById("employeeId")
        .value = data.employee_id;

    document.getElementById("name")
        .value = data.name;

    document.getElementById("email")
        .value = data.email;

    document.getElementById("phone")
        .value = data.phone;
}


document
    .getElementById("profileForm")
    .addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            await fetch(
                `/api/profile/${employeeId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email:
                            document.getElementById(
                                "email"
                            ).value,

                        phone:
                            document.getElementById(
                                "phone"
                            ).value

                    })
                }
            );

            alert("Profile updated");

        }
    );


loadProfile();