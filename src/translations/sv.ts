export default {
    title: "Wiki Ihopkopplaren",
    settings: 'Inställningar',
    language: {
        select: 'Språk',
        sv: 'Svenska',
        en: 'Engelska'
    },
    gameMode: {
        select: 'Spelsätt',
        curated: 'Utvalda - En utvald lista av mig',
        random: 'Slumpmässiga - Från samtliga artiklar på Wikipedia',
        popular: 'Populära - Gårdagens mest visade artiklar'
    },
    difficulty: {
        title: 'Svårighetsgrad',
        0: 'Lättast',
        1: 'Lätt',
        2: 'Normal',
        3: 'Svår',
        4: 'Svårast'
    },
    button: {
        start: 'Starta',
        restart: 'Börja om',
        new: 'Nytt spel'
    },
    instructions: {
        title: 'Regler',
        text: 'Du kommer att få {articles} artiklar från Wikipedia (gröna cirklar).\nVarje av dessa artiklar har länkar till andra artiklar.\nHitta kopplingen mellan alla dessa.\nDet finns även {bombs} artiklar som du inte kan länka till (röda cirklar).\nDu förlorar om du gör det!'
    },
    results: {
        title: 'Resultat',
        won : {
            title: '🥳 Du vann!',
            connected: 'Du lyckades koppla ihop {firstTitle} med {otherTitles} samtidigt som du undvek alla bomber!',
            stats: 'Och detta gjorde du med bara {steps} steg under {time}, bra jobbat!'
        },
        lost : {
            title: '😱 Du förlorade!',
            connected: 'Ojdå! Du kopplade ihop {firstTitle} med en av bomberna.'
        }
    },
    info:{
        start : 'Startartiklar',
        bombs: 'Bomber',
        found : 'Funna artiklar',
        possible: 'Möjliga kopplingar',
        time: 'Åtgången tid'
    },
    history: {
        title: 'Historik',
        date: 'Datum',
        won: 'Vinst/Förlust',
        shortest: 'Kortast sträcka'
    },
    article: {
        connections: '{linkCount} kopplingar till andra artiklar'
    },
    and: ' och ',
    guess: {
        placeholder: 'Gör din gissning här'
    },
    keylegend: {
        enter: {
            name: ' ↵ ',
            value: 'Gissa'
        },
        tab: {
            name: 'Tab',
            value: 'Välj markerad'
        },
        up: {
            name: '↑',
            value: 'Visa föregående'
        },
        down: {
            name: '↓',
            value: 'Visa nästa'
        }
    }
}