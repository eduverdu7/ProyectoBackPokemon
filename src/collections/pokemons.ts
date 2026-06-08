// Eduardo Verdu
import { getDB } from "../db/mongo";
import { Pokemon,PokemonType, Trainer } from "../types";
import { POKEMONS_COLLECTION } from "../utils";
import { ObjectId } from "mongodb";

export const pokemons = async(page?:number,size?:number)=>{
    page=page || 1;
    size = size || 10;
    const db = getDB();

    return await db.collection<Pokemon>(POKEMONS_COLLECTION).find().skip((page-1)*size).limit(size).toArray();

}
export const pokemonById = async (id:string) =>{
    const db = getDB();
    const pokemon = await db.collection<Pokemon>(POKEMONS_COLLECTION).findOne({_id:new ObjectId(id)})
    if(!pokemon) return null;
    return pokemon;
}

export const createPokemon = async (trainer:Trainer,
    name: string,
    description: string,
    height: number,
    weight: number,
    types: PokemonType[]) => {

    const db= getDB();
    if(!trainer) throw new Error ("Entrenador no autenticado ")
    const data: Pokemon = { name, description, height, weight, types };
    const res = await db.collection<Pokemon>(POKEMONS_COLLECTION).insertOne(data);
    return await db.collection<Pokemon>(POKEMONS_COLLECTION).findOne({_id:res.insertedId})
  
};