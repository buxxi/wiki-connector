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
        random: 'Random - From the complete wikipedia set',
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
        restart: 'Restart',
        new: 'New game'
    },
    instructions: {
        title: 'How to play',
        text: 'You\'ll get {articles} articles from Wikipedia (green circles).\nEach of these pages has links to other pages.\nFind the links between all these pages.\nThere\'s also {bombs} articles that you can\'t link to (red circles).\nIf you do, you\'ll lose!'
    },
    results: {
        title: 'Results',
        won : {
            title: '🥳 You won!',
            connected: 'You connected {firstTitle} with {otherTitles} and avoided all bombs!',
            stats: 'And all this in only {steps} steps in {time}, well done!'
        },
        lost : {
            title: '😱 You lost!',
            connected: 'Oops! You connected {firstTitle} with {bombTitle} which was one of the bombs.'
        }
    },
    history: {
        title: 'History',
        date: 'Date',
        won: 'Win/Loss',
        shortest: 'Shortest path'
    },
    info:{
        start: 'Starting articles',
        bombs: 'Bombs',
        found : 'Found articles',
        possible: 'Possible links',
        time: 'Elapsed time'
    },
    article: {
        connections: 'Has {linkCount} connections to other articles'
    },
    and: ' and '
}