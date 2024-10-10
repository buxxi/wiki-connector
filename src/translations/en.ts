export default {
    title: "Wiki Connector",
    settings: 'Settings',
    language: {
        select: 'Language',
        sv: 'Swedish',
        en: 'English'
    },
    gameMode: {
        select: 'Type',
        curated: 'Curated - A list of articles chosen by me',
        random: 'Random - Fromm the complete wikipedia set',
        popular: 'Popular - Yesterdays most viewed articles'
    },
    difficulty: {
        title: 'Difficulty',
        0: 'Easiest',
        1: 'Easy',
        2: 'Medium',
        3: 'Hard',
        4: 'Hardest'
    },
    button: {
        start: 'Start',
        restart: 'Restart'
    },
    instructions: {
        title: 'How to play',
        text: 'You\'ll get {articles} articles from Wikipedia (green circles).\nEach of these pages has links to other pages.\nFind the links between all these pages.\nThere\'s also {bombs} articles that you can\'t link to (red circles).\nIf you do, you\'ll lose!'
    },
    info:{
        start: 'Starting articles',
        bombs: 'Bombs',
        found : 'Found articles',
        possible: 'Possible links',
        time: 'Elapsed time'
    },
    won : {
        title: '🥳 You won!'
    },
    lost : {
        title: '😱 You lost!'
    },
    article: {
        connections: 'Has {linkCount} connections to other articles'
    }
}