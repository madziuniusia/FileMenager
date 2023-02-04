window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("img");

  function Setfilter(filter) {
    switch (filter) {
      case "none":
        ctx.filter = `none`;
        break;
      case "blur":
        ctx.filter = `blur(5px)`;
        break;
      case "sepia":
        ctx.filter = `sepia(100%)`;
        break;
      case "hue-rotate":
        ctx.filter = `hue-rotate(90deg)`;
        break;
      case "contrastBrightness":
        ctx.filter = `contrast(200%) brightness(150%)`;
        break;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  Setfilter("none");
  document
    .getElementById("none")
    .addEventListener("click", () => Setfilter("none"));
  document
    .getElementById("blur")
    .addEventListener("click", () => Setfilter("blur"));
  document
    .getElementById("sepia")
    .addEventListener("click", () => Setfilter("sepia"));
  document
    .getElementById("hue-rotate")
    .addEventListener("click", () => Setfilter("hue-rotate"));
  document
    .getElementById("contrastBrightness")
    .addEventListener("click", () => Setfilter("contrastBrightness"));

  document.getElementById("SaveFilter").addEventListener("click", function () {
    const body = {
      path: document.getElementById("name").value,
      content: canvas.toDataURL(),
    };
    fetch("/SaveImg", {
      method: "put",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).then((res) => alert("Save img"));
  });

  document.getElementById("filter").addEventListener("click", function () {
    document
      .getElementById("filtersUnisible")
      .classList.toggle("filterVisible");
  });
});
