import {createHash, generateToken, isValidPassword} from "../utils.js"
import { findByEmailService, registerService, nonSensitiveService,updateRolService,recoverPassService,recoverPassInfoService, setNewPassService, LastConnectionService,uploadedFilesService,allUsersService, cleanUsersService,deleteUserService, findByIDService } from "../services/user.services.js"
import CustomErrors from "../middlewares/errors/CustomErrors.js"
import { EErrors } from "../config/enumns.js"

const cleanUsers = async (req, res)=>{
    try {
        const result = await cleanUsersService()
        return res.sendSuccess(result)
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const deleteUser = async (req, res)=>{
    try {
        const {uid} = req.params;
        const result = await deleteUserService(uid)
        return res.sendSuccess(result)
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const allUsers = async (req, res)=>{
    try {
        const result = await allUsersService()
        return res.sendSuccess(result)
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}


const uploadedFiles = async (req, res) =>{
    try {
        const {uid} = req.params;
        const user = await findByIDService(uid)
        const file = req.body

        const filename = req.file.filename;
        if(!filename) return res.status(500).send({status: 'error', error: 'no se pude subir el archivo'});
        

        if(!file.name){
            return res.status(400).send({status: 'error', error: 'valores incompletos'});
        }

        file.reference = `https://entregable.up.railway.app/uploads/documents/${filename}`;

        const existingDocument = user.documents.find(doc => doc.name === file.name);
        if(existingDocument) {
            return res.status(400).send({status: 'error', error: 'Ya existe un documento con el mismo nombre'});
        }

        const result = await uploadedFilesService(uid, file)
        return res.sendSuccess(result)
        
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const updateRol = async (req, res) =>{
    try {
        const {uid} = req.params;
        const user = await findByIDService(uid)
        
        const documentNames = user.documents.map(doc => doc.name);

        if (documentNames.includes('identificacion') && documentNames.includes('domicilio') && documentNames.includes('banco')) {
            const result = await updateRolService(uid);
            return res.sendSuccess(result);
        } else {
            throw CustomErrors.createError({
                name: "Error de Solicitud",
                cause: "Faltan cargar documentos para cambiar el rol",
                message: "Error al intentar cambiar el rol del usuario",
                code: EErrors.UNPROCESSABLE_ENTITY_ERROR
            });
        }

    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const changePass = async (req, res)=>{
    const email = req.body.email
    const newPass = req.body.newPass

    const user = await findByEmailService(email)
    if (isValidPassword(newPass, user.password) ) {
        return res.status(409).send({status: "error", message: "La nueva contraseña no puede ser igual a la anterior"})
    }

    try {
        const result = await setNewPassService(newPass, email)
        return res.status(200).send({ status: "success", message: "contraseña cambiada" });

    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }

    
}

const recoverPass = async (req, res) =>{
    const email = req.body.email
    
    const user = await recoverPassInfoService(email)
    
    if(!user){
        return res.status(404).send({status: "error", message: "No se encuentra el usuario"})
    }
    try {
        const result = await recoverPassService(user)
        return result
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const current = async  (req, res) => {
    try {
        const {email} = req.user
        
        const user = await nonSensitiveService(email)
        return res.sendSuccess(user)
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('coderCookieToken');
        res.redirect("/login");
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendServerError(error.message)
    }
}

const login = async  (req,res)=>{
    try {
        const {email, password} = req.body
        const user = await findByEmailService(email)
        if (!user || !isValidPassword(password, user.password) ) {
            req.logger.error("usuario no encontrado o contraseña incorrecta")
            throw CustomErrors.createError({
                name: "Error de Credenciales",
                cause: "usuario no encontrado o contraseña incorrecta",
                message: "Error al intentar iniciar sesion",
                code: EErrors.CREDENTIALS_ERROR
            })
            
        }
        delete user.password
        const accessToken = generateToken(user)
        await LastConnectionService(user._id)
        res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true }).send({ status: "success", message: "login success"})

    } catch (error) { 
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}
const register  = async  (req,res)=>{
    try {
        const user = req.body
        const {email, password} = req.body
        const userExist = await findByEmailService(email)
        if(userExist) {
            req.logger.error("Ya existe un usuario registrado con este correo electronico")
            throw CustomErrors.createError({
                name: "Usuario existente",
                cause: "Se intento registrar un usuario ya existente",
                message: "Ya existe un usuario registrado con este correo electronico",
                code: EErrors.CONFLICT_ERROR
            })
            
        }
        await registerService(user, email, password)
        const userCreated = await findByEmailService(email)
        await LastConnectionService(userCreated._id)
        res.status(201).send({status: 'success', message: 'Usuario Registrado'}) 
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

export {

    current,
    logout,
    login,
    register,
    updateRol,
    recoverPass,
    changePass,
    uploadedFiles,
    allUsers,
    cleanUsers,
    deleteUser
}