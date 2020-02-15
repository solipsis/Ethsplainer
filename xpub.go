package main

import (
	"encoding/hex"
	"fmt"

	"github.com/btcsuite/btcutil/base58"
)

type xpubParser struct{}

func (x *xpubParser) understands(buf string) bool {
	if _, err := tokenizeXPUB(buf); err != nil {
		return false
	}
	return true
}

func (x *xpubParser) parse(buf string) ([]token, error) {
	toks, err := tokenizeXPUB(buf)
	if err != nil {
		return nil, err
	}
	return toks, nil
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
		Description: "The verison gives information into what kind of key is encoded.",
		Flavor_Text: "This is also what gives an XPUB its distinct form (XPUB, LTUB, ZPUB).", 
		Value:       "convert me to int",
	}
	depth := token{
		Token:       hex.EncodeToString(xpub[4:5]),
		Title:       "Depth",
		Description: "The Depth byte tells you have what generation key this is.",
		Flavor_Text: "In other words it tells you how many parent keys or ancestors lead up to this key.",
		Value:       "Convert me to int",
	}
	fingerprint := token{
		Token:       hex.EncodeToString(xpub[5:9]),
		Title:       "Fingerprint",
		Description: "The Fingerprint is used to verify the parent key.",
		Flavor_Text: "",
		Value:       hex.EncodeToString(xpub[5:9]),
	}
	index := token{
		Token:       hex.EncodeToString(xpub[9:13]),
		Title:       "Index",
		Description: "The Index tells you what child of the parent key this is.",
		Flavor_Text: "Each parent can support up to 2^32 child keys.",
		Value:       hex.EncodeToString(xpub[9:13]),
	}
	chaincode := token{
		Token:       hex.EncodeToString(xpub[13:45]),
		Title:       "Chaincode",
		Description: "The Chaincode is used to deterministically derive child keys of this key.",
		Flavor_Text: "",
		Value:       hex.EncodeToString(xpub[13:45]),
	}
	keydata := token{
		Token:       hex.EncodeToString(xpub[45:78]),
		Title:       "Keydata",
		Description: "The Keydata is the actual bytes of this extended key.",
		Flavor_Text: "If the first byte is 0x00 you know that this is a public child key. Otherwise this is a private child.",
		Value:       hex.EncodeToString(xpub[45:78]),
	}
	checksum := token{
		Token:       hex.EncodeToString(xpub[78:82]),
		Title:       "Checksum",
		Description: "The Checksum is used to verify that the other data was encoded and transmitted properly.",
		Flavor_Text: "",
		Value:       hex.EncodeToString(xpub[78:82]),
	}

	return []token{version, depth, fingerprint, index, chaincode, keydata, checksum}, nil
}