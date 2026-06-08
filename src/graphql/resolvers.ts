//Eduardo Verdu
import { IResolvers } from "@graphql-tools/utils"
import { createUser, validateUser } from "../collections/trainers"
import { signToken } from "../auth"
import { ObjectId } from "mongodb"
import { getDB } from "../db/mongo"
import { Trainer } from "../types"
import { pokemons, pokemonById, createPokemon } from "../collections/pokemons"
import { OWNEDPOKE_COLLECTION, POKEMONS_COLLECTION } from "../utils"
import { catchPokemon, freePokemon } from "../collections/ownedPokemons"

export const resolvers: IResolvers = {
    Query: {
        me: async (_, __, { user }) => { 
            if (!user) return null;
            return user;
        },
        pokemons: async (_, { page, size }) => {
            return await pokemons(page, size);
        },
        pokemon: async (_, { id }) => {
            return await pokemonById(id);
        }
    },

    Trainer: {
        pokemons: async (parent) => {
            const db = getDB();
            return db.collection(OWNEDPOKE_COLLECTION).find({ _id: { $in: parent.pokemons || [] } }).toArray();
        }
    },

    OwnedPokemon: {
        pokemon: async (parent) => {
            const db = getDB();
            return await db.collection(POKEMONS_COLLECTION).findOne({ _id: parent.pokemon });
        }
    },

    Mutation: {
        startJourney: async (_, { name, password }) => {
            const idDeClienteCreado = await createUser(name, password);
            return signToken(idDeClienteCreado);
        },
        login: async (_, { name, password }) => {
            const user = await validateUser(name, password);
            if (!user) throw new Error("Bad credentials");
            return signToken(user._id.toString());
        },
        createPokemon: async (_, { name, description, height, weight, types }, { user }) => { 
            return await createPokemon(user, name, description, height, weight, types);
        },
        catchPokemon: async (_, { pokemonId, nickname }, { user }) => { 
            return await catchPokemon(user, pokemonId, nickname);
        },
        freePokemon: async (_, { ownedPokemonId }, { user }) => { 
            return await freePokemon(user, ownedPokemonId);
        }
    }
}