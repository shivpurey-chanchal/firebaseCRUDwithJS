//modal-wrappper
const modalWrapper = document.querySelector(".modal-wrappper");
//add modal
const addModal = document.querySelector(".add-modal");
const addModalForm = document.querySelector(".add-modal .form");
//edit modal
const editModal = document.querySelector(".edit-modal");
const editModalForm = document.querySelector(".edit-modal .form");

const btnAdd = document.querySelector(".btn-add");
const tableUser = document.querySelector(".table-users");
let id;
// create element and render user
const renderElement = (doc) => {
  const tr = `<tr data-id='${doc.id}'>
<td>${doc.data().firstName}</td>
<td>${doc.data().lastName}</td>
<td>${doc.data().phone}</td>
<td>${doc.data().email}</td>
<td>
    <button class="btn btn-edit">Edit</button>
    <button class="btn btn-delete">Delete</button>
</td>
</tr>`;
  tableUser.insertAdjacentHTML("beforeend", tr);
  //click edit btn
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener("click", () => {
    editModal.classList.add("modal-show");
    id = doc.id;
    editModalForm.firstName.value = doc.data().firstName;
    editModalForm.lastName.value = doc.data().lastName;
    editModalForm.phone.value = doc.data().phone;
    editModalForm.email.value = doc.data().email;
  });
  //click delete btn
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener("click", () => {
    db.collection("users")
      .doc(`${doc.id}`)
      .delete()
      .then(() => {
        console.log("delete...successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
//click add user Btn
btnAdd.addEventListener("click", () => {
  addModal.classList.add("modal-show");
  addModalForm.firstName.value = "";
  addModalForm.lastName.value = "";
  addModalForm.phone.value = "";
  addModalForm.email.value = "";
});
//user click outside of modal
window.addEventListener("click", (e) => {
  if (e.target === addModal) {
    addModal.classList.remove("modal-show");
  }
  if (e.target === editModal) {
    editModal.classList.remove("modal-show");
  }
});
// get all users
// db.collection("users")
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       renderElement(doc);
//     });
//   });
//Real time data
db.collection("users").onSnapshot((snapShot) => {
  snapShot.docChanges().forEach((change) => {
    // console.log(change.type);
    if (change.type === "added") {
      renderElement(change.doc);
    }
    if (change.type === "removed") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUser.removeChild(tbody);
    }
    if (change.type === "modified") {
        let tr = document.querySelector(`[data-id='${change.doc.id}']`);
        let tbody = tr.parentElement;
        tableUser.removeChild(tbody);
        renderElement(change.doc);

      }
  });
});
//click submit and add data
addModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("users").add({
    firstName: addModalForm.firstName.value,
    lastName: addModalForm.lastName.value,
    phone: addModalForm.phone.value,
    email: addModalForm.email.value,
  });
  modalWrapper.classList.remove("modal-show");
});

//click submit in edit modal
editModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("users").doc(id).update({
    firstName: editModalForm.firstName.value,
    lastName: editModalForm.lastName.value,
    phone: editModalForm.phone.value,
    email: editModalForm.email.value,
  });
  editModal.classList.remove("modal-show");
});
