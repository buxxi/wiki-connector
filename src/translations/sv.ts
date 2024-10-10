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
        restart: 'Börja om'
    },
    instructions: {
        title: 'Regler',
        text: 'Du kommer att få {articles} artiklar från Wikipedia (gröna cirklar).\nVarje av dessa artiklar har länkar till andra artiklar.\nHitta kopplingen mellan alla dessa.\nDet finns även {bombs} artiklar som du inte kan länka till (röda cirklar).\nDu förlorar om du gör det!'
    },
    info:{
        start : 'Startartiklar',
        bombs: 'Bomber',
        found : 'Funna artiklar',
        possible: 'Möjliga kopplingar',
        time: 'Åtgången tid'
    },
    won : {
        title: '🥳 Du vann!'
    },
    lost : {
        title: '😱 Du förlorade!'
    },
    article: {
        connections: '{linkCount} kopplingar till andra artiklar'
    }
}