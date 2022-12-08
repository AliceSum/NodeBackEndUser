const handleLogout = async (req, res) => {
  //On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //Send No content for logout

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  } //204 No content

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  // secure: true - only serves on https
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204); //Send no content
};
export default handleLogout;
