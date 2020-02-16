package main

import (
	"encoding/hex"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

// etherscan/infura don't have an endpoint for raw tx's, but etherscan does have a page that displays it,
// so we need to crawl their website. Which is dumb...
func etherscanCrawlRaw(tx string) string {

	resp, err := http.Get("https://etherscan.io/getRawTx?tx=" + tx)
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}

	str := string(body)
	for strings.Index(str, "0x") > 0 {
		i := strings.Index(str, "0x")
		res := ""
		for str[i] != '\n' {
			res += string(str[i])
			i++
		}
		fmt.Println("Etherscan trim", res)
		str = str[i:]
		if len(res) > 100 {
			_, err := hex.DecodeString(strings.TrimSpace(res[2:]))

			if err == nil {
				return strings.TrimSpace(res)
			}
		}
	}
	return ""
}
