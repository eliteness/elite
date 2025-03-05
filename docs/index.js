
function $(_) {return document.getElementById(_);}
let provider= {};
let signer= {};

window.addEventListener(
	'load',
	async function() {
		console.log("waitin for 3 secs..");
		$("cw_m").innerHTML = "Connecting.. Please wait."
		setTimeout(async () => { await basetrip(); }, 3000);
	},
	false
);

document.addEventListener('DOMContentLoaded', function() {
    paintStatic();
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById("tablinks_"+tabName).className+=" active";
    document.getElementById(tabName).style.display = "block";
    //evt?.currentTarget?.className += " active";
    //window.location = "#"+tabName;
}

function isOnRightChain(_chain) {
	return (Object.keys(CHAINS).map(i=>CHAINS[i].chainId)).indexOf(Number(_chain)) > -1 ? true : false;
}

async function basetrip() {
	//// Setup each chain's public providers
	CLP = [];
	ELITE = [];
	for(i=0;i<CL.length;i++) {
		CHAINS[CL[i]].pp = new ethers.providers.JsonRpcProvider( CHAINS[CL[i]].url );
		CHAINS[CL[i]].ELITE = new ethers.Contract( TOKENS.ELITE , LPABI, CHAINS[CL[i]].pp)
		CLP.push( CHAINS[CL[i]].pp );
		ELITE.push( CHAINS[CL[i]].ELITE )
	}
	//// Figure the user wallet
	if(!(window.ethereum)) {
		notice("<h3>Wallet wasn't detected!</h3>Please make sure that your device and browser have an active Web3 wallet like MetaMask installed and running.<br><br>Visit <a href='https://metamask.io' target='_blank'>metamask.io</a> to install MetaMask wallet.");
		await dexstats();
		// cant do anything now, cant change their chain
		return;
	}
	else if( ! isOnRightChain(window.ethereum.chainId) ) {
		notice(
			"<h3>Wrong network!</h3>You are on Chain ID #"
			+ window.ethereum.chainId
			+". Please Switch to one of these Supported Networks:<br>"
			+ CL.join(", ").replaceAll("-mainnet","")
		);
		await dexstats();
		// dont return, can still request change of chain
	}
	else if( isOnRightChain( window.ethereum.chainId ) ) { // Right Chain!
		console.log("Recognized Ethereum Chain:", window.ethereum.chainId,);
		provider = new ethers.providers.Web3Provider(window.ethereum)
		signer = provider.getSigner();
		if(!(window.ethereum.selectedAddress==null)){console.log("Found old wallet:", window.ethereum.selectedAddress);cw();}
		else{console.log("Didnt find a connected wallet!");cw();}
	}
	else { // window.ethereum exists but chain is confusing
		console.log("Couldn't find Ethereum Provider - ", window.ethereum.chainId)
		if((typeof Number(window.ethereum.chainId) == "number")){
			notice(
				"<h3>Wrong network!</h3>You are on Chain ID #"
				+ window.ethereum.chainId
				+". Please Switch to one of these Supported Networks:<br>"
				+ CL.join(",<br> ").replaceAll("-mainnet","")
			);
		}
		$("connect").innerHTML=`Wallet not found.<br><br><button onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Retry?</button>`;
		notice(`Wallet not found.<br><br><button onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Retry?</button>`);
	}

	if( // has some chain but not the one we want
		(Number(window.ethereum.chainId) != null )
		&& ( ! isOnRightChain(window.ethereum.chainId) )
	) {
		await window.ethereum.request({
    		method: "wallet_addEthereumChain",
    		params: [{
        		chainId: "0x"+( CHAINS[CL[0]].chainId ).toString(16),
        		rpcUrls: [ CHAINS[CL[0]].url ],
        		chainName: CL[0].replaceAll("mainnet",""),
        		nativeCurrency: {
            		name: CHAINS[CL[0]].gasName,
            		symbol: CHAINS[CL[0]].gasName,
            		decimals: 18
        		},
        		blockExplorerUrls: [ CHAINS[CL[0]].explorer ]
    		}]
		});
		//window.location.reload()
		notice(`Switching Network...<br>Please Refresh the Page<br><button onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</button>`);
	}
	//DrefreshFarm()
	arf()
	cw()
	await dexstats()
}


async function cw() {
	let cs = await cw2(); cs?console.log("Good to Transact"):cw2();
	cw2();
}
async function cw2() {
	if(!(window.ethereum)) {
		notice(`Metamask not detected!<br>Please Refresh the Page<br><button onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</button>`);
		return(0);
	}
	if(!(isOnRightChain(window.ethereum.chainId))) {
		notice(
			"<h3>Wrong network!</h3>You are on Chain ID #"
			+ window.ethereum.chainId
			+". Please Switch to one of these Supported Networks:<br>"
			+ CL.join(", ").replaceAll("-mainnet","")
			+ ` and then refresh this page.<br><button onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</button>`
		);
		return(0)
	}
	if(typeof provider == "undefined"){
		notice(`Provider not detected!<br>Please connect with a web3 provider or wallet and refresh this page.<br><button onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</button>`);
		return(0);
	}
	/*
	if(!
		(isFinite(Number(accounts[0])))
		|| (isFinite(Number(window.ethereum.selectedAddress)))
	){console.log("NAAAAAAAAAAAAAAAAA");window.location.reload();}
	*/

	//004
	window.ethereum
	.request({ method: 'eth_requestAccounts' })
	.then(r=>{console.log("004: Success:",r);})	//re-curse to end curse, maybe..
	.catch((error) => {	console.error("004 - Failure", r, error); });


	//005
	const accounts = await window.ethereum.request({ method: 'eth_accounts' });
	if(Number(accounts[0])>0){console.log("005: Success - ", accounts)}
	else{console.log("005: Failure", accounts)}


	/*006
	const en6 = await window.ethereum.enable()
	if(Number(en6[0]) > 0){console.log("006 - Success",en6)}
	else{console.log("006 - Failure", en6)}
	*/


	/*003
	try {
      console.log("attempting cw()")
      const addresses = await provider.request({ method: "eth_requestAccounts" });
      console.log("addresses:",addresses)
    } catch (e) {
      console.log("error in request", e);
      window.location.reload(true);
    }
    */

    //002
    //try{await provider.send("eth_requestAccounts", []);console.log("CWE:",e);}//await window.ethereum.enable();
	//catch(e){console.log("CWE:",e);window.location.reload(true)}
	console.log("doing the paints")
	$("cw").innerHTML= (window.ethereum.selectedAddress).substr(0,10) +"..."+(window.ethereum.selectedAddress).substr(34);
	$("cw_m").innerHTML=""
	$("connect").style.display="none";
	$("switch").style.display="block";
	//farm_1_f_chappro()
	gubs();
	return(1);
}
/*
function fornum(n,d)
{
	_n=(Number(n)/10**Number(d));
	n_=_n;
	if(_n>1e18){n_=(_n/1e18).toFixed(2)+" Qt."}
	else if(_n>1e15){n_=(_n/1e15).toFixed(2)+" Qd."}
	else if(_n>1e12){n_=(_n/1e12).toFixed(2)+" Tn."}
	else if(_n>1e9){n_=(_n/1e9).toFixed(2)+" Bn."}
	else if(_n>1e6){n_=(_n/1e6).toFixed(2)+" Mn."}
	else if(_n>1e3){n_=(_n/1e3).toFixed(2)+" Th."}
	else if(_n>0){n_=(_n/1e0).toFixed(5)+""}
	return(n_);
}
*/

function fornum(n,d) {
	_n=(Number(n)/10**Number(d));
	n_=_n;
	if(_n>1e18){n_=(_n/1e18).toFixed(3)+"Qt"}
	else if(_n>1e15){n_=(_n/1e15).toFixed(3)+"Qd"}
	else if(_n>1e12){n_=(_n/1e12).toFixed(3)+"T"}
	else if(_n>1e9){n_=(_n/1e9).toFixed(3)+"B"}
	else if(_n>1e6){n_=(_n/1e6).toFixed(3)+"M"}
	else if(_n>1e3){n_=(_n/1e3).toFixed(3)+"K"}
	else if(_n>1e0){n_=(_n/1e0).toFixed(5)+""}
	else if(_n>0.0){n_=(_n/1e0).toFixed(8)+""}
	return(n_);
}

function fornum2(n,d) {
	_n=(Number(n)/10**Number(d));
	n_=_n;
	if(_n>1e18){n_=(_n/1e18).toFixed(2)+" Quintillion"}
	else if(_n>1e15){n_=(_n/1e15).toFixed(2)+" Quadrillion"}
	else if(_n>1e12){n_=(_n/1e12).toFixed(2)+" Trillion"}
	else if(_n>1e9){n_=(_n/1e9).toFixed(2)+" Billion"}
	else if(_n>1e6){n_=(_n/1e6).toFixed(2)+" Million"}
	else if(_n>1e3){n_=(_n/1e3).toFixed(2)+" Thousand"}
	else if(_n>1e0){n_=(_n/1e0).toFixed(4)+""}
	else if(_n>0){n_=(_n).toFixed(8)+""}
	return(n_);
}

function fornum5(n,d) {
	return (Number(n)/10**Number(d)).toLocaleString(undefined,{maximumFractionDigits:d}) ;
}
function fornum6(n,f) {
	return (Number(n)).toLocaleString(undefined,{minimumFractionDigits:f,maximumFractionDigits:f}) ;
}


function notice(c) {
	window.location = "#note"
	$("content1").innerHTML = c
	console.log(c)
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const timeFormat = (timestamp) => {const seconds = Math.floor((Date.now() - timestamp) / 1000);const prefix = seconds < 0 ? "For the next " : "Expired ";const absSeconds = Math.abs(seconds);return prefix + (absSeconds < 60 ? absSeconds + " seconds" : absSeconds < 3600 ? Math.floor(absSeconds / 60) + " minutes" : absSeconds < 86400 ? Math.floor(absSeconds / 3600) + " hours" : absSeconds < 2592000 ? Math.floor(absSeconds / 86400) + " days" : absSeconds < 31536000 ? Math.floor(absSeconds / 2592000) + " months" : Math.floor(absSeconds / 31536000) + " years") + (seconds < 0 ? "" : " ago");};


function sortit(n,_maintable,_trName,_tdName,_dir,_firstRow,_extraRows) {
  //console.log(n,_maintable,_trName,_tdName,_dir,_firstRow,_extraRows)
  var t, r, z, i, x, y, v, b, c = 0;
  t = document.getElementById(_maintable);//.getElementsByTagName("tbody")[0];
  z = true;
  b = _dir?_dir:"a";
  while (z) {
    z = false;
    r = t.getElementsByClassName(_trName);
    _firstRow = _firstRow?_firstRow:0;
    let _lastRow = (r.length - 1) - (_extraRows ? _extraRows : 0);
    for (i = _firstRow; i < _lastRow; i++) {
    //console.log({_lastRow})
      v = false;
      x = (r[i].getElementsByClassName(_tdName)[n].textContent).replaceAll(/,| |\.|\$|%|🔥|≢|🎶|-/g,'');
      if(isFinite(x)){x=Number(x)}else{x=x.toLowerCase()}
      y = (r[i + 1].getElementsByClassName(_tdName)[n].textContent).replaceAll(/,| |\.|\$|%|🔥|≢|🎶|-/g,'');
      if(isFinite(y)){y=Number(y)}else{y=y.toLowerCase()}
    //console.log({i,x,y,_lastRow})
      if (b == "a") {
        if ((x) > (y)) {
          v= true;
          break;
        }
      } else if (b == "d") {
        if ((x) < (y)) {
          v = true;
          break;
        }
      }
    }
    if (v) {
      r[i].parentNode.insertBefore(r[i + 1], r[i]);
      z = true;
      c ++;
    } else {
      if (c == 0 && b == "a") {
        b = "d";
        z = true;
      }
    }
  }
    var t, r, z, i, x, y, v, b, c = 0;
}



LPABI = ["function balanceOf(address) public view returns(uint)","function metadata() public view returns(uint,uint,uint,uint,bool,address,address)","function getAssetPrice(address) public view returns(uint)","function approve(address,uint)","function allowance(address,address) public view returns(uint)","function earned(address,address) public view returns(uint)","function earnings(address,address) public view returns(uint)","function name() public view returns(string)","function symbol() public view returns(string)","function tvl() public view returns(uint)","function tvlDeposits() public view returns(uint)","function apr() public view returns(uint)","function totalSupply() public view returns(uint)","function deposit(uint)","function withdraw(uint)","function depositAll()","function withdrawAll()","function mint(uint)","function redeem(uint)","function mintAll()","function redeemAll()","function estimateSendFee(uint16 _dstChainId, bytes32 _toAddress, uint _amount, bool _useZro, bytes calldata _adapterParams) public view virtual override returns (uint nativeFee, uint zroFee)"]
MULTICALLPARAMS = { address: "0xcA11bde05977b3631167028862bE2a173976CA11", abi : [{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call[]","name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes[]","name":"returnData","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bool","name":"allowFailure","type":"bool"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call3[]","name":"calls","type":"tuple[]"}],"name":"aggregate3","outputs":[{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"internalType":"struct Multicall3.Result[]","name":"returnData","type":"tuple[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bool","name":"allowFailure","type":"bool"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call3Value[]","name":"calls","type":"tuple[]"}],"name":"aggregate3Value","outputs":[{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"internalType":"struct Multicall3.Result[]","name":"returnData","type":"tuple[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call[]","name":"calls","type":"tuple[]"}],"name":"blockAndAggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes32","name":"blockHash","type":"bytes32"},{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"internalType":"struct Multicall3.Result[]","name":"returnData","type":"tuple[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBasefee","outputs":[{"internalType":"uint256","name":"basefee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getBlockHash","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBlockNumber","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"chainid","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockCoinbase","outputs":[{"internalType":"address","name":"coinbase","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockDifficulty","outputs":[{"internalType":"uint256","name":"difficulty","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockGasLimit","outputs":[{"internalType":"uint256","name":"gaslimit","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockTimestamp","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getEthBalance","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastBlockHash","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"requireSuccess","type":"bool"},{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call[]","name":"calls","type":"tuple[]"}],"name":"tryAggregate","outputs":[{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"internalType":"struct Multicall3.Result[]","name":"returnData","type":"tuple[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bool","name":"requireSuccess","type":"bool"},{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call[]","name":"calls","type":"tuple[]"}],"name":"tryBlockAndAggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes32","name":"blockHash","type":"bytes32"},{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"internalType":"struct Multicall3.Result[]","name":"returnData","type":"tuple[]"}],"stateMutability":"payable","type":"function"}] }



async function paintStatic() {

    document.getElementsByClassName('tablinks')[0].click();
	paintStaticSuppliesTableHeads()
	paintStaticPortfolioTableHeads()
	paintStaticBridgeTableHeads()
}
function paintStaticSuppliesTableHeads(){

	$("supplies-table").innerHTML = `
		<div class="c2a90-row">
			<div onclick="sortit(0, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">					<br><span class="c2a90-row-byline"></span></div>
			<div onclick="sortit(1, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Blockchains		<br><span class="c2a90-row-byline">Network</span></div>
			<div onclick="sortit(2, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Amounts			<br><span class="c2a90-row-byline">On-chain Supply</span></div>
			<div onclick="sortit(3, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Valuations		<br><span class="c2a90-row-byline">Capitalization</span></div>
			<div onclick="sortit(4, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Percentages		<br><span class="c2a90-row-byline">Distribution</span></div>
		</div>
		<div id="supplies-loader" style="font-family:italic"><br><br>Counting ≢ across 10 chains, please wait ...</div>
	`;
}
function paintStaticPortfolioTableHeads(){

	$("portfolio-table").innerHTML = `
		<div class="c2a90-row">
			<div onclick="sortit(0, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">					<br><span class="c2a90-row-byline"></span></div>
			<div onclick="sortit(1, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Blockchains		<br><span class="c2a90-row-byline">Network</span></div>
			<div onclick="sortit(2, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">My Balances		<br><span class="c2a90-row-byline">On-chain Supply</span></div>
			<div onclick="sortit(3, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Valuations		<br><span class="c2a90-row-byline">Capitalization</span></div>
			<div onclick="sortit(4, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 1)">Percentages		<br><span class="c2a90-row-byline">Distribution</span></div>
		</div>
		<div id="portfolio-loader" style="font-family:italic"><br><br>Counting your ≢ balances across 10 chains, please wait ...</div>
	`;

}
function paintStaticBridgeTableHeads(){
	$("bridge-table").innerHTML = `
		<div class="c2a90-row">
			<div onclick="sortit(0, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 0)">					<br><span class="c2a90-row-byline"></span></div>
			<div onclick="sortit(1, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 0)">Select Chain		<br><span class="c2a90-row-byline">to send ≢ to</span></div>
			<div onclick="sortit(2, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 0)">Gas & LZ Cost		<br><span class="c2a90-row-byline">On-chain Supply</span></div>
			<div onclick="sortit(3, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 0)">Amount of ≢ to Bridge		<br><span class="c2a90-row-byline">Input your amount<span></div>
			<div onclick="sortit(4, 'supplies-table', 'c2a90-row', 'c2a90-row-item', null, 1, 0)">Actions<br><span class="c2a90-row-byline">Start Transaction</span></div>
		</div>
		<div id="bridge-loader" style="font-family:italic"><br><br>Counting your ≢ balances across 10 chains, please wait ...</div>
	`;

    return

}

async function dexstats() {

	TVLGURU_FANTOM = new ethers.Contract("0x0786c3a78f5133f08c1c70953b8b10376bc6dcad",["function p_t_coin_usd(address) public view returns(uint)"], CHAINS["fantom-mainnet"].pp);
	_price_elite_fantom = (await TVLGURU_FANTOM.p_t_coin_usd("0xea035a13b64cb49d85e2f0a2736c9604cb21599c"))/1e18;
	_price_elite = _price_elite_fantom / 300000;

	_supplies = (await Promise.all(ELITE.map(i=> i.totalSupply() ))).map( i=> Number(i)/1e18 )
	_totsup = _supplies.reduce( (a,b) => a+b )

	paintStaticSuppliesTableHeads()
	try{$("supplies-loader").remove()}catch(e){}
	$("topstats-totsup").innerHTML = "≢"+fornum6( _totsup , 0)
	$("topstats-fdv").innerHTML = "$"+fornum6(_price_elite * _totsup , 0)

	for(i=0;i<CL.length;i++) {
		$("supplies-table").innerHTML += `
			<div class="c2a90-row">
				<div class="c2a90-row-item"><img src="${ CHAINS[CL[i]].chainLogo }"></div>
				<div class="c2a90-row-item">${ CL[i].replaceAll("-mainnet","")}</div>
				<div class="c2a90-row-item">≢${ fornum6(_supplies[i] , 0) }</div>
				<div class="c2a90-row-item">$${ fornum6(_supplies[i] * _price_elite, 0) } </div>
				<div class="c2a90-row-item">${ fornum6(_supplies[i]/_totsup * 100 , 2) } %</div>
			</div>
		`;
	}

	$("supplies-table").innerHTML += `
		<div class="hhr"></div>
		<div class="c2a90-row port-total">
			<div><br><img src="${ LOGOS.ELITE }"></div>
			<div><br>Total</div>
			<div><br>≢${ fornum6(_totsup, 0) }</div>
			<div><br>$${ fornum6(_totsup * _price_elite, 0) }</div>
			<div><br>${ fornum6(100, 2) }%</div>
		</div>
	`;

	sortit(2, 'supplies-table', 'c2a90-row', 'c2a90-row-item', "d", 1, 1)




	return ;


}


async function arf(){
	let c=0;
	var xfr = setInterval(
		async function(){
			console.log("refreshing farm stats", new Date(), c );
			try {
				if( ethers?.utils?.isAddress(window?.ethereum?.selectedAddress) ) { gubs();}
				dexstats()
			}
			catch(e) { console.log('hmm..'); }
			c++;
		},
		16_000
	);
}
async function gubs() {

	_userbals= (await Promise.all(ELITE.map(i=> i.balanceOf( window.ethereum.selectedAddress ) ))).map( i=> Number(i)/1e18 )
	_usertot = _userbals.reduce( (a,b) => a+b )

	paintStaticPortfolioTableHeads()
	try{$("portfolio-loader").remove()}catch(e){}


	for(i=0;i<CL.length;i++) {
		$("portfolio-table").innerHTML += `
			<div class="c2a90-row">
				<div class="c2a90-row-item"><img src="${ CHAINS[CL[i]].chainLogo }"></div>
				<div class="c2a90-row-item">${ CL[i].replaceAll("-mainnet","")}</div>
				<div class="c2a90-row-item">≢${ fornum6(_userbals[i] , 0) }</div>
				<div class="c2a90-row-item">$${ fornum6(_userbals[i] * _price_elite, 0) } </div>
				<div class="c2a90-row-item">${ fornum6(_userbals[i]/_usertot* 100 , 2) } %</div>
			</div>
		`;
	}

	$("portfolio-table").innerHTML += `
		<div class="hhr"></div>
		<div class="c2a90-row port-total">
			<div><br><img src="${ LOGOS.ELITE }"></div>
			<div><br>Total</div>
			<div><br>≢${ fornum6(_usertot, 0) }</div>
			<div><br>$${ fornum6(_usertot * _price_elite, 0) }</div>
			<div><br>${ fornum6(100, 2) }%</div>
		</div>
	`;

	sortit(2, 'portfolio-table', 'c2a90-row', 'c2a90-row-item', "d", 1, 1);

	//let _curnetid = (await provider.getNetwork()).chainId
	_curnetid = window.ethereum.chainId
	_curnet = {}
	for(i=0;i<CL.length;i++) {
		if( CHAINS[CL[i]].chainId == _curnetid ) {
			_curnet = CHAINS[CL[i]];
			_curnet.name = CL[i].replaceAll("-mainnet","");
			_curnet.pp = CHAINS[CL[i]].pp; // Object assign doesnt deep copy
			_curnet.clindex = i;
			break;
		}
	}
	if( _curnet == {} ) {
		notice(
			"<h3>[3] Wrong network!</h3>You are on Chain ID #"
			+ window.ethereum.chainId
			+". Please Switch to one of these Supported Networks:<br>"
			+ CL.join(",<br> ").replaceAll("-mainnet","")
		);
	}

	$("bridge-curnet-bal").innerHTML = `
		<img class="curchain-icon" src="${ CHAINS[CL[_curnet.clindex]].chainLogo }"> Connected to ${_curnet.name}.
		<h3>≢${ fornum6(_userbals[_curnet.clindex] ,0) } in Wallet</h3>
	`;

	paintStaticBridgeTableHeads()
	try{$("bridge-loader").remove()}catch(e){}

	for(i=0;i<CL.length;i++) {
		if( i == _curnet.clindex ) continue;

		$("bridge-table").innerHTML += `
			<div class="c2a90-row">
				<div class="c2a90-row-item"><img src="${ CHAINS[CL[i]].chainLogo }"></div>
				<div class="c2a90-row-item">${ CL[i].replaceAll("-mainnet","") }</div>
				<div class="c2a90-row-item"><span class="bridge-btn-gascheck" id="bridge-btn-gascheck-${i}" onclick='bridge_gasCheck(${i})'>&#x21bb; Check Gas Cost</span></div>
				<div class="c2a90-row-item"><input placeholder="≢ to ${CL[i].replaceAll('-mainnet','')}" id="bridge-inp-${i}"/></div>
				<div class="c2a90-row-item"><button class="bridge-btn-submit" onclick='bridge_submit(${i})'>Bridge </button></div>
			</div>
		`;
	}

	_mc = new ethers.Contract( MULTICALLPARAMS.address, MULTICALLPARAMS.abi, _curnet.pp );
	_alltolzids = CL.map( i=> CHAINS[i].lzid);
	_allgascalls = _alltolzids.map(
		i=> {
			return {
				allowFailure: true,
				target: ELITE[_curnet.clindex].address ,
				callData: (
					ELITE[ _curnet.clindex ].interface.encodeFunctionData( //
						"estimateSendFee" ,
						[
							i,
							ethers.utils.hexZeroPad( SAFE_ADDR, 32) ,
							BigInt(1e18),
							false,
							DEFAULT_PARAMS
						]
					)
				)
			}
		}
	)
	_allgascosts = await _mc.callStatic.aggregate3(_allgascalls)


	_allgascosts = _allgascosts.map( i=> { return ( i[0]==false ? "Route Unavailable" : ( fornum6(Number(i[1].substr(0,66))/1e18 , 6) + " " + CHAINS[CL[_curnet.clindex]].gasName) )} )

	for(i=0;i<CL.length;i++) {
		if( i == _curnet.clindex ) continue;
		$("bridge-btn-gascheck-"+i).innerHTML = _allgascosts[i]
	}

	return;
}

const DEFAULT_PARAMS = "0x00010000000000000000000000000000000000000000000000000000000000030d40";

async function bridge_gasCheck(_toclid) {
	let _gasreq = await ELITE[_curnet.clindex].estimateSendFee(
		CHAINS[CL[_toclid]].lzid ,
		ethers.utils.hexZeroPad(ethereum.selectedAddress, 32) ,
		BigInt(1e18),
		false,
		DEFAULT_PARAMS
	)
	$("bridge-btn-gascheck-"+_toclid).innerHTML = "&#x21bb; " + fornum6(_gasreq[0]/1e18,6) + " " + CHAINS[_curnet.clindex].gasName
}









async function mint(ismax) {
	_BASE = new ethers.Contract(BASE, LPABI, signer);
	_WRAP = new ethers.Contract(WRAP, LPABI, signer);
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, LPABI, signer);

	al = await Promise.all([
		_BASE.allowance(window.ethereum.selectedAddress, DEPOSITOR),
		_BASE.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("mint-amt").value;
		if(!isFinite(_oamt) || _oamt<1/(10**DECIMAL)){notice(`Invalid ${BASE_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Balance:</h3>${Number(al[1])/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${BASE_NAME}.`);return;}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${BASE_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		let _tr = await _BASE.approve(DEPOSITOR,_oamt);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${BASE_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Minting ${WRAP_NAME}</b><br>

		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} to Deposit: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Expected: <b>${fornum5(_oamt,DECIMAL)}</b><br>

		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await _DEPOSITOR.mint(_oamt,{gasLimit:BigInt(1_200_000)});
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Minting ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Depositing: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Expecting: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Deposited: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Received: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}



async function redeem(ismax) {
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, LPABI, signer);

	al = await Promise.all([
		_WRAP.allowance(window.ethereum.selectedAddress, DEPOSITOR),
		_WRAP.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("redeem-amt").value;
		if(!isFinite(_oamt)){notice(`Invalid ${WRAP_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Balance:</h3>${al[1]/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${WRAP_NAME}.`);return;}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${WRAP_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		let _tr = await _WRAP.approve(DEPOSITOR,_oamt);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${WRAP_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Redeeming ${WRAP_NAME}</b><br>

		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} to Redeem: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Expected: <b>${fornum5(_oamt,DECIMAL)}</b><br>

		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await _DEPOSITOR.redeem(_oamt,{gasLimit:BigInt(1_200_000)});
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Redeeming ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Redeeming: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Expecting: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Redeemed: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Received: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}

async function stake(ismax) {
	_BASE = new ethers.Contract(BASE, LPABI, signer);
	_WRAP = new ethers.Contract(WRAP, LPABI, signer);
	_FARM = new ethers.Contract(FARM, LPABI, signer);

	al = await Promise.all([
		_WRAP.allowance(window.ethereum.selectedAddress, FARM),
		_WRAP.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("stake-amt").value;
		if(!isFinite(_oamt) || _oamt<1/(10**DECIMAL)){notice(`Invalid ${BASE_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}


	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Balance:</h3>${Number(al[1])/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${WRAP_NAME}.`);return}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${WRAP_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		//let _tr = await _WRAP.approve(FARM,_oamt);
		let _tr = await _WRAP.approve(FARM, ethers.constants.MaxUint256);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${WRAP_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Staking ${WRAP_NAME}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} to Stake: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await (ismax ? _FARM.depositAll() : _FARM.deposit(_oamt));
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Staking ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Staking: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${WRAP_NAME} Staked: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}

async function unstake(ismax) {
	_FARM = new ethers.Contract(FARM, LPABI,signer);

	al = await Promise.all([
		_FARM.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[0];
	}
	else {
		_oamt = $("unstake-amt").value;
		if(!isFinite(_oamt)){notice(`Invalid ${WRAP_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)));
	}

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Staked Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Staked Balance:</h3>${al[1]/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or Stake some more ${WRAP_NAME}.`); return}

	notice(`
		<h3>Order Summary</h3>
		<b>Withdrawing ${WRAP_NAME}</b><br>

		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} to Redeem: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Expected: <b>${fornum5(_oamt,DECIMAL)}</b><br>

		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await (ismax ? _FARM.withdrawAll() : _FARM.withdraw(_oamt));
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Unstaking ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Unstaking: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Unstaked: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}

async function claim() {
	_FARM = new ethers.Contract(FARM, LPABI,signer);
	_VOTER = new ethers.Contract(VOTER, ["function claimRewards(address[],address[][])"],signer);

	_earned = await Promise.all([
		_FARM.earned(TEARNED[0], window.ethereum.selectedAddress),
		_FARM.earned(TEARNED[1], window.ethereum.selectedAddress),
	]);

	if(Number(_earned[0]) == 0 && Number(_earned[1]) == 0 ) {notice(`<h3>You dont have any pending rewards!</h3> Stake some ${WRAP_NAME} to earn more!`); return;}

	notice(`
		<h3>Order Summary</h3>
		<b>Claiming ${TEARNED_NAME.join("+")} rewards</b>
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[0]}"> <b>${fornum5(_earned[0],18)}</b> ${TEARNED_NAME[0]}
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[1]}"> <b>${fornum5(_earned[1],18)}</b> ${TEARNED_NAME[1]}
		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await _VOTER.claimRewards([FARM],[TEARNED],{gasLimit:BigInt(1_500_000)});
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<b>Claiming ${TEARNED_NAME.join("+")} rewards</b>
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[0]}"> <b>${fornum5(_earned[0],18)}</b> ${TEARNED_NAME[0]}
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[1]}"> <b>${fornum5(_earned[1],18)}</b> ${TEARNED_NAME[1]}
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<b>Claiming ${TEARNED_NAME.join("+")} rewards</b>
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[0]}"> <b>${fornum5(_earned[0],18)}</b> ${TEARNED_NAME[0]}
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[1]}"> <b>${fornum5(_earned[1],18)}</b> ${TEARNED_NAME[1]}
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}
