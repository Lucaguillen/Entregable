import dotenv from "dotenv"


dotenv.config()



const config = {
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPass: process.env.ADMIN_PASSWORD
}

export default config