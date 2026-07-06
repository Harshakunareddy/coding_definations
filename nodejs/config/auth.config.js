module.exports = {
    JWT_SECRET : process.env.JWT_SECRET || "A_secret_key_ozrit",
    JWT_EXPIRE : '7d',
    BCRYPT_SALT_ROUNDS : 10,
}