import React, { useState, useEffect } from 'react';
import Search from '../components/Search';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(9);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const filteredRecipes = data.products.filter(product => product.category === 'groceries');
        setRecipes(filteredRecipes);
        setFilteredRecipes(filteredRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
    setCurrentPage(1);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Delicious Recipes</h1>
      <Search onSearch={handleSearch} placeholder="Search recipes..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentRecipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
            <img src={recipe.thumbnail} alt={recipe.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-green-700">{recipe.title}</h2>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden">{recipe.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Brand: {recipe.brand}</span>
                <button 
                  onClick={() => handleRecipeSelect(recipe)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                >
                  View Recipe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {[...Array(Math.ceil(recipes.length / recipesPerPage)).keys()].map(number => (
          <button 
            key={number + 1} 
            onClick={() => paginate(number + 1)}
            className="mx-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
          >
            {number + 1}
          </button>
        ))}
      </div>
      {selectedRecipe && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setSelectedRecipe(null)}>
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <h3 className="text-2xl leading-6 font-bold text-green-800 mb-2">{selectedRecipe.title}</h3>
              <img src={selectedRecipe.thumbnail} alt={selectedRecipe.title} className="w-full h-64 object-cover rounded-md mb-4" />
              <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Brand: {selectedRecipe.brand}</p>
                  <p className="text-sm text-gray-500">Rating: {selectedRecipe.rating}/5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price: ${selectedRecipe.price}</p>
                  <p className="text-sm text-gray-500">Stock: {selectedRecipe.stock}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;