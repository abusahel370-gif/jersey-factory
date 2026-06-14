const supabase = require("../config/supabase");

exports.getJerseys = async (req, res) => {
  const { data, error } = await supabase
    .from("jerseys")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};