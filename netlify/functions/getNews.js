const axios = require('axios');

exports.handler = async (event) => {
  try {
    const API_KEY = process.env.GNEWS_API_KEY;
    const { category = 'general', search = '' } =
      event.queryStringParameters || {};

    let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=ca&apikey=${API_KEY}`;

    if (search) {
      url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        search
      )}&lang=en&country=ca&apikey=${API_KEY}`;
    }

    const response = await axios.get(url);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Function error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
