const { create, authenticate, find } = require("../services/users");

const handleSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await find({ email });

    if (user) {
      throw new Error("Email already exists!");
    }
    const newUser = await create({ name, email, password });

    res.status(201).json({ newUser });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await find({ email });

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const userData = await authenticate({ email, password });
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleSignup,
  handleLogin,
};
