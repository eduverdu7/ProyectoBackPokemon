// Eduardo Verdu
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { OwnedPokemon, Pokemon, Trainer } from "../types";
import { OWNEDPOKE_COLLECTION, TRAINER_COLLECTION, POKEMONS_COLLECTION } from "../utils";

export const catchPokemon = async (
    trainer: Trainer,
    pokemonId: string,
    nickname?: string) => {
    if (!trainer) throw new Error("No autenticado");
    const db = getDB();
    // const pokemon = await db.collection<Pokemon>(POKEMONS_COLLECTION).findOne({ _id: new ObjectId(pokemonId) });
    // if (!pokemon) throw new Error("Pokemon no existe");  no necesario, hecho para comprobar si entraba correctamente el id del POKE
    const trainerBase = await db.collection<Trainer>(TRAINER_COLLECTION).findOne({ _id: trainer._id });
    if (!trainerBase) throw new Error("Entrenador no encontrado");

    const teamSize = trainerBase.pokemons?.length || 0;
    if (teamSize >= 6) throw new Error("No puedes llevar más pokemóns, lo siento mi vida");

    const owned: OwnedPokemon = {
        pokemon: new ObjectId(pokemonId),
        nickname,
        attack: Math.floor(Math.random() * 100) + 1, 
        defense: Math.floor(Math.random() * 100) + 1, //hacemos que sean numeros aleatorios
        speed: Math.floor(Math.random() * 100) + 1, //sin el +1 serian 99
        special: Math.floor(Math.random() * 100) + 1,
        level: Math.floor(Math.random() * 100) + 1
    };

    const pokemonTuyo = await db.collection<OwnedPokemon>(OWNEDPOKE_COLLECTION).insertOne(owned);

    await db.collection(TRAINER_COLLECTION).updateOne({ _id: trainer._id },{ $addToSet: { pokemons: pokemonTuyo.insertedId } });
    return {
        _id: pokemonTuyo.insertedId,
        pokemon: owned.pokemon,
        nickname: owned.nickname,
        attack: owned.attack,
        defense: owned.defense,
        speed: owned.speed,
        special: owned.special,
        level: owned.level
    };
};

export const freePokemon = async (
    trainer: Trainer,
    ownedPokemonId: string) => {
    if (!trainer) throw new Error("No autenticado");
    const db = getDB();
    const ownedId = new ObjectId(ownedPokemonId);

    const trainerDB = await db.collection<Trainer>(TRAINER_COLLECTION).findOne({ _id: trainer._id });
    if (!trainerDB) throw new Error("Entrenador no encontrado");

    if (!trainerDB.pokemons?.some(id => id.equals(ownedId))) {
        throw new Error("No es tu pokemon, chorizo");
    }

    const nuevoArray = trainerDB.pokemons?.filter(id => !id.equals(ownedId)) || []; //que el array esté vacío pero que siempre sea array

    await db.collection(TRAINER_COLLECTION).updateOne({ _id: trainer._id },{ $set: { pokemons: nuevoArray } } );

    await db.collection(OWNEDPOKE_COLLECTION).deleteOne({ _id: ownedId });

    return await db.collection<Trainer>(TRAINER_COLLECTION).findOne({ _id: trainer._id });
};