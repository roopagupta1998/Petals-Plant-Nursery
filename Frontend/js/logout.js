export function handleLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));

    if (logoutBtn) {
        if (isLoggedIn) {
            logoutBtn.style.display = "inline-block"; // Show button if logged in
            logoutBtn.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent navigation
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("user"); // Remove user session
                    window.location.href = "/Frontend/pages/home.html"; // Redirect to home page
                }
            });
        } else {
            logoutBtn.style.display = "none"; // Hide button if not logged in
        }
    }
}
