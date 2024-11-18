import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import './App.css';
import { AddNodeAPI, GetNodesAPI } from "../wailsjs/go/main/App";

function App() {
    const [nodes, setNodes] = useState([]);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showGrid, setShowGrid] = useState(true);

    // Função para carregar os nodes
    const loadNodes = async () => {
        const nodes = await GetNodesAPI();
        setNodes(nodes);
    };

    // Função para adicionar um node
    const addNode = async () => {
        await AddNodeAPI(nodes.length + 1, parseFloat(x), parseFloat(y));
        loadNodes(); // Carrega novamente os nodes após adicionar
    };

    useEffect(() => {
        loadNodes();
    }, []);

    const gridSize = 30;
    const width = window.innerWidth / 2;
    const height = window.innerHeight - 100;

    const drawGrid = () => {
        const lines = [];
        for (let i = -width; i < width; i += gridSize) {
            lines.push(<Line key={`v${i}`} points={[i, -height, i, height]} stroke="#ccc" strokeWidth={1} />);
        }
        for (let i = -height; i < height; i += gridSize) {
            lines.push(<Line key={`h${i}`} points={[-width, i, width, i]} stroke="#ccc" strokeWidth={1} />);
        }
        return lines;
    };

    return (
        <div className="App">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-xl">Truss Go</h1>
            </header>
            <div className="flex">
                <div className="w-1/4 p-4 bg-gray-100">
                    <h2 className="text-lg font-bold mb-4">Components</h2>
                    <ul>
                        <li>Nodes</li>
                        <li>Loads</li>
                        <li>Supports</li>
                        <li>Members</li>
                        {/* Adicione mais componentes conforme necessário */}
                    </ul>
                </div>
                <div className="w-1/4 p-4 bg-gray-200">
                    <h2 className="text-lg font-bold mb-4">Component Info</h2>
                    <div>
                        <label className="block mb-2">X Coordinate:</label>
                        <input
                            type="number"
                            value={x}
                            onChange={(e) => setX(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <label className="block mb-2">Y Coordinate:</label>
                        <input
                            type="number"
                            value={y}
                            onChange={(e) => setY(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <button onClick={addNode} className="bg-blue-500 text-white p-2 rounded">Add Node</button>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-bold mb-4">Nodes List</h2>
                        <ul>
                            {nodes.map((node, index) => (
                                <li key={index}>Node {index + 1}: ({node.x}, {node.y})</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="w-1/2 p-4 bg-gray-300">
                    <h2 className="text-lg font-bold mb-4">Canvas</h2>
                    <button onClick={() => setShowGrid(!showGrid)} className="bg-blue-500 text-white p-2 rounded mb-4">
                        {showGrid ? 'Hide Grid' : 'Show Grid'}
                    </button>
                    <div className="overflow-auto" style={{ height: 'calc(100vh - 100px)' }}>
                        <Stage width={width} height={height}>
                            <Layer>
                                {showGrid && drawGrid()}
                                {nodes.map((node, index) => (
                                    <Circle
                                        key={index}
                                        x={(node.x + 2) * gridSize}
                                        y={height - (node.y + 2) * gridSize}
                                        radius={10}
                                        fill="blue"
                                        stroke="black"
                                        strokeWidth={1}
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;