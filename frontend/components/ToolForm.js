'use client';

import { useState } from 'react';

export default function ToolForm({ onAddTool }) {
    const [newTool, setNewTool] = useState({ name: '', category: '', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTool(newTool);
        setNewTool({ name: '', category: '', description: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Tool Name"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Category"
                value={newTool.category}
                onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
            />
            <textarea
                placeholder="Description"
                value={newTool.description}
                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
            />
            <button type="submit">Add Tool</button>
        </form>
    );
}
