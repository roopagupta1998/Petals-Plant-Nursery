document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        // Redirect logged-in users to dashboard or home page
        window.location.href = "dashboard.html";
    }

    // 🔹 Login Form Handling
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent form submission
    
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
    
            try {
                // Send login request to backend
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });
    
                const data = await response.json();
                console.log("data",data)

                if (response.ok) {
                    alert(`Login successful! Welcome ${data.data.name}`);
                    localStorage.setItem("user", JSON.stringify(data.data)); // Store user data
                    window.location.href = "dashboard.html"; // Redirect to dashboard
                } else {
                    alert(data.message || "Invalid email or password");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred during login. Please try again.");
            }
        });
    }
    

    // 🔹 Signup Form Handling
// 🔹 Signup Form Handling
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !email || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            // Send signup request to backend
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Show confirmation before redirecting
                setTimeout(() => {
                    if (confirm("Signup successful! Click OK to go to the login page.")) {
                        window.location.href = "login.html"; // Redirect only if user clicks OK
                    }
                }, 100); 
            } else {
                alert(data.message || "Failed to register user.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred during signup. Please try again.");
        }
    });
}

    

    //forget PAssword Form
});







