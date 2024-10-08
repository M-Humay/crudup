
let editMode = false;
let editItem;
let editItemId;
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");


// * Form gönderildiğinde çalışacak fonksiyon
const addItem = (e) => {
  // Sayfanın yenilenmesini iptal et
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};

//  * Uyarı veren fonksiyon
const showAlert = (text, action) => {
  alert.textContent = ` ${text}`;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
// * Elemanları silen fonksiyon
const deleteItem = (e) => {
  // Silmek istenen elemana eriş
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  // Bu elemanı kaldır
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");
  console.log(itemList);
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};
// Elemanları güncelleyecek fonksiyon
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};
// * Varsayılan değerlere döndüren fonksiyon
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};
// * Sayfa yüklendiğinde elemanları render edecek fonksiyon
const renderItems = () => {
  let items = getFromLocalStorage();
  console.log(items);
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
};
// * Eleman oluşturan fonksiyon

const createElement = (id, value) => {
  // Yeni bir div oluştur
  const newDiv = document.createElement("div");
  // Bu div e attribute ekle
  newDiv.setAttribute("data-id", id);
  // Bu div e class ekle
  newDiv.classList.add("items-list-item");
  // Bu divin Html içeriğini belirle
  newDiv.innerHTML = `
           <p class="item-name">${value} </p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
  `;
  // Delete butonuna eriş
  const deleteBtn = newDiv.querySelector(".delete-btn");
  //   console.log(deleteBtn);
  deleteBtn.addEventListener("click", deleteItem);
  // Edit butonuna eriş
  const editBtn = newDiv.querySelector(".edit-btn");
  //   console.log(editBtn);
  editBtn.addEventListener("click", editItems);
  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
};
// * Sıfırlama yapan fonksiyon
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display = "none";
    showAlert("Liste Boş", "danger");
    // Localstorage ı temizle
    localStorage.removeItem("items");
  }
};
// * Localstorage a kayıt yapan fonksiyon
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};
// * Localstorage dan verileri alan fonksiyon
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};
// * Localstorage dan verileri kaldıran fonksiyon
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};
// * Localstorage ı güncelleyen fonksiyon
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

// ? Olay İzleyicileri
// * Formun gönderildiği anı yakala
form.addEventListener("submit", addItem);
// * Sayfanın  yüklendiği anı yakala
window.addEventListener("DOMContentLoaded", renderItems);
// Clear Button a tıklanınca elemanları sıfırlama
clearButton.addEventListener("click", clearItems);