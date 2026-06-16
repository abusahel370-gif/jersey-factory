const supabase = require("../config/supabase");

const adminAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = header.split(" ")[1];

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || !roleData || roleData.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }

  req.user = user;
  next();
};

module.exports = adminAuth;
