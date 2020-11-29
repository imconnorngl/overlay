const faqTooltip = document.getElementById("faq-tooltip")
var page = 0

const pages = [
`<p>${mcColorParser(`
§9Overlay In-game Commands §8»<br>
§f/t .[user] | §7Forceful add a user<br>
§f/t .h | §7Forcefully Hide Overlay<br>
§f/t .s | §7Forcefully Show Overlay<br>
§f/t .c | §7Forcefully Clear the Player List<br>
<br>
§cExamples§f§8 »<br>
§f/t .gamerboy80 | §7Forcefully adds \'§fgamerboy80§7\' to the overlay<br><br>`)}</p>`,

`<p>${mcColorParser(`
§9Threat Formula §8» (§fStar§7*§eFKDR§7^§62§8)§7/§f10<br>
§9Threat Colors §8»<br>
§7■ = 0 - 45<br>
§a■ = 46 - 80<br>
§2■ = 81 - 120<br>
§e■ = 121 - 225<br>
§6■ = 226 - 325<br>
§c■ = 326 - 650<br>
§4■ = 650+<br>
`)}</p>`
];

const increment = () => {
    if (++page >= pages.length) page = 0
    faqTooltip.innerHTML = `
    ${pages[page]}
    <a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
    <a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
    `
}

const decrement = () => {
    if (--page < 0) page = pages.length - 1
    faqTooltip.innerHTML = `
    ${pages[page]}
    <a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
    <a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
    `
}

faqTooltip.innerHTML = `
${pages[page]}
<a class="arrow" onclick=decrement()><img src="img/icons/left.png"></img></a>
<a class="arrow" onclick=increment()><img src="img/icons/right.png"></img></a>
`

const openTooltip = () => {
    document.getElementById("faq-tooltip").classList.toggle("hidden");

    if (!document.getElementById("menu").classList.contains("hidden")) 
        document.getElementById("menu").classList.add("hidden");
}