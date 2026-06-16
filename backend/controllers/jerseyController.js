const supabase = require("../config/supabase");

exports.getJerseys = async (req, res) => {
  const { data, error } = await supabase
    .from("jerseys")
    .select("*");

  console.log(data);
  console.log(error);

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};

exports.createJersey = async (req, res) => {
  const { data, error } = await supabase
    .from("jerseys")
    .insert([req.body])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json(data);
};

exports.updateJersey = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("jerseys")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ success: false, message: "Jersey not found" });
  }

  res.json(data);
};

exports.deleteJersey = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("jerseys")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ success: false, message: "Jersey not found" });
  }

  res.json({ success: true, message: "Jersey deleted" });
};

exports.getTeams = async (req, res) => {
  const { data, error } = await supabase
    .from("jerseys")
 .select("*")

 console.log(data);
console.log(error);

  if (error) {
    return res.status(500).json(error);
  }

  const teams = [...new Set(data.map(j => j.team))];

  res.json(teams);
};