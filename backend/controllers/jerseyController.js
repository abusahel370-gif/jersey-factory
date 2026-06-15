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