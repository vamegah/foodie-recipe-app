import React from "react";
import { useSelector } from "react-redux";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
    // Get the navigation object
    const navigation = useNavigation();

    // Assuming you have a similar structure for recipes in your Redux store
    // useSelector hook retrieves the favoriteRecipes from the Redux store.
    const favoriteRecipes = useSelector((state) => state.favorites);
    // Extract the list of favorite recipes if any
    const favoriteRecipesList = favoriteRecipes?.favoriterecipes || [];
    // log in console
    console.log(favoriteRecipes.favoriterecipes);
    console.log('favoriteRecipesList', favoriteRecipesList);

    // If the list is empy...
    if (favoriteRecipesList.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No favorite recipes yet!</Text>
                {/* add back button */}
                <TouchableOpacity
                    // go back to previous screen 
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: "#2563EB",
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        width: 100,
                        alignItems: "center ",
                    }}
                >
                    <Text style={{ color: "#fff" }}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            {/* Heading */}
            <View testID="FavoriteRecipes">
                <Text
                    style={{ fontSize: hp(3.8), marginTop: hp(4), marginLeft: 20 }}
                    className="font-semibold text-neutral-600"
                >
                    My Favorite Recipes
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    backgroundColor: "#2563EB",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                    width: 100,
                    alignItems: "center",
                    marginLeft: 20,
                }}
            >
                <Text style={{ color: "#fff", marginBottom: 10 }}>Go back</Text>
            </TouchableOpacity>

            {/* List of Favorite Recipes */}
            <FlatList
                data={favoriteRecipesList}
                contentContainerStyle={styles.listContentContainer}
                keyExtractor={(item) => item.idFood}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            // If the recipe has recipeName, it's from API, otherwise it's custom
                            if (item.recipeName) {
                                navigation.navigate("RecipeDetail", { ...item })
                            } else {
                                navigation.navigate("CustomRecipesScreen", { recipe: item })
                            }
                        }}
                        style={styles.cardContainer}
                    >
                        <Image
                            source={{ uri: item.recipeImage || item.image }}
                            style={styles.recipeImage}
                        />
                        <Text style={styles.recipeTitle}>
                            {(item.recipeName || item.title)?.length > 20
                                ? (item.recipeName || item.title).slice(0, 20) + "..."
                                : item.recipeName || item.title}
                        </Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />

        </>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: hp(2.5),
        color: "#6B7280", // text-neutral-600
    },
    listContentContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    cardContainer: {
        backgroundColor: "white",
        marginBottom: hp(2),
        padding: wp(4),
        borderRadius: 10,
        elevation: 3, // For Android shadow
        shadowColor: "#000", // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    recipeImage: {
        width: wp(20),
        height: wp(20),
        borderRadius: 10,
        marginRight: wp(4),
    },
    recipeTitle: {
        fontSize: hp(2),
        fontWeight: "bold",
        color: "#4B5563", // text-neutral-700
    },
});