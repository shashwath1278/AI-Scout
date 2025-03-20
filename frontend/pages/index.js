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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools?${query}`);
        const data = await response.json();
        setTools(data);
    };

    const addTool = async (newTool) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTool),
        });
        const data = await response.json();
        setTools([...tools, data]);
    };

    return (
        <div>
            <h1>AI Tools</h1>
            <input
                type="text"
                placeholder="Search tools"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="chatbot">Chatbot</option>
                <option value="search">Search</option>
                <option value="development">Development</option>
                {/* Add more categories as needed */}
            </select>
            <ToolForm onAddTool={addTool} />
            <ToolList tools={tools} />
        </div>
    );
}