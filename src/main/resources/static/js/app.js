// const url = 'https://jsonplaceholder.typicode.com/users';
const url = '/api/admin/users';
const urlRoles = '/api/admin/roles';
const urlUser = '/api/user';

// time to load showAllUsers and showCurrentUser
window.addEventListener('DOMContentLoaded', showAllUsers);
window.addEventListener('DOMContentLoaded', showCurrentUser);

// show all users
async function showAllUsers() {
  const res = await fetch(url);
  const users = await res.json();

  console.log(users);
  users.forEach(user => userToHTML(user));
}

// get all roles
function getAllRoles() {
  return fetch(urlRoles)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((roles) => {
        console.log('all roles:')
        console.log(roles);
        return roles;
      })
}

// show current user
async function showCurrentUser() {
  const res = await fetch(urlUser);
  const user = await res.json();
  console.log(user);

  if(user) {
    const tbody = document.getElementById('table_user');
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${user.id}</td>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
        <td>${user.age}</td>
        <td>${user.username}</td>
        <td>${user.stringFromRoles}</td>
      </tr>
    `);
  }
}

function userToHTML({id, firstname, lastname, age, username, stringFromRoles}) {
  const userList = document.getElementById('users');

  userList.insertAdjacentHTML('beforeend', `
    <tr id="user${id}">
      <td>${id}</td>
      <td>${firstname}</td>
      <td>${lastname}</td>
      <td>${age}</td>
      <td>${username}</td>
      <td>${stringFromRoles}</td>
      <td>
        <button onclick="showEditModal(${id})" type="button" class="btn btn-info btn-sm" data-toggle="modal" 
            data-whatever="${id}" data-target="#editModal">Edit</button>
      </td>
      <td>
        <button onclick="showDeleteModal(${id})" type="button" class="btn btn-danger btn-sm" data-toggle="modal" 
            data-whatever="${id}" data-target="#deleteModal">Delete</button>
      </td>
    </tr>
  `);
}

// CREATE new user
async function showNewModal() {
  $("#newRoles").empty();
  let selectEdit = document.getElementById('newRoles');
  let allRoles = await getAllRoles();

  allRoles.forEach((role) => {
    let option = document.createElement('option');
    option.setAttribute('value', JSON.stringify(role));
    option.setAttribute('name', role.role);
    option.appendChild(document.createTextNode(role.noPrefix));
    selectEdit.appendChild(option);
  });
}

async function newUser() {
  const newUserForm = document.getElementById("newUserForm");
  const formData = new FormData(newUserForm);
  const rolesForm = document.getElementById("newRoles");
  console.log(rolesForm);
  let rolesSelected = Array.from(rolesForm.options)
      .filter(option => option.selected)
      .map(option => JSON.parse(option.value))

  let user = {
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    age: formData.get('age'),
    username: formData.get('username'),
    password: formData.get('password'),
    roles: rolesSelected
  }

  if (user.username) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(user)
    });

    const newUser = await res.json();
    console.log(newUser);
    userToHTML(newUser);
  }

  document.getElementById("newFirstname").value = '';
  document.getElementById("newLastname").value = '';
  document.getElementById("newAge").value = '';
  document.getElementById("newUsername").value = '';
  document.getElementById("newPassword").value = '';
  $('#nav-users-table-tab').tab('show');
}


// EDIT user
async function showEditModal(id) {
  const res = await fetch(`${url}/${id}`);
  let user = await res.json();
  console.log(user);
  document.getElementById("editId").value = user.id;
  document.getElementById("editFirstname").value = user.firstname;
  document.getElementById("editLastname").value = user.lastname;
  document.getElementById("editAge").value = user.age;
  document.getElementById("editUsername").value = user.username;
  document.getElementById("editPassword").value = user.password;

  $("#editRoles").empty();
  let selectEdit = document.getElementById('editRoles');
  let allRoles = await getAllRoles();

  allRoles.forEach((role) => {
    let option = document.createElement('option');
    option.setAttribute('value', JSON.stringify(role));
    option.setAttribute('name', role.role);
    user.roles.forEach(userRole => {
      if (userRole.role == role.role) {
        option.setAttribute('selected', true);
      }
    });
    option.appendChild(document.createTextNode(role.noPrefix));
    selectEdit.appendChild(option);
  });
}

async function editUser() {
  let editForm = document.getElementById("editForm");
  let formData = new FormData(editForm);
  let rolesForm = document.getElementById("editRoles");
  console.log(rolesForm);
  let rolesSelected = Array.from(rolesForm.options)
      .filter(option => option.selected)
      .map(option => JSON.parse(option.value))

  let user = {
    id: formData.get('id'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    age: formData.get('age'),
    username: formData.get('username'),
    password: formData.get('password'),
    roles: rolesSelected
  }
  console.log(user);
  console.log(user.roles);

  const res = await fetch(`${url}/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(user)
  });

  const data = await res.json();
  console.log(data);

  if (data) {
    updateUserToHTML(data);
  }
}

function updateUserToHTML({id, firstname, lastname, age, username, stringFromRoles}) {
  const userInfo = document.getElementById(`user${id}`);
  userInfo.cells[1].innerHTML = `${firstname}`;
  userInfo.cells[2].innerHTML = `${lastname}`;
  userInfo.cells[3].innerHTML = `${age}`;
  userInfo.cells[4].innerHTML = `${username}`;
  userInfo.cells[5].innerHTML = `${stringFromRoles}`;
}

// DELETE user
async function showDeleteModal(id) {
  const res = await fetch(`${url}/${id}`);
  let deleteUser = await res.json();
  console.log(deleteUser);
  document.getElementById("deleteId").value = deleteUser.id;
  document.getElementById("deleteFirstname").value = deleteUser.firstname;
  document.getElementById("deleteLastname").value = deleteUser.lastname;
  document.getElementById("deleteAge").value = deleteUser.age;
  document.getElementById("deleteUsername").value = deleteUser.username;

  $("#deleteRoles").empty();
  let selectDel = document.getElementById('deleteRoles');
  let allRoles = await getAllRoles();

  allRoles.forEach((role) => {
    let option = document.createElement('option');
    option.setAttribute('value', JSON.stringify(role));
    option.setAttribute('name', role.role);
    deleteUser.roles.forEach(userRole => {
      if (userRole.role == role.role) {
        option.setAttribute('selected', true);
      }
    });
    option.appendChild(document.createTextNode(role.noPrefix));
    selectDel.appendChild(option);
  });
}

async function deleteUser() {
  let deleteUserID = document.getElementById('deleteId').value;
  // console.log(deleteUserID);
  const res = await fetch(`${url}/${deleteUserID}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });
  console.log(res);
  if (res.ok) {
    document.getElementById(`user${deleteUserID}`).remove();
  }
}