var app = (function () {
    'use strict'; // execute javascript in strict mode. Eg: usage of undeclared variables is not allowed.

    const baseUrlCoingecko = 'https://api.coingecko.com/api/v3/';
	const urlCoinList = baseUrlCoingecko + 'coins/list';

	const baseUrlFirstOrg = "https://api.first.org/data/v1/";
	const urlCountries = baseUrlFirstOrg + "countries";

    let initDashboard = function () {
		requestCoins();
	}

	let requestCoins = function () {
		console.log('Get Coin Data');
		fetch(urlCoinList, { mode: 'cors' })
			.then(function (response) {
				if (response.status !== 200) {
					console.log("Error: " + response.status);
					return;
				}
				return response.json();
			})
			.then(function (response) {
				console.log('Get Coin Data Request successful');
				renderRequestedDataForCoins(response);
			})
			.catch(function (error) {
				console.log('Get Coin Data Request failed', error)
			});
    }


    let renderRequestedDataForCoins = function(coins) {

        var coinsListContainerElement = document.getElementById("coinsList");

        coins.forEach(coin => {
            let coinToCreate = new Coin(coin.name);

            let li = document.createElement("li");
            li.style.position = "relative";
            li.textContent = coinToCreate.name;

            let i = document.createElement("i");
            i.classList.add("fa", "fa-plus-circle");

            let button = document.createElement("button");
            button.classList.add("icon");
            button.addEventListener("click", function () { app.addCoinToWalletList(coinToCreate); })

            button.append(i);
            li.append(button);

            coinsListContainerElement.append(li);
        });

    }

    let searchCoinsList = function () {

        var input, searchString, coinsList;
        input = document.getElementById("coinsSearch");
        searchString = input.value.toLowerCase();
        coinsList = document.getElementById("coinsList").querySelectorAll("li");
        coinsList.forEach((coin, index) => {
            if (coin.textContent.toLowerCase().indexOf(searchString) == -1) {
                coinsList[index].style.display = 'none';
            } else {
                coinsList[index].style.display = '';
            }
        });
    }

    let addCoinToWalletList = function(coinToAdd) {
        let walletListContainerElement = document.getElementById("walletList");
        var historyListContainerElement = document.getElementById("history");

        var walletList = walletListContainerElement.querySelectorAll("li");
        var add = true;

        if (walletList.length > 0) {
            walletList.forEach(existingCoin => {
                if (coinToAdd.name == existingCoin.textContent) {
                    let message = "Already added " + coinToAdd.name;
                    alert(message);

                    let p = document.createElement("p");
                    p.textContent = message;
                    historyListContainerElement.append(p);

                    add = false;
                } 
            });
        }

        if (add) {
            let li = document.createElement("li");
            li.style.position = "relative";
            li.textContent = coinToAdd.name;

            let i = document.createElement("i");
            i.classList.add("fa", "fa-minus-circle");

            let button = document.createElement("button");
            button.classList.add("icon");
            button.addEventListener("click", function () { app.removeCoinFromWalletList(this); })

            button.append(i);
            li.append(button);

            let p = document.createElement("p");
            p.textContent = "Added " + coinToAdd.name;

            walletListContainerElement.append(li);
            historyListContainerElement.append(p);
        } 
    }

    let removeCoinFromWalletList = function(button) {
        var historyListContainerElement = document.getElementById("history");
        let liToRemove = button.closest("li");


        let p = document.createElement("p");
        p.textContent = "Removed " + liToRemove.textContent;

        liToRemove.remove();
        historyListContainerElement.append(p);
	}


	let initProfile = function () {
		requestCountries();
	}

	let requestCountries = function () {
		console.log('Get Countries Data');
		fetch(urlCountries, { mode: 'cors' })
			.then(function (response) {
				if (response.status !== 200) {
					console.log("Error: " + response.status);
					return;
				}
				return response.json();
			})
			.then(function (response) {
				console.log('Get Countries Data Request successful');
				renderRequestedDataForCountries(response);
			})
			.catch(function (error) {
				console.log('Get Countries Data Request failed', error)
			});
	}

	let renderRequestedDataForCountries = function (data) {
		var countriesDropdown = document.getElementById("countries");

		var countries = Object.values(data.data);

		countries.forEach(countries => {
			let option = document.createElement("option");
			option.text = countries.country;
			countriesDropdown.add(option);
		});
	}

	let checkForm = function () {
		var fehler = "";
		var name = /^[A-Z][a-z]+$/;
		var gebdat = /(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var gebdat2 = /31\.02\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var gebdat3 = /30\.02\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var gebdatapril = /31\.04\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var gebdatjuni = /31\.06\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var gebdatsept = /31\.09\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var gebdatnov = /31\.11\.(19\d{2}|20[0-1][0-1]|200[0-9])\b/;
		var strasse = /^[A-Z][a-z\u00df]+\s([0-9\/])+[a-z]{0,1}$/;
		var plz = /[1-9][0-9][0-9][0-9]/;
		var ort = /^[A-Z][a-z]+$/;
		var antwort = /^[A-Z0-9][a-z0-9]{4,20}/;
		var mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		var passwort = /[A-Za-z0-9]{7,30}/;


		if (document.formular.country.value == "Land ausw\u00e4hlen") {
			fehler += "Sie haben kein Land gew\u00e4hlt.\n";
			document.formular.country.style.borderColor = "#FF9093";
		} else {
			document.formular.country.style.borderColor = "#808080";
		}

		if (document.formular.bday.value.match(gebdat)) {
			document.formular.bday.style.borderColor = "#808080";
		} else {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.bday.value.match(gebdat2)) {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.bday.value.match(gebdat3)) {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.bday.value.match(gebdatapril)) {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.bday.value.match(gebdatjuni)) {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.bday.value.match(gebdatsept)) {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.bday.value.match(gebdatnov)) {
			fehler += "Ung\u00fcltiges Geburtsdatum eingegeben.\n";
			document.formular.bday.style.borderColor = "#FF9093";
		}

		if (document.formular.title.value == "Titel ausw\u00e4hlen") {
			fehler += "Sie haben keinen Titel gew\u00e4hlt.\n";
			document.formular.title.style.borderColor = "#FF9093";
		} else {
			document.formular.title.style.borderColor = "#808080";
		}

		if (document.formular.name.value.match(name)) {
			document.formular.name.style.borderColor = "#808080";
		} else {
			fehler += "Vorname enth\u00e4lt ung\u00fcltige Zeichen.\n";
			document.formular.name.style.borderColor = "#FF9093";
		}

		if (document.formular.surname.value.match(name)) {
			document.formular.surname.style.borderColor = "#808080";
		} else {
			fehler += "Nachname enth\u00e4lt ung\u00fcltige Zeichen.\n";
			document.formular.surname.style.borderColor = "#FF9093";
		}

		if (document.formular.street.value.match(strasse)) {
			document.formular.street.style.borderColor = "#808080";
		} else {
			fehler += "Stra\u00dfe enth\u00e4lt ung\u00fcltige Zeichen.\n";
			document.formular.street.style.borderColor = "#FF9093";
		}

		if (document.formular.plz.value.match(plz)) {
			document.formular.plz.style.borderColor = "#808080";
		} else {
			fehler += "PLZ enth\u00e4lt ung\u00fcltige Zeichen.\n";
			document.formular.plz.style.borderColor = "#FF9093";
		}

		if (document.formular.town.value.match(ort)) {
			document.formular.town.style.borderColor = "#808080";
		} else {
			fehler += "Ort enth\u00e4lt ung\u00fcltige Zeichen.\n";
			document.formular.town.style.borderColor = "#FF9093";
		}

		if (document.formular.email.value.match(mail)) {
			document.formular.email.style.borderColor = "#808080";
		} else {
			fehler += "E-mail enth\u00e4lt ung\u00fcltige Zeichen.\n";
			document.formular.email.style.borderColor = "#FF9093";
		}

		if (document.formular.email.value == document.formular.verifyemail.value && document.formular.verifyemail.value != "") {
			document.formular.verifyemail.style.borderColor = "#808080";
		} else {
			fehler += "E-mail stimmt nicht \u00fcberein.\n";
			document.formular.verifyemail.style.borderColor = "#FF9093";
		}

		if (document.formular.password.value.match(passwort)) {
			document.formular.password.style.borderColor = "#808080";
		} else {
			if (document.formular.password.value.length <= 7) {
				fehler += "Passwort ist zu kurz.\n";
				document.formular.password.style.borderColor = "#FF9093";
			} else {
				fehler += "Passwort enth\u00e4lt ung\u00fcltige Zeichen.\n";
				document.formular.password.style.borderColor = "#FF9093";
			}
		}

		if (document.formular.password.value == document.formular.verifypassword.value && document.formular.verifypassword.value != "") {
			document.formular.verifypassword.style.borderColor = "#808080";
		} else {
			fehler += "Passwort stimmt nicht \u00fcberein.\n";
			document.formular.verifypassword.style.borderColor = "#FF9093";
		}

		if (document.formular.question.value == "Frage ausw\u00e4hlen") {
			fehler += "Sie haben keine Frage gew\u00e4hlt.\n";
			document.formular.question.style.borderColor = "#FF9093";
		} else {
			document.formular.question.style.borderColor = "#808080";
		}

		if (document.formular.answer.value.match(antwort)) {
			document.formular.answer.style.borderColor = "#808080";
		} else {
			if (document.formular.answer.value.length <= 4) {
				fehler += "Antwort ist zu kurz.\n";
				document.formular.answer.style.borderColor = "#FF9093";
			} else {
				fehler += "Antwort enth\u00e4lt ung\u00fcltige Zeichen.\n";
				document.formular.answer.style.borderColor = "#FF9093";
			}
		}

		if (document.formular.agb.checked == false) {
			fehler += "Nutzungsbestimmungen wurden nicht akzeptiert.\n";
		}

		if (fehler.length > 0) {
			alert("Folgende Probleme sind aufgetreten: \n\n" + fehler);
		} else {
			alert("Erfolgreich angemeldet");
		}
	}


    //public functions and variables
    return {
        initDashboard: initDashboard,
		requestCoins: requestCoins,
        searchCoinsList: searchCoinsList,
        addCoinToWalletList: addCoinToWalletList,
		removeCoinFromWalletList: removeCoinFromWalletList,
		initProfile: initProfile,
		checkForm: checkForm,
    }
}());