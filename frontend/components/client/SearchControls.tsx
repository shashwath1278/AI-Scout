'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export default function SearchControls() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const handleSearch = useCallback(() => {
        router.push({
            pathname: router.pathname,
            query: { search, category },
        });
    }, [search, category, router]);

    return (
        <div className="flex gap-4 mb-6">
            <input
                type="text"
                placeholder="Search tools"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch();
                }}
                className="border p-2 rounded"
            />
            <select 
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    handleSearch();
                }}
                className="border p-2 rounded"
            >
                <option value="">All Categories</option>
                <option value="chatbot">Chatbot</option>
                <option value="search">Search</option>
                <option value="development">Development</option>
            </select>
        </div>
    );
}
