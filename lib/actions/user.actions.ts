"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import {handleError} from "../utils";

/**
 * Create a new user in the database.
 *
 * @param {CreateUserParams} user - the user object to be created
 * @return {any} the newly created user object
 */
export async function createUser(user: CreateUserParams) :Promise<any> {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);

        return JSON.parse(JSON.stringify(newUser));
    } catch (err) {
        handleError(err);
    }
}

interface CreateUserParams {
    clerkId: string,
    email: string,
    username: string,
    photo: string,
    firstname: string,
    lastname: string,
    planId: number,
    creditBalance: number,
    stripeId: string,
    stripeCustomerId: string
}

/**
 * Retrieves a user by their ID from the database.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @return {Promise<any>} A promise that resolves with the user object
 */
export async function getUserById(userId: string) : Promise<any> {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId});

        if (!user) throw new Error("User not found");

        return JSON.parse(JSON.stringify(user));
    } catch (err) {
        handleError(err);
    }
}

/**
 * Updates a user in the database.
 *
 * @param {string} clerkId - The clerk ID of the user to be updated
 * @param {any | UpdateUserParams} user - The updated user data
 * @return {any} The updated user data in JSON format
 */
export async function updateUser(clerkId: string, user: any | UpdateUserParams) : Promise<any> {
    try {
        await connectToDatabase();

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });

        if (!updatedUser) throw new Error("User update failed");

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (err) {
        handleError(err);
    }
}

interface UpdateUserParams {
    email: string,
    username: string,
    photo: string,
    firstname: string,
    lastname: string,
    planId: number,
    creditBalance: number,
    stripeId: string,
    stripeCustomerId: string
}

/**
 * Deletes a user from the database.
 *
 * @param {string} clerkId - The ID of the user to be deleted
 * @return {Promise<any>} A Promise that resolves to the deleted user, or null if the user is not found
 */
export async function deleteUser(clerkId: string) : Promise<any> {
    try {
        await connectToDatabase();

        // Find and delete the user
        const deleteUser = await User.findOneAndDelete({ clerkId });

        if (!deleteUser) {
            throw new Error("User not found");
        }

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(deleteUser._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (err) {
        handleError(err);
    }
}

/**
 * Updates the credits of a user in the database.
 *
 * @param {string} userId - The ID of the user whose credits are being updated
 * @param {number} creditFee - The amount by which the credits are being updated
 * @return {Promise<any>} A Promise that resolves to the updated user credits in JSON format
 */
export async function updateCredits(userId: string, creditFee: number) : Promise<any> {
    try {
        await connectToDatabase();

        const updateUserCredits = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { creditBalance: creditFee }},
            { new: true }
        )

        if(!updateUserCredits) throw new Error("User credits update failed");

        return JSON.parse(JSON.stringify(updateUserCredits));
    } catch (err) {
        handleError(err);
    }
}