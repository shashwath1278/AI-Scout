"use client"
interface Tool {
    id: number;
    name: string;
    category: string;
    description: string;
}

interface ToolListProps {
    tools: Tool[];
}

export default function ToolList({ tools }: ToolListProps) {
    return (
        <div>
            {tools.map((tool) => (
                <div key={tool.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h2>{tool.name}</h2>
                    <p>{tool.description}</p>
                    <p><strong>Category:</strong> {tool.category}</p>
                </div>
            ))}
        </div>
    );
}