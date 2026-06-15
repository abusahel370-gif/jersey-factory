const supabase = require("../config/supabase");

exports.createCustomRequest = async (req, res) => {
  const { data, error } = await supabase
    .from("custom_requests")
    .insert([req.body])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json(data);
};

exports.getCustomRequests = async (req, res) => {
  const { data, error } = await supabase
    .from("custom_requests")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};