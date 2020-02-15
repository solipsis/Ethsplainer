package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/btcsuite/btcutil/base58"
)

type token struct {
	Token       string `json:"token"`
	Title       string `json:"title"`
	Description string `json:"description"`
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

type xpubParser struct{}

func (x *xpubParser) understands(buf string) bool {
	if _, err := tokenizeXPUB(buf); err != nil {
		return true
	}
	return false
}

func (x *xpubParser) parse(buf string) ([]token, error) {
	toks, err := tokenizeXPUB(buf)
	if err != nil {
		return nil, err
	}
	return toks, nil
}

func main() {
	/*
		xpub := decodeXPUB("xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz")
	*/

	http.HandleFunc("/", http.HandlerFunc(handleData))
	http.ListenAndServe("localhost:8080", nil)
}

func handleData(w http.ResponseWriter, r *http.Request) {

	dec := json.NewDecoder(r.Body)
	req := request{}
	err := dec.Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	toks, err := tokenizeXPUB(req.Input)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	res, err := json.MarshalIndent(toks, "", "	")
	if err != nil {
		panic(err)
	}
	w.Write(res)
}

func decodeXPUB(xpub string) []byte {
	return base58.Decode(xpub)
}

func tokenizeXPUB(encoded string) ([]token, error) {

	// decode from base58
	xpub := decodeXPUB(string(encoded))

	if len(xpub) < 82 {
		return nil, fmt.Errorf("%s is not a valid xpub", encoded)
	}

	// TODO: Probably add a lot of 0x prefixes on value?

	version := token{
		Token:       hex.EncodeToString(xpub[0:4]),
		Title:       "Version",
		Description: "Write me",
		Value:       "convert me to int",
	}
	depth := token{
		Token:       hex.EncodeToString(xpub[4:5]),
		Title:       "Depth",
		Description: "Write me",
		Value:       "Convert me to int",
	}
	fingerprint := token{
		Token:       hex.EncodeToString(xpub[5:9]),
		Title:       "Fingerprint",
		Description: "Write me",
		Value:       hex.EncodeToString(xpub[5:9]),
	}
	index := token{
		Token:       hex.EncodeToString(xpub[9:13]),
		Title:       "Index",
		Description: "Write me",
		Value:       hex.EncodeToString(xpub[9:13]),
	}
	chaincode := token{
		Token:       hex.EncodeToString(xpub[13:45]),
		Title:       "Chaincode",
		Description: "Write me",
		Value:       hex.EncodeToString(xpub[13:45]),
	}
	keydata := token{
		Token:       hex.EncodeToString(xpub[45:78]),
		Title:       "Keydata",
		Description: "Write me",
		Value:       hex.EncodeToString(xpub[45:78]),
	}
	checksum := token{
		Token:       hex.EncodeToString(xpub[78:82]),
		Title:       "Checksum",
		Description: "Write me",
		Value:       hex.EncodeToString(xpub[78:82]),
	}

	return []token{version, depth, fingerprint, index, chaincode, keydata, checksum}, nil
}
