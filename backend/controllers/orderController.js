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

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.json(data);
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