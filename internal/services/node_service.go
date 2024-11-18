package services

import (
	"TrussGo/internal/models"
	"sync"
)

type NodeService struct {
	nodes []models.Node
	mu    sync.Mutex
}

func NewNodeService() *NodeService {
	return &NodeService{
		nodes: make([]models.Node, 0),
	}
}

// Função para adicionar um node
func (s *NodeService) AddNode(id int, x float64, y float64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	newNode := models.Node{ID: id, X: x, Y: y}
	s.nodes = append(s.nodes, newNode)
}

// Função para listar todos os nodes
func (s *NodeService) GetNodes() []models.Node {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.nodes
}
