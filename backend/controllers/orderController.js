const supabase = require("../config/supabase");

exports.createOrder = async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([req.body])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json(data);
};

exports.getOrders = async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};