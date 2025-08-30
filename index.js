import express from "express";
import cors from "cors";

// to load any variables present in .env files
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Loading express.json() into app
// express.json() is used to convert json into valid JavaScript Object
app.use(express.json());

app.use(cors());

const TODO_ITEMS = [
  {
    id: 1,
    emoji: "🏋️",
    todo: "Gym Workout",
    priority: "high",
    isDone: false,
    createdAt: "2025-08-20T07:00:00Z",
  },
  {
    id: 2,
    emoji: "🧘",
    todo: "Meditation for 20 mins",
    priority: "medium",
    isDone: false,
    createdAt: "2025-08-21T06:30:00Z",
  },
  {
    id: 3,
    emoji: "☕",
    todo: "Morning Coffee",
    priority: "low",
    isDone: false,
    createdAt: "2025-08-22T08:15:00Z",
  },
];

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

// To get all the Items
app.get("/todos", (req, res) => {
  res.json({
    success: true,
    data: TODO_ITEMS,
    message: "Data fetched successfullly",
  });
});

app.post("/todos", (req, res) => {
  const { todo, priority, isDone, emoji } = req.body;
  const newToDo = {
    id: TODO_ITEMS[TODO_ITEMS.length - 1].id + 1,
    todo: todo,
    priority: priority,
    isDone: isDone,
    createdAt: new Date().toISOString(),
    emoji: emoji,
  };

  TODO_ITEMS.push(newToDo);

  res.json({
    success: true,
    data: TODO_ITEMS,
    message: "Data added successfullly",
  });
});

// To search items by name and priority
// as :id is dynamic, we have to write search method before :id
app.get("/todos/search", (req, res) => {
  const { todo, priority } = req.query;
  const filteredItem = TODO_ITEMS.filter((itemObj) => {
    return (
      itemObj.todo.toLowerCase().includes(todo) &&
      itemObj.priority.toLowerCase() === priority.toLowerCase()
    );
  });
  console.log(filteredItem);

  // .filter() always returns an array
  // array is always truthy even if it is empty []
  // compare it  with length

  if (filteredItem.length > 0) {
    res.json({
      success: true,
      data: filteredItem,
      message: "Data fetched successfully",
    });
  } else {
    res.json({
      success: false,
      message: "Item not found",
    });
  }
});

// To get only one Item by id
// : make id dynamic
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const data = TODO_ITEMS.find((itemObj) => Number(itemObj.id) === Number(id));
  console.log(data);
  if (data) {
    res.json({
      success: true,
      data: data,
      message: "Item fetched successfullly",
    });
  } else {
    res.json({
      success: false,
      message: "Data not found",
    });
  }
});

// To delete only one Item at specific index with the help of id
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = TODO_ITEMS.findIndex((itemObj) => {
    return Number(itemObj.id) === Number(id);
  });
  if (index === -1) {
    res.json({
      success: false,
      message: "Data not found",
    });
  } else {
    TODO_ITEMS.splice(index, 1);
    res.json({ success: true, message: "Item deleted successfully" });
  }
});

app.patch("/todos/:id/status", (req, res) => {
  const { id } = req.params;
  const { isDone } = req.body;

  const index = TODO_ITEMS.findIndex((itemObj) => {
    return Number(itemObj.id) === Number(id);
  });
  if (index === -1) {
    return res.json({
      success: false,
      message: "Item not found",
    });
  }
  TODO_ITEMS[index].isDone = isDone;
  res.json({
    success: true,
    message: "Item updated successfully",
    data: TODO_ITEMS[index],
  });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;

  const index = TODO_ITEMS.findIndex((itemObj) => {
    return Number(itemObj.id) === Number(id);
  });

  if (index === -1) {
    return res.json({
      success: false,
      message: "Item not found",
    });
  }

  const { todo, isDone, priority } = req.body;

  const newObj = {
    todo: todo,
    isDone: isDone,
    priority: priority,
    id: TODO_ITEMS[index].id,
    createdAt: TODO_ITEMS[index].createdAt,
  };
  TODO_ITEMS[index] = newObj;

  res.json({
    success: true,
    data: TODO_ITEMS[index],
    message: "Item updated successfully",
  });
  console.log(TODO_ITEMS[index]);
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
