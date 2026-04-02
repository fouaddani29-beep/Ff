import React, { useState, useEffect } from 'react';
import './Dashboard.module.css';
import Header from './Header';
import TrendCard from './TrendCard';
import TrendList from './TrendList';
import Statistics from './Statistics';
import { fetchData } from './api';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchData();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleFavoriteToggle = (item) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(item)) {
                return prevFavorites.filter(fav => fav !== item);
            } else {
                return [...prevFavorites, item];
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortingChange = (e) => {
        setSorting(e.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div className={isDarkMode ? 'dark' : 'light'}>
            <Header 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchChange} 
                onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
            />
            <TrendList 
                data={data.filter(item => item.name.includes(searchTerm))} 
                onFavoriteToggle={handleFavoriteToggle} 
                sorting={sorting} 
                onSortingChange={handleSortingChange} 
            />
            <Statistics favorites={favorites} />
        </div>
    );
};

export default Dashboard;