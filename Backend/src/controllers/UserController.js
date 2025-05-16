const { response } = require('express')
const connection = require('../config/db')

exports.CreateUser = (req, res) => {
    const { userEmail, userPassword, userName, userPicture } = request.body

    if (!userEmail || !!userPassword || !userName || !userPicture){
        response.status(400).json({
            succes: false,
            message: "Preencha todos os campos para concluir o cadastro!",
            data: err
        })

    }

    const params = Array(userEmail, userPassword, userName, userPicture)
    const queryUser = `
        INSERT INTO Users(email, password, name, picture) values(?, ?, ?, ?)
    `
    connection.query(queryUser, params, (err, result) => {
        if (err){ 
            response.status(500).json({ //Internal Server Error
                succes: false,
                message: "Erro ao cadastrar usuário",
                data: err
            })
        } else{
            response.status(200).json({
                success: true,
                message: "Usuário cadastrado com sucesso",
                data: result
            })
        }

    })
};


