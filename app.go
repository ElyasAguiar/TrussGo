package main

import (
	"TrussGo/internal/models"
	"TrussGo/internal/services"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx         context.Context
	nodeService *services.NodeService
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		nodeService: services.NewNodeService(),
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
