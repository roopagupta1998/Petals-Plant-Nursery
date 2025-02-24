import { getUsers, addUser,deleteUser,updateUser } from '../js/api.js'; // Adjust the path if needed

// Function to display users in the table
async function displayUsers() {
    try {
        const users = await getUsers();
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        users.forEach((user, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                <button class="edit-btn" onclick='editUser(${JSON.stringify(user)})'>
    <i class="fa-solid fa-edit"></i>
</button>

                    <button class="delete-btn" onclick="deleteUser('${user._id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Add User Function
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    console.log("userId",userId)
    const userDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        isAdmin: document.getElementById('isAdmin').checked
    };
debugger
    if (userId) {
        // Update User
        await updateUser(userId, userDetails);
        document.getElementById('submitBtn').textContent = 'Add User'; // Reset to 'Add User'
    } else {
        // Add New User
        await addUser(userDetails);
    }

    // Clear the form
    document.getElementById('addUserForm').reset();
    document.getElementById('submitBtn').textContent = 'Add User';

    // Refresh the user list
    displayUsers();
});


// Edit User Function
window.editUser = function (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('isAdmin').checked = user.isAdmin;
        document.getElementById('userId').value = user._id;
        
        // Change button text to 'Update User'
        document.getElementById('submitBtn').textContent = 'Update User';
    
};
// Delete User Function
window.deleteUser = async function (userId) {
    try {
        const confirmed = confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        await deleteUser(userId);

        // Refresh the user list after deletion
        displayUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Load users on page load
document.addEventListener("DOMContentLoaded", displayUsers);
