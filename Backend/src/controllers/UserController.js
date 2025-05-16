const { response, request } = require('express')
const connection = require('../config/db')

exports.CreateUser = (req, res) => {
    const { userEmail, userPassword, userName, userPicture } = request.body

    if (!userEmail && !userPassword && !userName && !userPicture){
        response.status(400).json({
            succes: false,
            message: "Todos os campos devem ser preenchidos!",
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


exports.loginUser = (req, res) => {
    const { userEmail, userPassword, userName} = request.body

    if (!userEmail || !userName && !userPassword){
        response.status(400).json({
            succes: false,
            message: "Todos os campos devem ser preenchidos!",
            data: err
        })
    }

    const params = Array(userEmail, userPassword, userName)
    const query = `
        INSERT INTO Users(email, password, name) WHERE email OR name = ? and password = ?
    `
    if (err){
        response.status(500).json({
            succes: false,
            message: "Erro ao cadastrar usuário",
            data: err
        })
    } 
    //Conditional for check if exists the user
    if (result.lenght > 0) {
        response.status(200).json({
            succes: true,
            message: "Login realizado com suceso!",
            data: succes
        })
    }
    else{
        response.status(400).json({
            succes: false,
            message: "Algum campo está incorreto!",
            data: err
        })
    }   
}