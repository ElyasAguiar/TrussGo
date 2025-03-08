package services

import (
	"TrussGo/internal/models"
	"sync"
)

type MemberService struct {
	members []models.Member
	mu      sync.Mutex
}

func NewMemberService() *MemberService {
	return &MemberService{
		members: make([]models.Member, 0),
	}
}

// Função para adicionar um member
func (s *MemberService) AddMember(id int, node1 models.Node, node2 models.Node) {
	s.mu.Lock()
	defer s.mu.Unlock()

	newMember := models.NewMember(id, node1, node2)
	s.members = append(s.members, newMember)
}

// Função para listar todos os members
func (s *MemberService) GetMembers() []models.Member {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.members
}
