type Pixel = number;
type Degree = number;
type ScreenRelative = number;
type SizeRelative = number;

export const MAX_FPS = 30;
export const NODE_FORCE_FIELD_SIZE: SizeRelative = 1.5;
export const BORDER_FORCE_FIELD_SIZE: SizeRelative = 0.5;
export const MOVE_SLOW_RATIO = 1.25;
export const BALLOON_COUNT = 30;
export const BALLOON_MIN_SIZE: Pixel = 25;
export const BALLOON_MAX_SIZE: Pixel = 75;
export const BALLOON_MIN_SPEED: ScreenRelative = 0.2;
export const BALLOON_MAX_SPEED: ScreenRelative = 0.6;
export const BLOOD_POINT_SPACING: ScreenRelative = 0.025;
export const BLOOD_RANDOM_Y_OFFSET: ScreenRelative = 0.1;
export const BLOOD_MINIMUM_SPEED: ScreenRelative = 0.1;
export const BLOOD_MAXIMUM_SPEED: ScreenRelative = 0.2;
export const JIGSAW_PIECE_SIZE: Pixel = 50;
export const JIGSAW_HOLE_SIZE: Pixel = 10;
export const CONFETTI_COLORS = ['red', 'white', 'blue', 'orange', 'green'];
export const CONFETTI_COUNT = 1000;
export const CONFETTI_MAX_ROTATION_SPEED: Degree = 720;
export const CONFETTI_MIN_ROTATION_SPEED: Degree = 360;
export const CONFETTI_MAX_SPEED: ScreenRelative = 1.25;
export const CONFETTI_MIN_SPEED: ScreenRelative = 0.3;
export const CONFETTI_GRAVITY: ScreenRelative = 0.01;
export const CONFETTI_MAX_LENGTH: Pixel = 20;
export const CONFETTI_MIN_LENGTH: Pixel = 5;
export const CONFETTI_MAX_THICKNESS: Pixel = 8;
export const CONFETTI_MIN_THICKNESS: Pixel = 4;

