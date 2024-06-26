import chalk from 'chalk'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import initApp from './src/index.router.js'
import schedule from 'node-schedule'
import cors from 'cors'
global.cloudinaryFolder = "/E-Commerce"
const app = express()
app.use(cors())
app.get('/',(req,res)=>{
    res.send("welcome to E-Commerce")
})
// setup port and the baseUrl
const port = process.env.PORT || 5000
initApp(app, express)
app.listen(port, () => console.log(chalk.red(`Example app listening on port `) + chalk.yellow(`${port}!`)))
