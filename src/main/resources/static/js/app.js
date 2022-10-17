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

// draw table row
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
        <button onclick="showUserForm(${id}, 'edit')" type="button" class="btn btn-info btn-sm" data-toggle="modal" 
            data-whatever="${id}" data-target="#editModal">Edit</button>
      </td>
      <td>
        <button onclick="showUserForm(${id}, 'delete')" type="button" class="btn btn-danger btn-sm" data-toggle="modal" 
            data-whatever="${id}" data-target="#deleteModal">Delete</button>
      </td>
    </tr>
  `);
}

// update table row
function updateUserToHTML({id, firstname, lastname, age, username, stringFromRoles}) {
  const userInfo = document.getElementById(`user${id}`);
  userInfo.cells[1].innerHTML = `${firstname}`;
  userInfo.cells[2].innerHTML = `${lastname}`;
  userInfo.cells[3].innerHTML = `${age}`;
  userInfo.cells[4].innerHTML = `${username}`;
  userInfo.cells[5].innerHTML = `${stringFromRoles}`;
}

// new user form
async function showNewModal() {
  document.getElementById("newFirstname").value = '';
  document.getElementById("newLastname").value = '';
  document.getElementById("newAge").value = '';
  document.getElementById("newUsername").value = '';
  document.getElementById("newPassword").value = '';

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

// edit user form and delete user form
async function showUserForm(id, form) {
  const res = await fetch(`${url}/${id}`);
  const user = await res.json();

  document.getElementById(`${form}Id`).value = user.id;
  document.getElementById(`${form}Firstname`).value = user.firstname;
  document.getElementById(`${form}Lastname`).value = user.lastname;
  document.getElementById(`${form}Age`).value = user.age;
  document.getElementById(`${form}Username`).value = user.username;
  if (form == 'edit') {
    document.getElementById(`${form}Password`).value = user.password;
  }

  $(`#${form}Roles`).empty();
  let select = document.getElementById(`${form}Roles`);
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
    select.appendChild(option);
  });
}

function getUserFromUserForm(formType) {
  let form = document.getElementById(`${formType}Form`);
  let formData = new FormData(form);
  let rolesForm = document.getElementById(`${formType}Roles`);
  // console.log(rolesForm);
  let rolesSelected = Array.from(rolesForm.options)
      .filter(option => option.selected)
      .map(option => JSON.parse(option.value));

  let user = {
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    age: formData.get('age'),
    username: formData.get('username'),
    password: formData.get('password'),
    roles: rolesSelected
  }

  if (formType == 'edit') {
    user.id = formData.get('id');
  }

  return user;
}

// create new user
async function newUser() {
  const user = getUserFromUserForm('new');
  if (user.username) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(user)
    });

    const newUser = await res.json();
    userToHTML(newUser);
  }

  $('#nav-users-table-tab').tab('show');
}

// edit user
async function editUser() {
  const user = getUserFromUserForm('edit');

  const res = await fetch(`${url}/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(user)
  });

  const data = await res.json();
  if (data) {
    updateUserToHTML(data);
  }
}

// delete user
async function deleteUser() {
  const deleteUserID = document.getElementById('deleteId').value;

  const res = await fetch(`${url}/${deleteUserID}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });

  if (res.ok) {
    document.getElementById(`user${deleteUserID}`).remove();
  }
}