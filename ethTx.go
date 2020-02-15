package main

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/rlp"
)

type EthField int

const (
	NONCE EthField = iota
	GAS_PRICE
	GAS_LIMIT
	RECIPIENT
	VALUE
	DATA
	SIG_V
	SIG_R
	SIG_S
)

// TODO: move this to own package and export
type ethTxParser struct{}

func (e *ethTxParser) understands(s string) bool {
	tx := &types.Transaction{}

	rawTx := strings.TrimPrefix(s, "0x")
	buf, err := hex.DecodeString(rawTx)
	if err != nil {
		return false
	}

	r := bytes.NewBuffer(buf)
	stream := rlp.NewStream(r, 0)
	err = tx.DecodeRLP(stream)
	if err != nil {
		return false
	}

	return true
}

func (e *ethTxParser) parse(s string) ([]token, error) {

	tx := &types.Transaction{}

	rawTx := strings.TrimPrefix(s, "0x")
	buf, err := hex.DecodeString(rawTx)
	if err != nil {
		return nil, err
	}

	r := bytes.NewBuffer(buf)
	stream := rlp.NewStream(r, 0)
	err = tx.DecodeRLP(stream)
	if err != nil {
		return nil, err
	}

	var toks []token

	// first rlp node pre-nonce
	// TODO: probaly some edge case i'm missing
	prefix := buf[0]
	l := prefix - 0xf7
	pre := token{
		Token:       hex.EncodeToString(buf[0:l]),
		Title:       "RLP Prefix",
		Description: "Write me",
		Value:       hex.EncodeToString(buf[0:l]),
	}
	toks = append(toks, pre)

	// add the other fields and their rlp prefixes
	toks = append(toks, genToken(tx.Nonce(), NONCE)...)
	toks = append(toks, genToken(tx.GasPrice(), GAS_PRICE)...)
	toks = append(toks, genToken(tx.Gas(), GAS_LIMIT)...)
	// empty slice if contract creation
	if tx.To() != nil {
		toks = append(toks, genToken(tx.To().Bytes(), RECIPIENT)...)
	} else {
		toks = append(toks, genToken([]byte{}, RECIPIENT)...)
	}
	toks = append(toks, genToken(tx.Value(), VALUE)...)
	toks = append(toks, genToken(tx.Data(), DATA)...)
	sigV, sigR, sigS := tx.RawSignatureValues()
	toks = append(toks, genToken(sigV.Bytes(), SIG_V)...)
	toks = append(toks, genToken(sigR.Bytes(), SIG_R)...)
	toks = append(toks, genToken(sigS.Bytes(), SIG_S)...)

	return toks, nil
}

func genToken(val interface{}, f EthField) []token {

	enc, err := rlp.EncodeToBytes(val)
	if err != nil {
		panic(err)
	}

	var toks []token

	// Add RLP tokens
	rlpTok, prefixLen := addRLPToken(enc)
	if rlpTok != nil {
		toks = append(toks, *rlpTok)
	}

	// strip bytes that were part of the RLP prefix
	body := enc[prefixLen:]

	fmt.Printf("prefixLen: %d, enc: %s, res: %s\n", prefixLen, hex.EncodeToString(enc), hex.EncodeToString(body))

	// Add token for actual field
	var (
		title string
		desc  string
		value string
		tok   string
	)
	switch f {
	case NONCE:
		title = "Nonce"
		desc = "The nonce is an incrementing sequence number used to prevent message replay."
		value = "Convert me to int"
	case GAS_PRICE:
		title = "Gas Price"
		desc = "The price of gas (in wei) that the sender is willing to pay."
		value = "Convert me to int"
	case GAS_LIMIT:
		title = "Gas Limit"
		desc = "The maximum amount of gas the originator is willing to pay for this transaction."
		value = "Convert me to int"
	case RECIPIENT:
		// TODO: edgecase for contract create
		title = "Recipient"
		desc = "The address of the user account or contract to interact with."
		value = "Address or contract creation thing"
	case VALUE:
		title = "Value"
		desc = "The amount of ether (in wei) to send to the recipient address."
		value = "Convert me to int"
	case DATA:
		title = "Data"
		desc = "Data being sent to a contract function. The first 4 bytes are known as the 'function selector'."
		value = ""
	case SIG_V:
		title = "Signature V"
		desc = "Indicates both the chainID of the transaction and the parity (odd or even) of the y component of the public key."
		value = tok
	case SIG_R:
		title = "Signature R"
		desc = "Part of the signature pair (r,s). Represents the X-coordinate of an ephemeral public key created during the ECDSA signing process."
		value = tok
	case SIG_S:
		title = "Signature S"
		desc = "Part of the signature pair (r,s). Generated using the ECDSA signing algorithm."
		value = tok
	}
	toks = append(toks, token{
		Token:       hex.EncodeToString(body),
		Description: desc,
		Value:       value,
		Title:       title,
	})

	return toks
}

// create a token for the rlp prefix and return the size of the prefix
func addRLPToken(enc []byte) (*token, int) {

	length := len(enc)
	if length == 0 {
		panic("encoded value shouldn't be 0 length")
	}

	prefix := enc[0]
	switch {
	// single byte value that would already have been added in previous step
	case prefix < 0x80:
		return nil, 0
	// rlp "string" with length 0-55 bytes
	case prefix < 0xB8:
		tok := &token{
			Token:       hex.EncodeToString([]byte{prefix}),
			Title:       "RLP Length Prefix",
			Description: "RLP Length Prefix. The next field is an RLP 'string' of length 0x%x - 0x80.",
			Value:       hex.EncodeToString([]byte{prefix}),
		}
		fmt.Printf("Prefix: %d, Result: %d\n", int(prefix), int(prefix-0x80))
		//return tok, int(uint(prefix) - 0x80)
		return tok, len(enc) - (int(prefix) - 0x80)
	// rlp "string" with length > 55 bytes
	case prefix < 0xC0:
		// prefix is Length of the length field + 0xB7
		l := prefix - 0xB7
		fieldLen := enc[1 : 1+l]

		tok := &token{
			Token:       hex.EncodeToString(enc[:1+l]),
			Title:       "RLP Length Prefix",
			Description: "The first byte (0x%x-0x80) tells us the length of the length (0x%s) of the next field.",
			Value:       hex.EncodeToString(enc[:1+l]),
		}
		return tok, 1 + len(fieldLen)
	default:
		panic("RLP prefix outside of expected range for ETH tx")
	}

}

//field := NONCE
//idx := 0
//for {

//nonce := addToken(tx.Nonce(), NONCE)

/*
	switch field {
	var val interface{}
	case NONCE:
		val = tx.Nonce()
	case GAS_PRICE:
		val = tx.GasPrice()
	case GAS:
		val = tx.Gas()
	case RECIPIENT:
		// empty array if contract creation
		if tx.To() != nil {
			val = tx.To()
		} else {
			val = []byte{}
		}
	case VALUE:
		val = tx.Value()
	case DATA:
		val = tx.Data()
	case
	}
*/
