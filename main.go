package main

import (
	"encoding/json"
	"log"
	"math/big"
	"net/http"
)

type token struct {
	Token       string `json:"token"`
	Title       string `json:"title"`
	Description string `json:"description"`
	FlavorText  string `json:"flavor"`
	Value       string `json:"value"`
}

type request struct {
	Input string `json:"input"`
	Hint  string `json:"hint"`
}

type parser interface {
	understands(string) bool
	parse(string) ([]token, error)
}

func main() {
	/*
		xpub := decodeXPUB("xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz")
	*/

	http.HandleFunc("/", http.HandlerFunc(handleData))
	http.ListenAndServe("localhost:8080", nil)
}

func handleData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

	dec := json.NewDecoder(r.Body)
	req := request{}
	err := dec.Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	var toks []token

	eth := ethTxParser{}
	xpub := xpubParser{}

	switch {

	case eth.understands(req.Input):
		toks, err = eth.parse(req.Input)
	case xpub.understands(req.Input):
		toks, err = xpub.parse(req.Input)
	default:
		w.Write([]byte("I don't know what to do with this, harass Dave"))
		return
	}

	if err != nil {
		log.Fatalf("Parse error: %v\n", err)
	}

	res, err := json.MarshalIndent(toks, "", "	")
	if err != nil {
		panic(err)
	}
	w.Write(res)
}

func bytesToInt(buf []byte) *big.Int {
	return big.NewInt(0).SetBytes(buf)
}
