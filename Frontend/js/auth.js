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
                // Fetch users from JSON Server
                const response = await fetch("http://localhost:3000/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const users = await response.json();

                // Check if user exists
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    alert(`Login successful! Welcome ${user.name}`);
                    localStorage.setItem("user", JSON.stringify(user)); // Store user data
                    window.location.href = "dashboard.html"; // Redirect to dashboard
                } else {
                    alert("Invalid email or password");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred during login. Please try again.");
            }
        });
    }

    // 🔹 Signup Form Handling
    document.getElementById("signupForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission
    
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
    
        if (!name || !email || !password) {
            alert("All fields are required!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3000/users");
            if (!response.ok) throw new Error("Failed to fetch user data");
    
            const users = await response.json();
    
            // Check if email is already registered
            if (users.some(user => user.email === email)) {
                alert("Email already registered! Please login.");
                return;
            }
    
            // New user data
            const newUser = { name, email, password, role: "user" };
    
            // Send POST request
            const postResponse = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
    
            if (!postResponse.ok) throw new Error("Failed to register user.");
    
            // Show confirmation before redirecting
            setTimeout(() => {
                if (confirm("Signup successful! Click OK to go to the login page.")) {
                    window.location.href = "login.html"; // Redirect only if user clicks OK
                }
            }, 100); 
    
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred during signup. Please try again.");
        }
    });
    

    //forget PAssword Form
});







