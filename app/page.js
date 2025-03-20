'use client';

import { useState, useEffect } from 'react';
import ToolForm from '@/components/ToolForm';
import ToolList from '@/components/ToolList';

export default function Home() {
    const [tools, setTools] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchTools();
    }, [search, category]);

    const fetchTools = async () => {
        const query = new URLSearchParams({ search, category }).toString();
        const response = await fetch(`http://localhost:5000/api/tools?${query}`);
        const data = await response.json();
        setTools(data);
    };

    const addTool = async (newTool) => {
        const response = await fetch('http://localhost:5000/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTool),
        });

        if (response.ok) {
            const addedTool = await response.json();
            setTools((prevTools) => [...prevTools, addedTool]);
        } else {
            alert('Failed to add tool');
        }
    };

    return (
        <div>
            <h1>AI Tools Directory</h1>
            <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="">All Categories</option>
                <option value="chatbot">Chatbot</option>
                <option value="search">Search</option>
                <option value="development">Development</option>
            </select>
            <ToolList tools={tools} />
            <h2>Add a New Tool</h2>
            <ToolForm onAddTool={addTool} />
        </div>
    );
}   