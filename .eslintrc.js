// .eslintrc.js
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // <-- ¡Añade 'prettier' al final!
  ],
  plugins: ["@typescript-eslint/eslint-plugin"],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Puedes añadir reglas personalizadas aquí si lo necesitas
  },
};
