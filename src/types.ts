// Eduardo Verdu
import { ObjectId } from "mongodb"
 export enum PokemonType {
        NORMAL,
        FIRE,
        WATER,
        ELECTRIC,
        GRASS,
        ICE,
        FIGHTING,
        POISON,
        GROUND,
        FLYING,
        PSYCHIC,
        BUG,
        ROCK,
        GHOST,
        DRAGON
     }
export type Trainer ={
    _id?: ObjectId,
    name: string,
    password:string,
    pokemons?:ObjectId[]
}
export type Pokemon ={
    _id?:ObjectId,
    name:string,
    description:string,
    height:number,
    weight:number,
    types: PokemonType[]
}
export type OwnedPokemon ={
    _id?:ObjectId,
    pokemon:ObjectId,
    nickname?:string,
    attack:number,
    defense: number,
    speed: number,
    special: number,
    level: number
}
