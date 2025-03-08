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

// Função para limpar nodes
func (s *NodeService) ClearNodes() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.nodes = make([]models.Node, 0)
}

// Função para remover um node
func (s *NodeService) RemoveNode(id int) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i, node := range s.nodes {
		if node.ID == id {
			s.nodes = append(s.nodes[:i], s.nodes[i+1:]...)
			break
		}
	}
}

// Função para pegar um node
func (s *NodeService) GetNode(id int) models.Node {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, node := range s.nodes {
		if node.ID == id {
			return node
		}
	}

	return models.Node{}
}

// Função update node
func (s *NodeService) UpdateNode(id int, x float64, y float64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i, node := range s.nodes {
		if node.ID == id {
			s.nodes[i].X = x
			s.nodes[i].Y = y
			break
		}
	}
}
