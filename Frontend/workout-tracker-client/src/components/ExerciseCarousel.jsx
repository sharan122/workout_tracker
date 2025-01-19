import React, { useEffect, useState } from 'react';
import { getExercises } from '../services/auth';
import { useSelector } from 'react-redux';
import { getToken } from '../redux/store';

const ExerciseCarousel = () => {
    const token = useSelector(getToken);
    const [exercises, setExercises] = useState([]);  
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const response = await getExercises(token);
                if (response.error) {
                    setError(response.error);
                } else {
                    setExercises(response);
                }
            } catch (err) {
                setError('Failed to fetch exercises');
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, [token]);

    const next = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + 1 >= exercises.length ? 0 : prevIndex + 1
        );
    };

    const prev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex - 1 < 0 ? exercises.length - 1 : prevIndex - 1
        );
    };

    const getVisibleCards = () => {
        if (!exercises.length) return [];
        const cards = [];
        const totalCards = exercises.length;
        for (let i = 0; i < Math.min(4, totalCards); i++) {
            const index = (currentIndex + i) % totalCards;
            cards.push(exercises[index]);
        }
        return cards;
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
                Loading exercises...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
                {error}
            </div>
        );
    }

    if (!exercises.length) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
                No exercises available.
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <div className="relative">
                {exercises.length > 4 && (
                    <>
                        <button 
                            onClick={prev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-gray-50 focus:outline-none transition-all duration-300 border border-gray-100"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button 
                            onClick={next}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-gray-50 focus:outline-none transition-all duration-300 border border-gray-100"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                <div className="flex gap-6 overflow-hidden">
                    {getVisibleCards().map((exercise, index) => (
                        <div 
                            key={exercise.id || index}
                            className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transition-all duration-300"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 h-full">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                                            {exercise.name}
                                        </h3>
                                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {exercise.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        <span className="text-sm">
                                            {exercise.calories_burned_per_minute} cal/min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExerciseCarousel;