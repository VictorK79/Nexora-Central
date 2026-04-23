const users = [];

const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
}
const saveUser = (novoUsuario) => {
  const users = getUsers()
  users.push(novoUsuario)
  localStorage.setItem('users', JSON.stringify(users))
}
const findUser = (email, senha) => {
  return getUsers().find(u => u.email === email && u.senha === senha)
}

