const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const request = require('request');
const inquirer = require("inquirer");
const colors = require('colors');
const program = require('commander');

var initchoices = [
{
	type: "list",
	name: "choices",
	message: "Bonjour, que voulez-vous faire ?",
	choices: [
	  "Ajouter un site",
	  "Voir les status de mes sites",
	  new inquirer.Separator(),
	  "Quitter"
	]
}
];

var listSites = require('./sitebank.json');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('SiteMonitor', { horizontalLayout: 'full' })
  )
);

var showStatus = function (name, url) {
    request.get(url).on('response', function (response) {
        if (response.statusCode == '200') {
            charStatus = 'OK';
            console.log(name + ' : ' + response.statusCode + ' ' + colors.green(charStatus));
        } else {
            charStatus = 'KO';
            console.log(name + ' : ' + response.statusCode + ' ' + colors.red(charStatus));
        }
    })
};

var displayAllStatus = function (listSites) {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Status :', { horizontalLayout: 'full' })
        )
    );

    for (i = 0; i < listSites.length; i++) {
        name = listSites[i]['name'];
        url = listSites[i]['url'];
        showStatus(name, url);
    }
};

var addSite = function(listSites) {
    var tabToAdd = [];

    var form = [
        {
            message: "Nom du site à ajouter : ",
            type: "input",
            name: "name"
        }, {
            message: "URL du site à ajouter : ",
            type: "input",
            name: "url"
        }

        ];

    clear();

    console.log(
        chalk.yellow(
            figlet.textSync('Ajouter :', { horizontalLayout: 'full' })
        )
    );

    inquirer.prompt(form).then(function(answers) {
        var fs = require('fs')

        fs.readFile('sitebank.json', function (err, data, setChoice) {
            var json = JSON.parse(data)
            json.push(answers)

            fs.writeFile("sitebank.json", JSON.stringify(json), (error) => {});
        })

        console.log(colors.green('\n' + 'Le site a bien été ajouté !'));
    });
};

var setChoice = async function (choices) {
	var choice = await inquirer.prompt(initchoices);
    if (choice.choices == 'Voir les status de mes sites') {
        displayAllStatus(listSites);
    }
    else if (choice.choices == 'Ajouter un site') {
        addSite();
    }
    else if (choice.choices == 'Quitter') {
        clear();
        process.exit();
    }
};
