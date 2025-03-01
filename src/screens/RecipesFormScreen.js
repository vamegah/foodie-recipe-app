import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
    // The screen receives recipeToEdit, recipeIndex, and onrecipeEdited as parameters 
    // through the route. These parameters are passed when the user navigates to this 
    // form, allowing it to be used for editing an existing recipe or creating a new one.
    const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};

    // Title, image, and description are managed using the useState hook. If the form is 
    // used for editing, the state is initialized with the recipe's existing data; otherwise, 
    // it's set to empty strings for new recipes.
    const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
    const [ingredientsList, setIngredientsList] = useState(recipeToEdit ? recipeToEdit.ingredientsList : "");
    const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
    const [description, setDescription] = useState(
        recipeToEdit ? recipeToEdit.description : ""
    );

    const saverecipe = async () => {
        console.log("Saving recipe...");
        try {
            const newrecipe = {
                title,
                image,
                ingredientsList,
                description,
                idFood: recipeToEdit ? recipeToEdit.idFood : `custom_${Date.now()}` // Preserve existing idFood when editing
            };
            // Retrieve existing recipes from local storage
            const existingrecipes = await AsyncStorage.getItem("customrecipes");
            // Parse the retrieved data into an array (recipes) or create an empty one
            const recipes = existingrecipes ? JSON.parse(existingrecipes) : [];
            // If editing an existing recipe (recipeToEdit is defined)
            if (recipeToEdit) {
                // update the specific recipe, and save the updated array back to storage.
                recipes[recipeIndex] = newrecipe;
                await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
                // Notify parent of the edit
                onrecipeEdited();
            } else {
                // If adding a new recipe, push the new recipe to the array, and save the updated array 
                // back to storage.
                recipes.push(newrecipe);
                await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
            }
            navigation.goBack();
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
                style={styles.input}
            />
            {image ? (
                <Image source={{ uri: image }} style={styles.image} />
            ) : (
                <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
            )}

            <TextInput
                placeholder="Ingredients List"
                value={ingredientsList}
                onChangeText={setIngredientsList}
                multiline={true}
                numberOfLines={4}
                style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
            />

            <TextInput
                placeholder="Step-by-step instructions"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
                style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
            />
            <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save recipe</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(4),
    },
    input: {
        marginTop: hp(4),
        borderWidth: 1,
        borderColor: "#ddd",
        padding: wp(.5),
        marginVertical: hp(1),
    },
    image: {
        width: 300,
        height: 200,
        margin: wp(2),
    },
    imagePlaceholder: {
        height: hp(20),
        justifyContent: "center",
        alignItems: "center",
        marginVertical: hp(1),
        borderWidth: 1,
        borderColor: "#ddd",
        textAlign: "center",
        padding: wp(2),
    },
    saveButton: {
        backgroundColor: "#4F75FF",
        padding: wp(.5),
        alignItems: "center",
        borderRadius: 5,
        marginTop: hp(2),
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});