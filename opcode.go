package main

import (
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
)

type opcodeParser struct{}

func (o *opcodeParser) understands(s string) bool {
	// TODO: not foolproof
	return strings.HasPrefix(strings.TrimPrefix(s, "0x"), "6080")
}

func (o *opcodeParser) parse(s string) ([]token, error) {

	buf, err := hex.DecodeString(strings.TrimPrefix(s, "0x"))
	if err != nil {
		return nil, errors.New("Not valid hex")
	}

	var toks []token
	var idx int
	for idx < len(buf) {
		var tok token

		// Generated with opgen.go
		switch buf[idx] {
		case 0x00:
			tok = token{
				Token:       "0x00",
				Title:       "STOP",
				Description: "Halts execution",
				Value:       "0x00",
			}

		case 0x01:
			tok = token{
				Token:       "0x01",
				Title:       "ADD",
				Description: "Addition operation",
				Value:       "0x01",
			}

		case 0x02:
			tok = token{
				Token:       "0x02",
				Title:       "MUL",
				Description: "Multiplication operation",
				Value:       "0x02",
			}

		case 0x03:
			tok = token{
				Token:       "0x03",
				Title:       "SUB",
				Description: "Subtraction operation",
				Value:       "0x03",
			}

		case 0x04:
			tok = token{
				Token:       "0x04",
				Title:       "DIV",
				Description: "Integer division operation",
				Value:       "0x04",
			}

		case 0x05:
			tok = token{
				Token:       "0x05",
				Title:       "SDIV",
				Description: "Signed integer division operation (truncated)",
				Value:       "0x05",
			}

		case 0x06:
			tok = token{
				Token:       "0x06",
				Title:       "MOD",
				Description: "Modulo remainder operation",
				Value:       "0x06",
			}

		case 0x07:
			tok = token{
				Token:       "0x07",
				Title:       "SMOD",
				Description: "Signed modulo remainder operation",
				Value:       "0x07",
			}

		case 0x08:
			tok = token{
				Token:       "0x08",
				Title:       "ADDMOD",
				Description: "Modulo addition operation",
				Value:       "0x08",
			}

		case 0x09:
			tok = token{
				Token:       "0x09",
				Title:       "MULMOD",
				Description: "Modulo multiplication operation",
				Value:       "0x09",
			}

		case 0x0a:
			tok = token{
				Token:       "0x0a",
				Title:       "EXP",
				Description: "Exponential operation",
				Value:       "0x0a",
			}

		case 0x0b:
			tok = token{
				Token:       "0x0b",
				Title:       "SIGNEXTEND",
				Description: "Extend length of two's complement signed integer",
				Value:       "0x0b",
			}

		case 0x10:
			tok = token{
				Token:       "0x10",
				Title:       "LT",
				Description: "Less-than comparison",
				Value:       "0x10",
			}

		case 0x11:
			tok = token{
				Token:       "0x11",
				Title:       "GT",
				Description: "Greater-than comparison",
				Value:       "0x11",
			}

		case 0x12:
			tok = token{
				Token:       "0x12",
				Title:       "SLT",
				Description: "Signed less-than comparison",
				Value:       "0x12",
			}

		case 0x13:
			tok = token{
				Token:       "0x13",
				Title:       "SGT",
				Description: "Signed greater-than comparison",
				Value:       "0x13",
			}

		case 0x14:
			tok = token{
				Token:       "0x14",
				Title:       "EQ",
				Description: "Equality comparison",
				Value:       "0x14",
			}

		case 0x15:
			tok = token{
				Token:       "0x15",
				Title:       "ISZERO",
				Description: "Simple not operator",
				Value:       "0x15",
			}

		case 0x16:
			tok = token{
				Token:       "0x16",
				Title:       "AND",
				Description: "Bitwise AND operation",
				Value:       "0x16",
			}

		case 0x17:
			tok = token{
				Token:       "0x17",
				Title:       "OR",
				Description: "Bitwise OR operation",
				Value:       "0x17",
			}

		case 0x18:
			tok = token{
				Token:       "0x18",
				Title:       "XOR",
				Description: "Bitwise XOR operation",
				Value:       "0x18",
			}

		case 0x19:
			tok = token{
				Token:       "0x19",
				Title:       "NOT",
				Description: "Bitwise NOT operation",
				Value:       "0x19",
			}

		case 0x1a:
			tok = token{
				Token:       "0x1a",
				Title:       "BYTE",
				Description: "Retrieve single byte from word",
				Value:       "0x1a",
			}

		case 0x1b:
			tok = token{
				Token:       "0x1b",
				Title:       "SHL",
				Description: "Shift Left",
				Value:       "0x1b",
			}

		case 0x1c:
			tok = token{
				Token:       "0x1c",
				Title:       "SHR",
				Description: "Logical Shift Right",
				Value:       "0x1c",
			}

		case 0x1d:
			tok = token{
				Token:       "0x1d",
				Title:       "SAR",
				Description: "Arithmetic Shift Right",
				Value:       "0x1d",
			}

		case 0x20:
			tok = token{
				Token:       "0x20",
				Title:       "SHA3",
				Description: "Compute Keccak-256 hash",
				Value:       "0x20",
			}

		case 0x30:
			tok = token{
				Token:       "0x30",
				Title:       "ADDRESS",
				Description: "Get address of currently executing account",
				Value:       "0x30",
			}

		case 0x31:
			tok = token{
				Token:       "0x31",
				Title:       "BALANCE",
				Description: "Get balance of the given account",
				Value:       "0x31",
			}

		case 0x32:
			tok = token{
				Token:       "0x32",
				Title:       "ORIGIN",
				Description: "Get execution origination address",
				Value:       "0x32",
			}

		case 0x33:
			tok = token{
				Token:       "0x33",
				Title:       "CALLER",
				Description: "Get caller address",
				Value:       "0x33",
			}

		case 0x34:
			tok = token{
				Token:       "0x34",
				Title:       "CALLVALUE",
				Description: "Get deposited value by the instruction/transaction responsible for this execution",
				Value:       "0x34",
			}

		case 0x35:
			tok = token{
				Token:       "0x35",
				Title:       "CALLDATALOAD",
				Description: "Get input data of current environment",
				Value:       "0x35",
			}

		case 0x36:
			tok = token{
				Token:       "0x36",
				Title:       "CALLDATASIZE",
				Description: "Get size of input data in current environment",
				Value:       "0x36",
			}

		case 0x37:
			tok = token{
				Token:       "0x37",
				Title:       "CALLDATACOPY",
				Description: "Copy input data in current environment to memory",
				Value:       "0x37",
			}

		case 0x38:
			tok = token{
				Token:       "0x38",
				Title:       "CODESIZE",
				Description: "Get size of code running in current environment",
				Value:       "0x38",
			}

		case 0x39:
			tok = token{
				Token:       "0x39",
				Title:       "CODECOPY",
				Description: "Copy code running in current environment to memory",
				Value:       "0x39",
			}

		case 0x3a:
			tok = token{
				Token:       "0x3a",
				Title:       "GASPRICE",
				Description: "Get price of gas in current environment",
				Value:       "0x3a",
			}

		case 0x3b:
			tok = token{
				Token:       "0x3b",
				Title:       "EXTCODESIZE",
				Description: "Get size of an account's code",
				Value:       "0x3b",
			}

		case 0x3c:
			tok = token{
				Token:       "0x3c",
				Title:       "EXTCODECOPY",
				Description: "Copy an account's code to memory",
				Value:       "0x3c",
			}

		case 0x3d:
			tok = token{
				Token:       "0x3d",
				Title:       "RETURNDATASIZE",
				Description: "Pushes the size of the return data buffer onto the stack",
				Value:       "0x3d",
			}

		case 0x3e:
			tok = token{
				Token:       "0x3e",
				Title:       "RETURNDATACOPY",
				Description: "Copies data from the return data buffer to memory",
				Value:       "0x3e",
			}

		case 0x40:
			tok = token{
				Token:       "0x40",
				Title:       "BLOCKHASH",
				Description: "Get the hash of one of the 256 most recent complete blocks",
				Value:       "0x40",
			}

		case 0x41:
			tok = token{
				Token:       "0x41",
				Title:       "COINBASE",
				Description: "Get the block's beneficiary address",
				Value:       "0x41",
			}

		case 0x42:
			tok = token{
				Token:       "0x42",
				Title:       "TIMESTAMP",
				Description: "Get the block's timestamp",
				Value:       "0x42",
			}

		case 0x43:
			tok = token{
				Token:       "0x43",
				Title:       "NUMBER",
				Description: "Get the block's number",
				Value:       "0x43",
			}

		case 0x44:
			tok = token{
				Token:       "0x44",
				Title:       "DIFFICULTY",
				Description: "Get the block's difficulty",
				Value:       "0x44",
			}

		case 0x45:
			tok = token{
				Token:       "0x45",
				Title:       "GASLIMIT",
				Description: "Get the block's gas limit",
				Value:       "0x45",
			}

		case 0x50:
			tok = token{
				Token:       "0x50",
				Title:       "POP",
				Description: "Remove word from stack",
				Value:       "0x50",
			}

		case 0x51:
			tok = token{
				Token:       "0x51",
				Title:       "MLOAD",
				Description: "Load word from memory",
				Value:       "0x51",
			}

		case 0x52:
			tok = token{
				Token:       "0x52",
				Title:       "MSTORE",
				Description: "Save word to memory",
				Value:       "0x52",
			}

		case 0x53:
			tok = token{
				Token:       "0x53",
				Title:       "MSTORE8",
				Description: "Save byte to memory",
				Value:       "0x53",
			}

		case 0x54:
			tok = token{
				Token:       "0x54",
				Title:       "SLOAD",
				Description: "Load word from storage",
				Value:       "0x54",
			}

		case 0x55:
			tok = token{
				Token:       "0x55",
				Title:       "SSTORE",
				Description: "Save word to storage",
				Value:       "0x55",
			}

		case 0x56:
			tok = token{
				Token:       "0x56",
				Title:       "JUMP",
				Description: "Alter the program counter",
				Value:       "0x56",
			}

		case 0x57:
			tok = token{
				Token:       "0x57",
				Title:       "JUMPI",
				Description: "Conditionally alter the program counter",
				Value:       "0x57",
			}

		case 0x58:
			tok = token{
				Token:       "0x58",
				Title:       "GETPC",
				Description: "Get the value of the program counter prior to the increment",
				Value:       "0x58",
			}

		case 0x59:
			tok = token{
				Token:       "0x59",
				Title:       "MSIZE",
				Description: "Get the size of active memory in bytes",
				Value:       "0x59",
			}

		case 0x5a:
			tok = token{
				Token:       "0x5a",
				Title:       "GAS",
				Description: "Get the amount of available gas, including the corresponding reduction the amount of available gas",
				Value:       "0x5a",
			}

		case 0x5b:
			tok = token{
				Token:       "0x5b",
				Title:       "JUMPDEST",
				Description: "Mark a valid destination for jumps",
				Value:       "0x5b",
			}

		case 0x60:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			fmt.Println("xxx", len(t))
			fmt.Println("PreIDX", idx)
			fmt.Println(int(buf[idx]) - 0x60)
			idx += 1 + int(buf[idx]) - 0x60
			fmt.Println("PostIDX", idx)

			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH1",
				Description: "Place 1 byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x61:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH2",
				Description: "Place 2-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x62:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH3",
				Description: "Place 3-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x63:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH4",
				Description: "Place 4-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x64:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH5",
				Description: "Place 5-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x65:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH6",
				Description: "Place 6-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x66:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH7",
				Description: "Place 7-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x67:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH8",
				Description: "Place 8-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x68:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH9",
				Description: "Place 9-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x69:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH10",
				Description: "Place 10-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x6a:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH11",
				Description: "Place 11-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x6b:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH12",
				Description: "Place 12-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x6c:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH13",
				Description: "Place 13-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x6d:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH14",
				Description: "Place 14-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x6e:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH15",
				Description: "Place 15-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x6f:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH16",
				Description: "Place 16-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x70:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH17",
				Description: "Place 17-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x71:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH18",
				Description: "Place 18-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x72:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH19",
				Description: "Place 19-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x73:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH20",
				Description: "Place 20-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x74:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH21",
				Description: "Place 21-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x75:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH22",
				Description: "Place 22-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x76:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH23",
				Description: "Place 23-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x77:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH24",
				Description: "Place 24-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x78:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH25",
				Description: "Place 25-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x79:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH26",
				Description: "Place 26-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x7a:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH27",
				Description: "Place 27-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x7b:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH28",
				Description: "Place 28-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x7c:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH29",
				Description: "Place 29-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x7d:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH30",
				Description: "Place 30-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x7e:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH31",
				Description: "Place 31-byte item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x7f:
			t := buf[idx : 2+idx+(int(buf[idx])-0x60)]
			idx += 1 + int(buf[idx]) - 0x60
			tok = token{
				Token:       hex.EncodeToString(t),
				Title:       "PUSH32",
				Description: "Place 32-byte (full word) item on stack",
				Value:       hex.EncodeToString(t),
			}

		case 0x80:
			tok = token{
				Token:       "0x80",
				Title:       "DUP1",
				Description: "Duplicate 1st stack item",
				Value:       "0x80",
			}

		case 0x81:
			tok = token{
				Token:       "0x81",
				Title:       "DUP2",
				Description: "Duplicate 2nd stack item",
				Value:       "0x81",
			}

		case 0x82:
			tok = token{
				Token:       "0x82",
				Title:       "DUP3",
				Description: "Duplicate 3rd stack item",
				Value:       "0x82",
			}

		case 0x83:
			tok = token{
				Token:       "0x83",
				Title:       "DUP4",
				Description: "Duplicate 4th stack item",
				Value:       "0x83",
			}

		case 0x84:
			tok = token{
				Token:       "0x84",
				Title:       "DUP5",
				Description: "Duplicate 5th stack item",
				Value:       "0x84",
			}

		case 0x85:
			tok = token{
				Token:       "0x85",
				Title:       "DUP6",
				Description: "Duplicate 6th stack item",
				Value:       "0x85",
			}

		case 0x86:
			tok = token{
				Token:       "0x86",
				Title:       "DUP7",
				Description: "Duplicate 7th stack item",
				Value:       "0x86",
			}

		case 0x87:
			tok = token{
				Token:       "0x87",
				Title:       "DUP8",
				Description: "Duplicate 8th stack item",
				Value:       "0x87",
			}

		case 0x88:
			tok = token{
				Token:       "0x88",
				Title:       "DUP9",
				Description: "Duplicate 9th stack item",
				Value:       "0x88",
			}

		case 0x89:
			tok = token{
				Token:       "0x89",
				Title:       "DUP10",
				Description: "Duplicate 10th stack item",
				Value:       "0x89",
			}

		case 0x8a:
			tok = token{
				Token:       "0x8a",
				Title:       "DUP11",
				Description: "Duplicate 11th stack item",
				Value:       "0x8a",
			}

		case 0x8b:
			tok = token{
				Token:       "0x8b",
				Title:       "DUP12",
				Description: "Duplicate 12th stack item",
				Value:       "0x8b",
			}

		case 0x8c:
			tok = token{
				Token:       "0x8c",
				Title:       "DUP13",
				Description: "Duplicate 13th stack item",
				Value:       "0x8c",
			}

		case 0x8d:
			tok = token{
				Token:       "0x8d",
				Title:       "DUP14",
				Description: "Duplicate 14th stack item",
				Value:       "0x8d",
			}

		case 0x8e:
			tok = token{
				Token:       "0x8e",
				Title:       "DUP15",
				Description: "Duplicate 15th stack item",
				Value:       "0x8e",
			}

		case 0x8f:
			tok = token{
				Token:       "0x8f",
				Title:       "DUP16",
				Description: "Duplicate 16th stack item",
				Value:       "0x8f",
			}

		case 0x90:
			tok = token{
				Token:       "0x90",
				Title:       "SWAP1",
				Description: "Exchange 1st and 2nd stack items",
				Value:       "0x90",
			}

		case 0x91:
			tok = token{
				Token:       "0x91",
				Title:       "SWAP2",
				Description: "Exchange 1st and 3rd stack items",
				Value:       "0x91",
			}

		case 0x92:
			tok = token{
				Token:       "0x92",
				Title:       "SWAP3",
				Description: "Exchange 1st and 4th stack items",
				Value:       "0x92",
			}

		case 0x93:
			tok = token{
				Token:       "0x93",
				Title:       "SWAP4",
				Description: "Exchange 1st and 5th stack items",
				Value:       "0x93",
			}

		case 0x94:
			tok = token{
				Token:       "0x94",
				Title:       "SWAP5",
				Description: "Exchange 1st and 6th stack items",
				Value:       "0x94",
			}

		case 0x95:
			tok = token{
				Token:       "0x95",
				Title:       "SWAP6",
				Description: "Exchange 1st and 7th stack items",
				Value:       "0x95",
			}

		case 0x96:
			tok = token{
				Token:       "0x96",
				Title:       "SWAP7",
				Description: "Exchange 1st and 8th stack items",
				Value:       "0x96",
			}

		case 0x97:
			tok = token{
				Token:       "0x97",
				Title:       "SWAP8",
				Description: "Exchange 1st and 9th stack items",
				Value:       "0x97",
			}

		case 0x98:
			tok = token{
				Token:       "0x98",
				Title:       "SWAP9",
				Description: "Exchange 1st and 10th stack items",
				Value:       "0x98",
			}

		case 0x99:
			tok = token{
				Token:       "0x99",
				Title:       "SWAP10",
				Description: "Exchange 1st and 11th stack items",
				Value:       "0x99",
			}

		case 0x9a:
			tok = token{
				Token:       "0x9a",
				Title:       "SWAP11",
				Description: "Exchange 1st and 12th stack items",
				Value:       "0x9a",
			}

		case 0x9b:
			tok = token{
				Token:       "0x9b",
				Title:       "SWAP12",
				Description: "Exchange 1st and 13th stack items",
				Value:       "0x9b",
			}

		case 0x9c:
			tok = token{
				Token:       "0x9c",
				Title:       "SWAP13",
				Description: "Exchange 1st and 14th stack items",
				Value:       "0x9c",
			}

		case 0x9d:
			tok = token{
				Token:       "0x9d",
				Title:       "SWAP14",
				Description: "Exchange 1st and 15th stack items",
				Value:       "0x9d",
			}

		case 0x9e:
			tok = token{
				Token:       "0x9e",
				Title:       "SWAP15",
				Description: "Exchange 1st and 16th stack items",
				Value:       "0x9e",
			}

		case 0x9f:
			tok = token{
				Token:       "0x9f",
				Title:       "SWAP16",
				Description: "Exchange 1st and 17th stack items",
				Value:       "0x9f",
			}

		case 0xa0:
			tok = token{
				Token:       "0xa0",
				Title:       "LOG0",
				Description: "Append log record with no topics",
				Value:       "0xa0",
			}

		case 0xa1:
			tok = token{
				Token:       "0xa1",
				Title:       "LOG1",
				Description: "Append log record with one topic",
				Value:       "0xa1",
			}

		case 0xa2:
			tok = token{
				Token:       "0xa2",
				Title:       "LOG2",
				Description: "Append log record with two topics",
				Value:       "0xa2",
			}

		case 0xa3:
			tok = token{
				Token:       "0xa3",
				Title:       "LOG3",
				Description: "Append log record with three topics",
				Value:       "0xa3",
			}

		case 0xa4:
			tok = token{
				Token:       "0xa4",
				Title:       "LOG4",
				Description: "Append log record with four topics",
				Value:       "0xa4",
			}

		case 0xb0:
			tok = token{
				Token:       "0xb0",
				Title:       "JUMPTO",
				Description: "Tentative [libevmasm has different numbers]",
				Value:       "0xb0",
			}

		case 0xb1:
			tok = token{
				Token:       "0xb1",
				Title:       "JUMPIF",
				Description: "Tentative",
				Value:       "0xb1",
			}

		case 0xb2:
			tok = token{
				Token:       "0xb2",
				Title:       "JUMPSUB",
				Description: "Tentative",
				Value:       "0xb2",
			}

		case 0xb4:
			tok = token{
				Token:       "0xb4",
				Title:       "JUMPSUBV",
				Description: "Tentative",
				Value:       "0xb4",
			}

		case 0xb5:
			tok = token{
				Token:       "0xb5",
				Title:       "BEGINSUB",
				Description: "Tentative",
				Value:       "0xb5",
			}

		case 0xb6:
			tok = token{
				Token:       "0xb6",
				Title:       "BEGINDATA",
				Description: "Tentative",
				Value:       "0xb6",
			}

		case 0xb8:
			tok = token{
				Token:       "0xb8",
				Title:       "RETURNSUB",
				Description: "Tentative",
				Value:       "0xb8",
			}

		case 0xb9:
			tok = token{
				Token:       "0xb9",
				Title:       "PUTLOCAL",
				Description: "Tentative",
				Value:       "0xb9",
			}

		case 0xba:
			tok = token{
				Token:       "0xba",
				Title:       "GETLOCAL",
				Description: "Tentative",
				Value:       "0xba",
			}

		case 0xe1:
			tok = token{
				Token:       "0xe1",
				Title:       "SLOADBYTES",
				Description: "Only referenced in pyethereum",
				Value:       "0xe1",
			}

		case 0xe2:
			tok = token{
				Token:       "0xe2",
				Title:       "SSTOREBYTES",
				Description: "Only referenced in pyethereum",
				Value:       "0xe2",
			}

		case 0xe3:
			tok = token{
				Token:       "0xe3",
				Title:       "SSIZE",
				Description: "Only referenced in pyethereum",
				Value:       "0xe3",
			}

		case 0xf0:
			tok = token{
				Token:       "0xf0",
				Title:       "CREATE",
				Description: "Create a new account with associated code",
				Value:       "0xf0",
			}

		case 0xf1:
			tok = token{
				Token:       "0xf1",
				Title:       "CALL",
				Description: "Message-call into an account",
				Value:       "0xf1",
			}

		case 0xf2:
			tok = token{
				Token:       "0xf2",
				Title:       "CALLCODE",
				Description: "Message-call into this account with alternative account's code",
				Value:       "0xf2",
			}

		case 0xf3:
			tok = token{
				Token:       "0xf3",
				Title:       "RETURN",
				Description: "Halt execution returning output data",
				Value:       "0xf3",
			}

		case 0xf4:
			tok = token{
				Token:       "0xf4",
				Title:       "DELEGATECALL",
				Description: "Message-call into this account with an alternative account's code, but persisting into this account with an alternative account's code",
				Value:       "0xf4",
			}

		case 0xf5:
			tok = token{
				Token:       "0xf5",
				Title:       "CREATE2",
				Description: "Create a new account and set creation address to sha3(sender + sha3(init code)) % 2**160",
				Value:       "0xf5",
			}

		case 0xfa:
			tok = token{
				Token:       "0xfa",
				Title:       "STATICCALL",
				Description: "Similar to CALL, but does not modify state",
				Value:       "0xfa",
			}

		case 0xfc:
			tok = token{
				Token:       "0xfc",
				Title:       "TXEXECGAS",
				Description: "Not in yellow paper FIXME",
				Value:       "0xfc",
			}

		case 0xfd:
			tok = token{
				Token:       "0xfd",
				Title:       "REVERT",
				Description: "Stop execution and revert state changes, without consuming all provided gas and providing a reason",
				Value:       "0xfd",
			}

		case 0xfe:
			tok = token{
				Token:       "0xfe",
				Title:       "INVALID",
				Description: "Designated invalid instruction",
				Value:       "0xfe",
			}

		case 0xff:
			tok = token{
				Token:       "0xff",
				Title:       "SELFDESTRUCT",
				Description: "Halt execution and register account for later deletion",
				Value:       "0xff",
			}
		default:
			tok = token{
				Token:       hex.EncodeToString([]byte{buf[idx]}),
				Title:       "Value",
				Description: "",
				Value:       "0x" + hex.EncodeToString([]byte{buf[idx]}),
			}

		}
		toks = append(toks, tok)
		idx++
	}

	return toks, nil
}
