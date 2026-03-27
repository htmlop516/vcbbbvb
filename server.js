const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let friendships = [];

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// регистрация
app.post("/register", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ message: "Введи ник" });
  }

  const id = users.length + 1;
  const code = generateCode();

  const user = { id, code, username };
  users.push(user);

  res.json(user);
});

// добавить друга (двусторонне!)
app.post("/add-friend", (req, res) => {
  const { userId, code } = req.body;

  const friend = users.find(u => u.code === code);

  if (!friend) {
    return res.json({ message: "Друг не найден" });
  }

  if (friend.id === userId) {
    return res.json({ message: "Нельзя добавить себя" });
  }

  const exists = friendships.find(
    f => f.userId === userId && f.friendId === friend.id
  );

  if (exists) {
    return res.json({ message: "Уже в друзьях" });
  }

  // ДВУСТОРОННЕ
  friendships.push({ userId, friendId: friend.id });
  friendships.push({ userId: friend.id, friendId: userId });

  res.json({ message: "Друг добавлен: " + friend.username });
});

// список друзей
app.get("/friends/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const friends = friendships
    .filter(f => f.userId === id)
    .map(f => users.find(u => u.id === f.friendId));

  res.json(friends);
});

// важно для Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер запущен на порту " + PORT);
});
