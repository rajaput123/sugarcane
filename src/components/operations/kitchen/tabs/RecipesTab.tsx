
import React from 'react';
import { ChefHat, ScrollText } from 'lucide-react';
import { mockRecipes } from '@/data/mockOperationsData'; // Reusing existing mock recipes

export default function RecipesTab() {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ChefHat size={24} className="text-slate-500" />
                    Standardized Recipes
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRecipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white/60 p-4 rounded-xl border border-white/20 hover:bg-white/80 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{recipe.name}</h3>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                {recipe.servingSize} pcs
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{recipe.description}</p>

                        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                            <span className="font-bold">Ingredients:</span> {recipe.ingredients.length} items
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
