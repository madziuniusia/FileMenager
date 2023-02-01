document.getElementById("newFolder").addEventListener("click", () => {
  document.getElementById("dialog1").showModal();
});
document.getElementById("cancelFolder").addEventListener("click", () => {
  document.getElementById("dialog1").close();
});

document.getElementById("newFile").addEventListener("click", () => {
  document.getElementById("dialog2").showModal();
});
document.getElementById("cancelFile").addEventListener("click", () => {
  document.getElementById("dialog2").close();
});

document.getElementById("newName").addEventListener("click", () => {
  document.getElementById("dialog3").showModal();
});
document.getElementById("cancelName").addEventListener("click", () => {
  document.getElementById("dialog3").close();
});
