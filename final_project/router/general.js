const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get("/",  function (req, res) {
//   //Write your code here
//    res.send(JSON.stringify(books, null, 4));
//   return res.status(300).json({ message: "getting all the books" });
// });

public_users.get("/", async function (req, res) {
  return new Promise((resolve, reject) => {
    if (books.length > 0) {
      resolve(JSON.stringify(books, null, 4));
    } else {
      reject(new Error("No books found"));
    }
  })
    .then(res.send(JSON.stringify(books, null, 4)))
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const data = await books[isbn];
  res.send(data);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const result = [];

  for (const key in books) {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  }
  res.send(result);
});

// Get all books based on title
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const result = [];

    for (const key in books) {
      if (books[key].author === author) {
        result.push(books[key]);
      }
    }
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = await books[isbn];
  res.send(review);
});

module.exports.general = public_users;
