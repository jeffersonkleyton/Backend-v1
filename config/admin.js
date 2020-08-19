module.exports = middleware => {
    return (require, response, next) => {
        if(require.user.admin) {
            middleware(require, response, next)
        }else{
            response.status(402).send('Usuário não é administrador')
        }
    }  
}