package models

type Member struct {
	ID        int  `json:"id"`
	StartNode Node `json:"startNode"`
	EndNode   Node `json:"endNode"`
}

func NewMember(id int, startNode Node, endNode Node) Member {
	return Member{ID: id, StartNode: startNode, EndNode: endNode}
}
