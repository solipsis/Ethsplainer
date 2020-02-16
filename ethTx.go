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

	// hacky we got a txID and need to look up the raw txn
	if len(s) == len("0xc45367afb97f4e79fe6cccfed0bea22a8c63d6fbd7ec4f85aa2541d05075f8af") {
		raw := etherscanCrawlRaw(s)
		if len(raw) > 20 {
			return true
		}
		return false
	}

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
	var rawTx string

	// hacky we got a txID and need to look up the raw txn
	// TODO: need to deal with network failure for etherscan
	if len(s) == len("0xc45367afb97f4e79fe6cccfed0bea22a8c63d6fbd7ec4f85aa2541d05075f8af") {
		rawTx = strings.TrimPrefix(etherscanCrawlRaw(s), "0x")
	} else {
		rawTx = strings.TrimPrefix(s, "0x")
	}

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
	llen := buf[1 : 1+l]
	pre := token{
		Token:       hex.EncodeToString(buf[0:l]),
		Title:       "RLP Prefix",
		Description: fmt.Sprintf("RLP is an encoding/decoding algorithm that helps Ethereum to serialize data.\nThis is an RLP 'list' with total length > 55 bytes.\n The first byte (0x%x - 0xF7) tells us the length of the length (%d bytes).\nThe actual length of the list in bytes is %s bytes (0x%x)", prefix, l, bytesToInt(llen), llen),
		Value:       hex.EncodeToString(buf[0:l]),
	}
	toks = append(toks, pre)

	/*
			tok := &token{
			Token:       hex.EncodeToString(enc[:1+l]),
			Title:       "RLP Length Prefix",
			Description: fmt.Sprintf("This is an RLP 'string' with length > 55 bytes.\nThe first byte (0x%x-0xB7) tells us the length of the length (%d bytes).\nThe actual field length is %s bytes (0x%x)", prefix, l, bytesToInt(fieldLen).String(), fieldLen),
			Value:       hex.EncodeToString(enc[:1+l]),
		}
	*/

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

	return toks,

		nil
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
		title    string
		desc     string
		longDesc string
		value    string
		tok      string
	)
	switch f {
	case NONCE:
		title = "Nonce"
		desc = "The nonce is an incrementing sequence number used to prevent message replay."
		longDesc = ""
		if rlpTok == nil {
			value = "0 (0x80) is the RLP encoded version of zero"
		} else {
			value = bytesToInt(body).String()
		}
	case GAS_PRICE:
		title = "Gas Price"
		desc = "The price of gas (in wei) that the sender is willing to pay."
		longDesc = ""
		value = bytesToInt(body).String()
	case GAS_LIMIT:
		title = "Gas Limit"
		desc = "The maximum amount of gas the originator is willing to pay for this transaction."
		longDesc = ""
		value = bytesToInt(body).String()
	case RECIPIENT:
		// TODO: edgecase for contract create
		title = "Recipient"
		if rlpTok == nil {
			desc = "The recipient field is empty. This signifies that this is a special call to Create a contract"
			value = ""
		} else {
			desc = "The address of the user account or contract to interact with."
			value = "0x" + hex.EncodeToString(body[:20]) + "..."
		}
	case VALUE:
		title = "Value"
		desc = "Amount of Eth in wei"
		longDesc = "The amount of ether (in wei) to send to the recipient address."
		if rlpTok == nil {
			value = "0"
		} else {
			value = bytesToInt(body).String()
		}
	case DATA:
		title = "Data"
		desc = "Data being sent to a contract function. The first 4 bytes are known as the 'function selector'."
		longDesc = ""
		if rlpTok == nil {
			value = "No Data"
		} else {
			if len(body) > 20 {
				value = "0x" + hex.EncodeToString(body[:20]) + "..."
			} else {
				value = "0x" + hex.EncodeToString(body)
			}
		}
	case SIG_V:
		title = "Signature V"
		desc = "Indicates both the chainID of the transaction and the parity (odd or even) of the y component of the public key."
		longDesc = ""
		value = "0x" + tok
	case SIG_R:
		title = "Signature R"
		desc = "(r) part of the signature pair (r,s)."
		longDesc = "Represents the X-coordinate of an ephemeral public key created during the ECDSA signing process."
		value = "0x" + tok
	case SIG_S:
		title = "Signature S"
		desc = "(s) part of the signature pair (r,s)."
		longDesc = "Generated using the ECDSA signing algorithm."
		value = "0x" + tok
	}
	toks = append(toks, token{
		Token:       hex.EncodeToString(body),
		Description: desc,
		FlavorText:  longDesc,
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
	// technically not correct to include 0x80 but makes other code cleaner
	case prefix <= 0x80:
		return nil, 0
	// rlp "string" with length 0-55 bytes
	case prefix < 0xB8:
		tok := &token{
			Token:       hex.EncodeToString([]byte{prefix}),
			Title:       "RLP Length Prefix",
			Description: fmt.Sprintf("RLP Length Prefix. The next field is an RLP 'string' of length 0x%x (0x%x - 0x80)", prefix-0x80, prefix),
			Value:       hex.EncodeToString([]byte{prefix}),
		}
		return tok, len(enc) - (int(prefix) - 0x80)
	// rlp "string" with length > 55 bytes
	case prefix < 0xC0:
		// prefix is Length of the length field + 0xB7
		l := prefix - 0xB7
		fieldLen := enc[1 : 1+l]

		tok := &token{
			Token:       hex.EncodeToString(enc[:1+l]),
			Title:       "RLP Length Prefix",
			Description: fmt.Sprintf("This is an RLP 'string' with length > 55 bytes.\nThe first byte (0x%x-0xB7) tells us the length of the length (%d bytes).\nThe actual field length is %s bytes (0x%x)", prefix, l, bytesToInt(fieldLen).String(), fieldLen),
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
