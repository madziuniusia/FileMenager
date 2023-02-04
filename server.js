const express = require("express");
const hbs = require("express-handlebars");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { send } = require("process");
const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs({
    extname: ".hbs",
    partialsDir: "views/partials",
    defaultLayout: "main.hbs",
    helpers: {
      img: function (x) {
        switch (x) {
          case "png":
            return `<img src="img/png.png" alt="png">`;
          case "jpg":
            return `<img src="img/jpg.png" alt="jpg">`;
          case "doc":
            return `<img src="img/doc.png" alt="doc">`;
          case "js":
            return `<img src="img/js.png" alt="js">`;
          case "mp3":
            return `<img src="img/mp3.png" alt="mp3">`;
          case "mp4":
            return `<img src="img/mp4.png" alt="mp4">`;
          case "pdf":
            return `<img src="img/pdf.png" alt="pdf">`;
          case "txt":
            return `<img src="img/txt.png" alt="txt">`;
          case "zip":
            return `<img src="img/zip.png" alt="zip">`;
          case "folder":
            return `<img src="img/folder.png" alt="folder">`;
          case "tml":
            return `<img src="img/html.png" alt="html">`;
          case "css":
            return `<img src="img/css.png" alt="css">`;
          case ".js":
            return `<img src="img/js.png" alt="js">`;
          case "xml":
            return `<img src="img/xml.png" alt="xml">`;
          default:
            return `<img src="img/default.png" alt="default">`;
        }
      },
    },
  })
);
app.set("view engine", "hbs");
app.use(express.json());

app.use(express.static(path.join(__dirname, "static")));

let PathNow = "";

app.get("/", (req, res) => {
  const context = {
    folders: [],
    files: [],
    where: [],
    path: "",
  };
  context.path = req.query.name ?? "";
  PathNow = context.path;
  let lastPath = "";
  context.where = context.path.split(path.sep).map((name) => {
    lastPath = path.join(lastPath, name);
    return { name, path: lastPath };
  });

  fs.readdir(path.join(__dirname, "upload", context.path), (err, files) => {
    files.forEach((element) => {
      fs.lstat(
        path.join(__dirname, "upload", context.path, element),
        (err, stats) => {
          if (stats.isDirectory()) {
            context.folders.push({
              name: element,
              path: path.join(context.path, element),
            });
          } else {
            context.files.push({
              name: element,
              ext: element.slice(-3),
              path: path.join(context.path, element),
            });
          }
          context.folders.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          context.files.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
        }
      );
    });
  });
  res.render("index.hbs", context);
});

app.get("/createFolder", (req, res) => {
  function name() {
    if (
      fs.existsSync(
        path.join(__dirname, "upload", PathNow, `${req.query.name}`)
      )
    ) {
      if (`${req.query.name}` == "") {
        return `${new Date().getMilliseconds()}` + " - Nowy Folder";
      } else {
        return `${new Date().getMilliseconds()}` + `${req.query.name}`;
      }
    } else {
      if (`${req.query.name}` == "") {
        return "Nowy Folder";
      } else {
        return `${req.query.name}`;
      }
    }
  }
  fs.mkdir(path.join(__dirname, "upload", PathNow, name()), (err) => {});
  res.redirect(`/?name=${PathNow}`);
});

function nameFile(dane) {
  if (fs.existsSync(path.join(__dirname, "upload", `${dane}`))) {
    if (`${dane}` == "") {
      return `${new Date().getMilliseconds()}` + " - Nowy.txt";
    } else {
      return `${new Date().getMilliseconds()}` + " - " + `${dane}`;
    }
  } else {
    if (`${dane}` == "") {
      return "Nowy.txt";
    } else {
      return `${dane}`;
    }
  }
}

function whatWrite(ext) {
  switch (ext) {
    case "txt":
      return `${new Date().getMilliseconds()}`;
    case "css":
      return `
* {
  margin: 0;
  padding: 0;
}
      `;
    case "js":
      return 'console.log("lubie Alikacje Serwerowe")';
    case "json":
      return `{"lube": "aplikacje serwerowe"}`;
    case "html":
      return `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <p>CO TAM, JESTEM HTML</p>
  </body>
</html>`;
    case "xml":
      return ` TUTAJ POWINNO BYC COS Z XML, ALE GO NIE OGARNIAM`;
    default:
      return `${new Date().getMilliseconds()}`;
  }
}

