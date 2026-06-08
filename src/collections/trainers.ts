// Eduardo Verdu
import { getDB } from "../db/mongo"
import bcrypt from "bcryptjs";
import { TRAINER_COLLECTION } from "../utils";
import { ObjectId } from "mongodb";

export const createUser = async(name:string,password:string)=>{
    const db = getDB();
    const passEncripta = await bcrypt.hash(password,10);
    const yaExiste= await db.collection(TRAINER_COLLECTION).findOne({name:name})
    if(yaExiste) throw new Error("El entrenador ya existe con ese nombre");
    const result = await db.collection(TRAINER_COLLECTION).insertOne({
        name,
        password: passEncripta,
        pokemons:[]
    });
    return result.insertedId.toString()

}
export const validateUser =async (name:string, password:string) =>{
    const db = getDB();
    const user = await db.collection(TRAINER_COLLECTION).findOne({name});
    if(!user)return null;
    const comparamosContraseñas = await bcrypt.compare(password,user.password);
    if(!comparamosContraseñas)return null; 
    return user; 
}
export const findUserById = async (id:string) => {
    const db = getDB();
    return await db.collection(TRAINER_COLLECTION).findOne({_id:new ObjectId(id)});
}