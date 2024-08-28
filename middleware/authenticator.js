const axios = require("axios");

const authenticator = async (req, res, next) => {
  try {
    const response = await axios.get(
      `${process.env.AUTH_API_URL}/validate-token`,
      { headers: { authorization: req.headers.authorization } }
    );
    req.user_id = response.data.user_id;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Route requires authentication" });
  }
};

module.exports = { authenticator };
