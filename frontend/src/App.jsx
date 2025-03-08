import React, { useState, useEffect, useRef } from 'react';
import { AddNodeAPI, GetNodesAPI, RemoveNodeAPI, UpdateNodeAPI, AddMemberAPI, GetMembersAPI } from "../wailsjs/go/main/App";
import JXG from 'jsxgraph';

import './App.css';

function App() {
    const [nodes, setNodes] = useState([]);
    const [members, setMembers] = useState([]);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showGrid, setShowGrid] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedX, setSelectedX] = useState(0);
    const [selectedY, setSelectedY] = useState(0);
    const [activeMenu, setActiveMenu] = useState(null);
    const [startNodeId, setStartNodeId] = useState(null);
    const [endNodeId, setEndNodeId] = useState(null);
    const boardRef = useRef(null);

    // Carrega os nodes e members
    const loadNodes = async () => {
        const nodes = await GetNodesAPI();
        setNodes(nodes);
    };

    const loadMembers = async () => {
        const members = await GetMembersAPI();
        setMembers(members);
    };

    // Funções de node
    const addNode = async () => {
        await AddNodeAPI(nodes.length + 1, parseFloat(x), parseFloat(y));
        loadNodes();
    };

    const deleteNode = async (id) => {
        await RemoveNodeAPI(id);
        loadNodes();
        setSelectedNode(null);
    };

    const updateNode = async () => {
        if (selectedNode !== null) {
            await UpdateNodeAPI(selectedNode.id, parseFloat(selectedX), parseFloat(selectedY));
            loadNodes();
            setSelectedNode(null);
        }
    };

    // Função para adicionar um member (exemplo)
    const addMember = async () => {
        if (startNodeId !== null && endNodeId !== null) {
            await AddMemberAPI(members.length + 1, startNodeId, endNodeId);
            loadNodes();
            loadMembers();
            setStartNodeId(null);
            setEndNodeId(null);
            setActiveMenu(null);
        }
    };

    useEffect(() => {
        loadNodes();
        loadMembers();
    }, []);

    useEffect(() => {
        if (boardRef.current) {
            JXG.JSXGraph.freeBoard(boardRef.current);
        }
        boardRef.current = JXG.JSXGraph.initBoard('jxgbox', {
            boundingbox: [-10, 10, 10, -10],
            axis: true,
            showCopyright: false,
            showNavigation: true,
        });

        nodes.forEach((node, index) => {
            const point = boardRef.current.create('point', [node.x, node.y], {
                size: 6,
                name: node.id.toString(),
                // withLabel: true,
            });
            point.on('click', () => {
                setSelectedNode({ id: node.id, x: node.x, y: node.y });
                setSelectedX(node.x);
                setSelectedY(node.y);
            });
        });

        members.forEach((member) => {
            const { startNode, endNode } = member;
            if (startNode && endNode) {
                boardRef.current.create('segment', [[startNode.x, startNode.y], [endNode.x, endNode.y]]);
            }
        });
    }, [nodes, members, showGrid]);

    // Renderiza o formulário de atualização ou os formulários de add conforme o menu ativo
    const renderForm = () => {
        if (selectedNode) {
            return (
                <div className="mb-4 p-4 bg-white rounded shadow">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold">Edit Node</h2>
                        <button onClick={() => setSelectedNode(null)} className="text-red-500 text-2xl">×</button>
                    </div>
                    <label className="block mb-2">X Coordinate:</label>
                    <input
                        type="number"
                        value={selectedX}
                        onChange={(e) => setSelectedX(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    />
                    <label className="block mb-2">Y Coordinate:</label>
                    <input
                        type="number"
                        value={selectedY}
                        onChange={(e) => setSelectedY(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    />
                    <button onClick={updateNode} className="bg-blue-500 text-white p-2 rounded mr-2 w-full">Save</button>
                    <button onClick={() => deleteNode(selectedNode.id)} className="bg-red-500 text-white p-2 rounded w-full">Delete</button>
                </div>
            );
        }

        switch (activeMenu) {
            case 'addNode':
                return (
                    <div className="mb-4 p-4 bg-white rounded shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold">Add Node</h2>
                            <button onClick={() => setActiveMenu(null)} className="text-red-500 text-2xl">×</button>
                        </div>
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
                        <button onClick={addNode} className="bg-blue-500 text-white p-2 rounded w-full">Add Node</button>
                    </div>
                );
            case 'addMember':
                return (
                    <div className="mb-4 p-4 bg-white rounded shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold">Add Member</h2>
                            <button onClick={() => setActiveMenu(null)} className="text-red-500 text-2xl">×</button>
                        </div>
                        <label className="block mb-2">Start Node ID:</label>
                        <input
                            type="number"
                            value={startNodeId || ''}
                            onChange={(e) => setStartNodeId(parseInt(e.target.value))}
                            className="border p-2 mb-4 w-full"
                        />
                        <label className="block mb-2">End Node ID:</label>
                        <input
                            type="number"
                            value={endNodeId || ''}
                            onChange={(e) => setEndNodeId(parseInt(e.target.value))}
                            className="border p-2 mb-4 w-full"
                        />
                        <button onClick={addMember} className="bg-blue-500 text-white p-2 rounded w-full">Add Member</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="App h-screen overflow-hidden">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-xl">Truss Go</h1>
            </header>
            <div className="flex h-full">
                {/* Coluna da esquerda: formulário (update ou add) + lista de componentes */}
                <div className="w-1/4 p-4 bg-gray-100">
                    {renderForm()}
                    <h2 className="text-lg font-bold mb-4">Components</h2>
                    <ul>
                        <li
                            onClick={() => { setActiveMenu('addNode'); setSelectedNode(null); }}
                            className={`cursor-pointer mb-2 ${activeMenu === 'addNode' ? 'underline' : ''}`}
                        >
                            Nodes
                        </li>
                        <li
                            onClick={() => { setActiveMenu('addMember'); setSelectedNode(null); }}
                            className={`cursor-pointer mb-2 ${activeMenu === 'addMember' ? 'underline' : ''}`}
                        >
                            Members
                        </li>
                    </ul>
                </div>
                {/* Coluna da direita: Canvas */}
                <div className="w-3/4 p-4 bg-gray-300">
                    <h2 className="text-lg font-bold mb-4">Canvas</h2>
                    <button onClick={() => setShowGrid(!showGrid)} className="bg-blue-500 text-white p-2 rounded mb-4">
                        {showGrid ? 'Hide Grid' : 'Show Grid'}
                    </button>
                    <div id="jxgbox" className="overflow-y-hidden" style={{ height: 'calc(100vh - 100px)', width: '100%' }}></div>
                </div>
            </div>
        </div>
    );
}

export default App;