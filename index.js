require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let message = "";

const Filme = require("./models/filme");

app.get("/", async (req, res) => {

  const filmes = await Filme.findAll(); 

  res.render("index", {
    filmes, message
  });
});

app.get("/detalhes/:id", async (req, res) => { 
  const filme = await Filme.findByPk(req.params.id); 
  res.render("detalhes", {
    filme,
  });
});

app.get("/criar", (req, res) => {
  res.render("criar", {message});
});

app.post("/criar", async (req, res) => {
  const { filmes_nome, filmes_descricao, filmes_imagem } = req.body;

  if (!filmes_nome) {
    res.render("criar", {
      message: "Nome é obrigatório",
    });
  }

  else if (!filmes_imagem) {
    res.render("criar", {
      message: "Imagem é obrigatório",
    });
  }

  else {
    try {
      const filme = await Filme.create({
        nome,
        descricao,
        imagem,
      });

      res.redirect("/");
    } catch (err) {
      console.log(err);

      res.render("criar", {
        message: "Ocorreu um erro ao cadastrar o Filme!",
      });
    }
  }
});

app.get("/editar/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("editar", {
      filme,
      message: "Filme não encontrado!",
    });
  }

  res.render("editar", {
    filme, message
  });
});

app.post("/editar/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  const { nome, descricao, imagem } = req.body;

  filme.nome = nome;
  filme.descricao = descricao;
  filme.imagem = imagem;

  const filmeEditado = await filme.save();

  res.render("editar", {
    filme: filmeEditado,
    message: "Filme editado com sucesso!",
  });
});

app.get("/deletar/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("deletar", {
      filme,
      message: "Filme não encontrado!",
    });
  }

  res.render("deletar", {
    filme, message
  });
});

app.post("/deletar/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("deletar", {
      mensagem: "Filme não encontrado!",
    });
  }

  await filme.destroy();

  res.redirect("/");
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`))