module.exports = (app) => {
  function existeOuErro(valor, mensagem) {
    if(!valor) throw mensagem
    if(Array.isArray(valor) && valor.length === 0) throw mensagem
    if(typeof valor === 'string' && !valor.trim()) throw mensagem
  }

  function naoExisteOuErro(valor, mensagem) {
    try {
        existeOuErro(valor, mensagem)
    } catch (mensagem) {
        return
    }
    throw mensagem
  }

  function igualOuErro(valorA, valorB, mensagem) {
    if (valorA !== valorB) throw mensagem;
  }
  return { existeOuErro, naoExisteOuErro, igualOuErro };
}