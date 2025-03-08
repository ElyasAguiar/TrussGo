package main

import (
	"TrussGo/internal/models"
	"TrussGo/internal/services"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx           context.Context
	nodeService   *services.NodeService
	memberService *services.MemberService
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		nodeService:   services.NewNodeService(),
		memberService: services.NewMemberService(), // Inicialize o memberService aqui
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Olá %s, É hora do show!!", name)
}

// AddNodeAPI is called from the frontend to add a node
func (a *App) AddNodeAPI(id int, x float64, y float64) {
	a.nodeService.AddNode(id, x, y)
}

// GetNodesAPI is called from the frontend to get all nodes
func (a *App) GetNodesAPI() []models.Node {
	return a.nodeService.GetNodes()
}

// ClearNodesAPI is called from the frontend to clear all nodes
func (a *App) ClearNodesAPI() {
	a.nodeService.ClearNodes()
}

// RemoveNodeAPI is called from the frontend to remove a node
func (a *App) RemoveNodeAPI(id int) {
	a.nodeService.RemoveNode(id)
}

// GetNodeAPI is called from the frontend to get a node
func (a *App) GetNodeAPI(id int) models.Node {
	return a.nodeService.GetNode(id)
}

// UpdateNodeAPI is called from the frontend to update a node
func (a *App) UpdateNodeAPI(id int, x float64, y float64) {
	a.nodeService.UpdateNode(id, x, y)
}

// AddMemberAPI is called from the frontend to add a member
func (a *App) AddMemberAPI(id int, startNodeId int, endNodeId int) {
	startNode := a.nodeService.GetNode(startNodeId)
	endNode := a.nodeService.GetNode(endNodeId)
	a.memberService.AddMember(id, startNode, endNode)
}

// GetMembersAPI is called from the frontend to get all members
func (a *App) GetMembersAPI() []models.Member {
	return a.memberService.GetMembers()
}
