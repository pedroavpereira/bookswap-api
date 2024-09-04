const axios = require("axios");

const mailer = async ({ user_id, title }) => {
  try {
    const response = await axios.get(
      `${process.env.MAILER_API_URL}/?user_id=${user_id}&title=${title}`,
      { headers: { authorization: req.headers.authorization } }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = { mailer };
