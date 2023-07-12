# Ethsplainer 2.0
Originally an ETHDenver 2020 Hackathon Project and Finalist

## Purpose
To provide an education tool to help new and existing Ethereum users better understand the data and construction of things like xpubs, transactions, and raw tx data - all within a super sweet UI! 

![i1](/images/splain2.png)

---

![i2](/images/splain1.png)

## Next Steps
This project was built in a 36 hour hackathon and has many aspects that can be improved. Some planned upgrades are 
* Better educational descriptions for existing parsers
* RPC based parser plugins so parsers can be written in any language
* Additional parsers (Bitcoin Scripts / Bitcoin Tx / Generic RLP / etc.)
* Support for multiple parsers on a single input
* Better support for very large payload bodies


## Server Instructions

    git clone [repo]
    go build
    ./start_server

### Systemd
For linux systems the server may be ran as a service that starts upon boot.

    sudo cp systemd/ethsplainer-server.service /etc/systemd/system/        # Copy service definition
    sudo systemctl enable ethsplainer-server.service                        # Enable service
    sudo service ethsplainer-server restart                                 # Restart service
    journalctl -f -u ethsplainer-server                                     # Service logs

## Client Instructions

    git clone
    cd client
    yarn
    yarn dev
    Browse to localhost:3000

## Team 
@solipsis  
@peterhendrick  
@ronaldstoner  

## Contributing
Please do :) 
