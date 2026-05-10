const bcrypt = require("bcryptjs");

const hash = "$2b$10$Y2V9w2cfbbu5GvFKy67k0.KyAvbVi7FvCCZPBLghCr.2nUcVZi1Q2";
const password = "admin123";

async function main() {
  const isValid = await bcrypt.compare(password, hash);
  console.log({ isValid });
}

main();
