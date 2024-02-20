const axios = require("axios");

const OPENCAGE_URL = "https://api.opencagedata.com/geocode/v1/json?q=";

console.log(process.env.KEY_OPENCAGE, "process.env.KEY_OPENCAGE");

const addressDetail = async (req, res, next) => {
  try {
    const detail = req.body.detail;

    if (!detail) {
      return next();
    }
    const response = await axios.get(
      `${OPENCAGE_URL}${encodeURIComponent(address)}&key=${
        process.env.KEY_OPENCAGE
      }`
    );

    const location = response.data?.results[0]?.geometry;

    req.body.latitude = location.lat;
    req.body.longitude = location.lng;

    next();
  } catch (error) {
    res.status(500).send({
      message: "Please input valid address",
      errors: error.message,
    });
  }
};

const routeDetail = async (req, res, next) => {
  try {
    const direction_detail = req.body.direction_detail;
    const current_detail = req.body.current_detail;

    if (!direction_detail || !current_detail) {
      return next();
    }

    const responseDirection = await axios.get(
      `${OPENCAGE_URL}${encodeURIComponent(direction_detail)}&key=${
        process.env.KEY_OPENCAGE
      }`
    );

    const responseCurrent = await axios.get(
      `${OPENCAGE_URL}${encodeURIComponent(direction_detail)}&key=${
        process.env.KEY_OPENCAGE
      }`
    );

    const locationCurrent = responseCurrent.data?.results[0]?.geometry;
    req.body.latitudeCurrent = locationCurrent.lat;
    req.body.longitudeCurrent = locationCurrent.lng;

    const locationDirection = responseDirection.data?.results[0]?.geometry;
    req.body.latitudeDirection = locationDirection.lat;
    req.body.longitudeDirection = locationDirection.lng;

    next();
  } catch (error) {
    res.status(500).send({
      message: "Please input valid address",
      errors: error.message,
    });
  }
};

module.exports = { addressDetail, routeDetail };
