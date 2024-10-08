export default {
    title: "Wiki connector",
    settings: 'Settings',
    language: {
        select: 'Language',
        sv: 'Swedish',
        en: 'English'
    },
    gameMode: {
        select: 'Type',
        curated: 'Curated',
        random: 'Random',
        popular: 'Popular'
    },
    difficulty: 'Difficulty',
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
        title: 'You won!'
    },
    lost : {
        title: 'You lost!'
    },
    article: {
        connections: 'Has {linkCount} connections to other articles'
    }
}