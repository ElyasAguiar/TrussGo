package models

type Node struct {
	ID int     `json:"id"`
	X  float64 `json:"x"`
	Y  float64 `json:"y"`
}

func NewNode(id int, x, y float64) Node {
	return Node{ID: id, X: x, Y: y}
}
