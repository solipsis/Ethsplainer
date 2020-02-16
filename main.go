package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
)

type token struct {
	Token       string `json:"token"`
	Title       string `json:"title"`
	Description string `json:"description"`
	FlavorText  string `json:"flavorText"`
	Value       string `json:"value"`
	Type        string `json:"type"`
}

type request struct {
	Input string `json:"input"`
	Hint  string `json:"hint"`
}

type parser interface {
	understands(string) bool
	parse(string) ([]token, error)
}

// test xpub (xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz)
// test opcodes (60806040526018600055348015601457600080fd5b5060358060226000396000f3006080604052600080fd00a165627a7a723058204551648437b45b4433da110519d9c1ca35c91af7cab828e41346248b1d002a660029)

func main() {

	http.HandleFunc("/", http.HandlerFunc(handleData))
	http.ListenAndServe("localhost:8080", nil)

	// generate opcode list
	//runner()
}

func handleData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	if r.Method == "OPTIONS" {
		return
	}

	dec := json.NewDecoder(r.Body)
	req := request{}
	err := dec.Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Printf("Received: %+v\n", req)

	var toks []token

	eth := ethTxParser{}
	xpub := xpubParser{}
	op := opcodeParser{}

	var typ string
	switch {

	case eth.understands(req.Input):
		toks, err = eth.parse(req.Input)
		typ = "Eth Transaction"
	case xpub.understands(req.Input):
		toks, err = xpub.parse(req.Input)
		typ = "XPUB (Base58 decoded)"
	case op.understands(req.Input):
		toks, err = op.parse(req.Input)
		typ = "EVM Opcodes"
	default:
		w.Write([]byte("Sorry, I down Understand this format"))
		return
	}

	if err != nil {
		log.Fatalf("Parse error: %v\n", err)
	}

	// Hackathon jank
	for i := range toks {
		toks[i].Type = typ
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

// sample response
/*
[
	{
		"token": "0488b21e",
		"title": "Version",
		"description": "The verison gives information into what kind of key is encoded.",
		"flavorText": "This is also what gives an XPUB its distinct form (XPUB, LTUB, ZPUB).",
		"value": "76067358"
	},
	{
		"token": "03",
		"title": "Depth",
		"description": "The Depth byte tells you have what generation key this is.",
		"flavorText": "In other words it tells you how many parent keys or ancestors lead up to this key.",
		"value": "3"
	},
	{
		"token": "6f6a84cf",
		"title": "Fingerprint",
		"description": "The Fingerprint is used to verify the parent key.",
		"flavorText": "",
		"value": "6f6a84cf"
	},
	{
		"token": "80000000",
		"title": "Index",
		"description": "The Index tells you what child of the parent key this is.",
		"flavorText": "Each parent can support up to 2^32 child keys.",
		"value": "2147483648"
	},
	{
		"token": "92f0a924c8c48ed87d6385dff36f9261ff2d1d92739db0c2c78ef0ea830290f1",
		"title": "Chaincode",
		"description": "The Chaincode is used to deterministically derive child keys of this key.",
		"flavorText": "",
		"value": "92f0a924c8c48ed87d6385dff36f9261ff2d1d92739db0c2c78ef0ea830290f1"
	},
	{
		"token": "0340bc6a46ca1adac64cc9599c8a6004afd7782c20d2d568a101e3a81029517358",
		"title": "Keydata",
		"description": "The Keydata is the actual bytes of this extended key.",
		"flavorText": "If the first byte is 0x00 you know that this is a public child key. Otherwise this is a private child.",
		"value": "0340bc6a46ca1adac64cc9599c8a6004afd7782c20d2d568a101e3a81029517358"
	},
	{
		"token": "f4ad6a21",
		"title": "Checksum",
		"description": "The Checksum is used to verify that the other data was encoded and transmitted properly.",
		"flavorText": "",
		"value": "f4ad6a21"
	}
]
*/