app.get("/createFile", (req, res) => {
  let extArr = req.query.name.split(".");
  let ext = extArr[extArr.length - 1];

  if (
    !fs.existsSync(
      path.join(__dirname, "upload", PathNow, nameFile(req.query.name))
    )
  ) {
    fs.writeFile(
      path.join(__dirname, "upload", PathNow, nameFile(req.query.name)),
      "",
      (err) => {}
    );
    fs.appendFile(
      path.join(__dirname, "upload", PathNow, nameFile(req.query.name)),
      whatWrite(ext),
      (err) => {
        res.redirect(`/?name=${PathNow}`);
      }
    );
  }
});

app.post("/handleUpload", (req, res) => {
  let form = formidable({});

  form.uploadDir = path.join(__dirname, "upload", PathNow);
  form.keepExtensions = true;
  form.multiples = true;

  form.on("file", (field, file) => {
    fs.rename(`${file.path}`, form.uploadDir + "/" + file.name, () => {});
  });

  form.parse(req, function (err, fields, files) {
    res.redirect(`/?name=${PathNow}`);
  });
});
app.get("/Text/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "upload", PathNow, req.params.name));
});

app.get("/show/:name", (req, res) => {
  let extArr = req.params.name.split(".");
  let ext = extArr[extArr.length - 1];

  if (ext == "png" || ext == "jpg" || ext == "jpeg") {
    const contextImg = {
      name: req.params.name,
      root: PathNow,
      img: `/Text${PathNow}${req.params.name}`,
    };
    res.render("image.hbs", contextImg);
  } else {
    const context = {
      text: "",
      name: req.params.name,
      root: PathNow,
    };
    fs.readFile(
      path.join(__dirname, "upload", PathNow, req.params.name),
      (err, data) => {
        context.text = data;
        res.render("edytor.hbs", context);
      }
    );
  }
});

app.get("/write", (req, res) => {
  const filePath = path.join(
    __dirname,
    "upload",
    `${req.query.root}`,
    `${req.query.name}`
  );
  fs.writeFile(filePath, req.query.content, (err) => {
    if (err) console.log(err);
    res.redirect(`/?name=${req.query.root}`);
  });
});

app.get("/newNameFile", (req, res) => {
  const root = req.query.root;
  const oldPath = path.join(__dirname, "upload", root, req.query.oldName);
  const newPath = path.join(__dirname, "upload", root, req.query.name);

  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, (err) => {
      res.redirect(`/?name=${root}`);
    });
  } else {
    res.redirect(`/?name=${root}`);
  }
});

app.get("/theme", (req, res) => {
  fs.readFile(path.join(__dirname, "config", "themes.json"), (err, data) => {
    res.send(JSON.parse(data.toString()));
  });
});

app.get("/settings", (req, res) => {
  fs.readFile(path.join(__dirname, "config", "settings.json"), (err, data) => {
    res.send(JSON.parse(data.toString()));
  });
});

app.put("/JsonFile", (req, res) => {
  if (!req.body.theme || !req.body.fontSize) {
    res.end();
    return;
  }

  fs.writeFile(
    path.join(__dirname, "config", "settings.json"),
    JSON.stringify(req.body),
    (err) => {
      res.end();
    }
  );
});

app.put("/SaveImg", (req, res) => {
  const imgPath = path.join(__dirname, "upload", req.body.path);
  const content = req.body.content.slice(req.body.content.indexOf(",") + 1);

  const buffer = Buffer.from(content, "base64");
  fs.writeFileSync(imgPath, buffer, (err) => {});
  res.send({ msg: "Save img" });
});

app.get("/deleteFolder/:name", (req, res) => {
  fs.rmSync(
    path.join(__dirname, "upload", PathNow, req.params.name),
    { recursive: true, force: true },
    (err) => {}
  );
  res.redirect(`/?name=${PathNow}`);
});

app.get("/newName", (req, res) => {
  let tab = PathNow.split("\\");
  tab.pop();
  let PathNowMinus = tab.join("\\");
  PathNowMinus = PathNowMinus + "\\" + req.query.name;

  fs.rename(
    path.join(__dirname, "upload", PathNow),
    path.join(__dirname, "upload", PathNowMinus),
    (err) => {
      PathNow = PathNowMinus;
      res.redirect(`/?name=${PathNow}`);
    }
  );
});

app.get("/deleteFile/:name", (req, res) => {
  fs.unlink(
    path.join(__dirname, "upload", PathNow, req.params.name),
    (err) => {}
  );
  res.redirect(`/?name=${PathNow}`);
});

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