export const WIKI_ARTICLES = {
	curated: {
		en: [
			"Bamse", "Snoopy", "Asterix (character)", "Goku", "Tintin (character)", "Yogi Bear", "Pelle Svanslös", "Doraemon", "Eric Cartman", "Peppa Pig",   //Cartoons
			"Saturn", "International Space Station", "Hubble Space Telescope", "Milky Way", "Comet", "Apollo 11", "Black hole", "Sun", "Satellite", "Alien abduction",    //Space
			"Charlie Chaplin", "Laurel and Hardy", "Mr. Bean (character)", "Abbott and Costello", "Benny Hill", "Ace Ventura", "Buster Keaton", "The Three Stooges", "Steve Martin",  //Slapstick
			"Jesus", "Moses", "Muhammad", "The Buddha", "L. Ron Hubbard", "Judas Iscariot", "Noah", "Joseph Smith", "Guru Nanak", "Adam and Eve",    //Religion
			"Foot", "Tail", "Eye", "Beak", "Heart", "Tongue", "Thumb", "Knee", "Kidney", "Hair",  //Body parts
			"Red panda", "Platypus", "Hammerhead shark", "Meerkat", "Rabbit", "Narwhal", "King cobra", "Coccinellidae", "Rat", "Kangaroo",    //Animals
			"Telephone", "Wheel", "Steam engine", "Computer", "Tesla coil", "Paper", "Electric light", "Antibiotic", "Concrete", "Blimp",  //Inventions
			"Ruby", "Diamond", "Aquamarine (gem)", "Sapphire", "Emerald", "Opal", "Pearl", "Amethyst", "Moonstone (gemstone)", "Topaz",   //Gemstones
			"Al Capone", "Edmund Kemper", "Charles Manson", "Christer Pettersson", "Pablo Escobar", "Jack the Ripper", "John Dillinger", "Jeffrey Dahmer", "Clark Olofsson", "Donald Trump",    //Criminals
			"Mathematics", "Physics", "Astronomy", "Chemistry", "Language", "Woodworking", "Physical education", "Geography", "Painting", "Civics",   //School subjects
			"Floorball", "Karate", "Rallying", "Cricket", "American football", "Wrestling", "Badminton", "Curling", "Baseball", "Polo",    //Sports
			"Europe", "Asia", "Africa", "North America", "South America", "Australia", "Antarctica", //Continents
			"Midas", "Carl XVI Gustaf", "Louis XVI", "Henry VIII", "Ramesses II", "Leopold II of Belgium", "Cyrus the Great", "Richard I of England", "Akbar", "Emperor Meiji",  //Kings
			"Three Laws of Robotics", "Moore's law", "Newton's laws of motion", "Destiny", "Murphy's law", "Occam's razor", "Pareto principle", "Godwin's law", "Streisand effect", "Peter principle", //Not really laws
			"Scarlett Johansson", "Izabella Scorupco", "Marilyn Monroe", "Judi Dench", "Michelle Yeoh", "Audrey Hepburn", "Ana de Armas", "Madhubala", "Alicia Vikander", "Kate Winslet",   //Actresses
			"Lego", "Coca-Cola", "Adidas", "Samsung", "IKEA", "Thums up", "Kikkoman", "Saab Automobile", "Marmite", "Spendrups",  //Brands
			"Nixie (folklore)", "Chupacabra", "Bigfoot", "Unicorn", "Leprechaun", "Quetzalcōātl", "Storsjöodjuret", "Loch Ness Monster", "Garuda", "Slender Man", //Folklore
			"Boten Anna", "I'm Gonna Be (500 Miles)", "Nothing Else Matters", "Gangnam Style", "What a Wonderful World", "Africa (song)", "Oops!... I Did It Again (song)", "Naatu Naatu", "Du hast", "Cotton Eye Joe (Rednex song)", //Singles
			"Uluru", "Mount Fuji", "Grand Canyon", "Skogskyrkogården", "Victoria Falls", "Mount Everest", "Gobi Desert", "Goa", "Machu Picchu", "Mariana Trench", //Nature
			"Aftonbladet", "YouTube", "BBC", "Fox News", "Snapchat", "Myspace", "ICQ", "The Guardian", "Napster", "Internet Archive", //Online media
			"Battle of Poltava", "Battle of Gettysburg", "Normandy landings", "Battle of Hastings", "Siege of Baghdad", "Battle of Thermopylae", "Battle of Waterloo", "Battle of Midway", "Battle of Stalingrad", "Kargil War", //Battles
			"Plumber", "Mechanic", "Chef", "Aircraft pilot", "Programmer", "Barber", "Teacher", "Bus driver", "Copywriting", "Butler", //Professions
			"Sock", "Raincoat", "Sandal", "Sombrero", "Kimono", "Monocle", "Kerchief", "Sari", "Boot", "Jeans", //Clothes
			"Sweden", "India", "United Kingdom", "United States", "Turkey", "Paraguay", "Jamaica", "France", "Cambodia", "Rwanda", //Countries
			"Monty Python's Life of Brian", "Let the Right One In (film)", "Forrest Gump", "Train to Busan", "Dangal (2016 film)", "A Man Called Ove (film)", "RRR", "A Clockwork Orange (film)", "Pretty Woman", "Seven Samurai", //Movies
			"Little Boy", "Sabre", "AK-47", "Nunchaku", "Bow and arrow", "Bazooka", "Flail (weapon)", "Torpedo", "Thompson submachine gun", "Stiletto", //Weapons
			"MS-DOS", "Amiga 500", "Apple II", "Commodore 64", "Vectrex", "Vic-20", "IBM PC Series", "Macintosh 128K", "BBC Micro", "ZX Spectrum", //Retro computing
			"Pokémon", "Super Mario", "Half-Life (series)", "Fallout (franchise)", "Tomb Raider", "Minecraft (franchise)", "Uncharted", "FIFA (video game series)", "Grand Theft Auto", "Final Fantasy",  //Video game franchises
			"St Edward's Crown", "Wedding ring", "Necklace", "Body piercing", "Fabergé egg", "Tiara", "Earring", "Bangle", "Sceptre", "Crown of Erik XIV", //Jewelry
			"Coachella", "Super Bowl", "Saint Patrick's Day", "Diwali", "Midsummer", "Spiel", "Wimbledon Championships", "Kumbh Mela", "Cherry blossom", "Olympic Games", //Events
			"Wolfgang Amadeus Mozart", "Koji Kondo", "Hans Zimmer", "Antonio Vivaldi", "Ravi Shankar", "John Williams", "Danny Elfman", "Nobuo Uematsu", "Antonio Vivaldi", "Wilhelm Stenhammar",  //Composers
			"Kiwifruit", "Mango", "Apple", "Lime (fruit)", "Pumpkin", "Watermelon", "Banana", "Cherry", "Papaya", "Yuzu", //Fruits
			"C", "Morse code", "Å", "Z", "Infinity symbol", "Emoji", "Space (punctuation)", "Om", "Egyptian hieroglyphs", "Stop sign", //Symbols
			"Swedish riksdaler", "Dollar", "Japanese yen", "Rupee", "Dubloon", "Ancient drachma", "Coin", "Gold bar", "Deutsche Mark", "Banknote", //Money
			"Lassie", "Laika", "Hachikō", "Scooby-Doo", "Balto", "Bluey (TV series)", "Rin Tin Tin", "Doge (meme)", "Pluto (Disney)", "Huckleberry Hound", //Dogs
			"Whisky", "Bloody Mary (cocktail)", "Tea", "Eggnog", "Dr Pepper", "Water", "Sambuca", "Milk", "Cider", "Juice", //Drinks
			"Atom", "Virus", "Bacteria", "Magnetism", "Electricity", "Ultraviolet", "Radiation", "Gravity", "Dark matter", "Wi-Fi", //Invisible
			"Biryani", "Surströmming", "Sauerkraut", "Fish and chips", "Hamburger", "Chicken tikka masala", "Sushi", "Barbecue", "Pancake", "Pizza", //Food
			"Skateboard", "Pogo_stick", "Wheelchair", "Ice skate", "Unicycle", "Hovercraft", "Sled", "Tram", "Hot air balloon", "Elevator", //Transportation
			"Ganges", "Mississippi_River", "Göta älv", "River_Thames", "Nile", "Dalälven", "Shinano River", "Amazon River", "Danube", "Mekong", //Rivers
			"Buoy", "Sail", "Rudder", "Nautical_chart", "Sextant", "Anchor", "Compass", "Oar", "Knot", "Mast (sailing)" //Sailing
		],
		sv: [
			"Bamse", "Snobben", "Asterix", "Son-Goku", "Tintin", //Cartoons
			"Saturnus", "Internationella rymdstationen", "Hubbleteleskopet", "Vintergatan", "Komet", //Space
			"Charlie Chaplin", "Helan och Halvan", "Mr. Bean", "Abbott och Costello", "Benny Hill", //Slapstick
			"Jesus", "Mose", "Muhammed", "Buddha", "L. Ron Hubbard", //Religion
			"Fot", "Svans", "Öga", "Näbb", "Hjärta", //Body parts
			"Kattbjörn", "Näbbdjur", "Hammarhajar", "Surikat", "Kaniner", //Animals
			"Telefon", "Hjul", "Ångmaskin", "Dator", "Teslaspole", //Inventions
			"Rubin", "Diamant", "Akvamarin", "Safir", "Smaragd", //Gemstones
			"Al Capone", "Ed Kemper", "Charles Manson", "Christer Pettersson", "Pablo Escobar", //Criminals
			"Matematik", "Fysik", "Astronomi", "Kemi", "Språk", //School subjects
			"Innebandy", "Karate", "Rally", "Cricket", "Amerikansk fotboll", //Sports
			"Europa", "Asien", "Afrika", "Nordamerika", "Australien", //Continents
			"Midas", "Carl XVI Gustaf", "Ludvig XVI av Frankrike", "Henrik VIII av England", "Ramses II", //Kings
			"Robotikens lagar", "Moores lag", "Newtons rörelselagar", "Öde", "Murphys lag", //Not really laws
			"Scarlett Johansson", "Izabella Scorupco", "Marilyn Monroe", "Judi Dench", "Michelle Yeoh", //Actresses
			"Lego", "Coca-Cola", "Adidas", "Samsung", "Ikea", //Brands
			"Näcken", "Chupacabra", "Bigfoot", "Enhörning", "Leprechaun", //Folklore
			"Boten Anna", "I'm Gonna Be (500 Miles)", "Nothing Else Matters", "Gangnam Style", "What a Wonderful World", //Singles
			"Uluru", "Fuji", "Grand Canyon", "Skogskyrkogården", "Victoriafallen", //Nature
			"Aftonbladet", "Youtube", "BBC", "Fox News Channel", "Snapchat", //Online media
			"Slaget vid Poltava", "Slaget vid Gettysburg", "Landstigningen i Normandie", "Slaget vid Hastings", "Bagdads fall", //Battles
			"VVS-montör", "Mekaniker", "Kock", "Pilot", "Programmerare", //Professions
			"Strumpor", "Jacka", "Sandaler", "Sombrero", "Kimono", //Clothes
			"Sverige", "Indien", "Storbritannien", "USA", "Turkiet", //Countries
			"Ett herrans liv (film)", "Låt den rätte komma in (film)", "Forrest Gump", "Train to Busan", //Movies
			"Little Boy", "Sabel", "AK-47", "Nunchaku", "Pilbåge", //Weapons
			"MS-DOS", "Amiga 500", "Apple II", "Commodore 64", "Vectrex", //Retro computing
			"Pokémon", "Super Mario (datorspelsserie)", "Half-Life (spelserie)", "Fallout (spelserie)", "Tomb Raider (spelserie)", //Video game francises
			"S:t Edvards krona", "Vigselring", "Halsband", "Piercing", "Fabergéägg", //Jewelry
			"Coachella Valley Music and Arts Festival", "Super Bowl", "Saint Patrick’s Day", "Diwali", "Midsommar", //Events
			"Wolfgang Amadeus Mozart", "Koji Kondo", "Hans Zimmer", "Antonio Vivaldi", "Ravi Shankar", //Composers
			"Kiwi", "Mango (frukt)", "Äpple", "Lime", "Pumpa", //Fruits
			"C", "Morsealfabetet", "Å", "Z", "Lemniskata", //Symbols
			"Riksdaler", "Dollar", "Yen", "Rupie", "Guldmynt", //Money
			"Lassie", "Lajka", "Hachikō", "Scooby-Doo", "Balto", //Dogs
			"Whisky", "Bloody Mary (drink)", "Te", "Äggtoddy", "Dr Pepper", //Drinks
			"Atom", "Virus", "Bakterier", "Magnetism", "Elektricitet", //Invisible
			"Biryani", "Surströmming", "Surkål", "Fish_and_chips", "Hamburgare", //Food
			"Skateboard", "Hoppstylta", "Rullstol", "Skridskor", "Enhjuling", //Transportation
			"Ganges", "Mississippifloden", "Göta älv", "Themsen", "Nilen", //Rivers
			"Boj", "Segel", "Roder", "Sjökort", "Sextant" //Sailing
		]
	},
	blacklist: {
		articles: ['Main_Page'],
		prefix: ['Portal', 'Special', 'Help', 'File', 'Wikipedia', 'Template', 'Category', 'Template talk']
	}
}