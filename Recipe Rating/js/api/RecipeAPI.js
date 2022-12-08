
export default class RecipeAPI{

    /**
     * Get random Recipes 
     * @params num of recipes
     * @returns Promise
     */
    static async getRandom(num){

        const url = `http://localhost:3000/spoonacular/random?num=${num}`;

        // fetching from the public api and will return us a promise
        const RequestRecipes = async (url) => {
            try{
                const response = await fetch(url);      // return a promise 
                const data = await response.json();     // thenables on the promise and get the data
                return data.recipes;
            }catch(e){
                console.log(e)
            }

        }

        return RequestRecipes(url);
    }


    // getRecipeDetails(id)


}